import { isEmpty } from "lodash";
import icon, {
	RegularCountdownIcon,
	CircularCountdownIcon,
	TickingCountdownIcon,
} from "./icon";
import Timer from "./components";
import { getParentBlock } from "../../common";
import { getStyles } from "./get-styles";
import "./blocks-styles";
import { ColorSettings, SpacingControl } from "../components/";

import { useEffect, useState } from "react";
import metadata from "./block.json";
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	RichText,
	PanelColorSettings,
	BlockControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	DateTimePicker,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
	RangeControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";

function CountdownMain(props) {
	const [forceUpdate, setForceUpdate] = useState(false);
	const { block, rootBlockClientId } = useSelect((select) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(props.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			rootBlockClientId,
		};
	});
	const {
		isSelected,
		setAttributes,
		attributes: {
			blockID,
			style,
			endDate,
			expiryMessage,
			circleColor,
			circleSize,
			messageAlign,
			largestUnit,
			smallestUnit,
			countdownColor,
			unitColor,
			className: blockClassName,
		},
	} = props;
	const blockStylesClass = [
		{
			id: "is-style-ub-countdown-odometer",
			type: "Odometer",
		},
		{
			id: "is-style-ub-countdown-regular",
			type: "Regular",
		},
		{
			id: "is-style-ub-countdown-circular",
			type: "Circular",
		},
	];
	const hasBlockClass = isEmpty(blockClassName)
		? false
		: blockClassName.split(" ").filter((blockClass) =>
				blockStylesClass.find((styleClass) => {
					if (styleClass.id.includes(blockClass)) {
						return styleClass;
					}
				}),
			).length > 0;
	useEffect(() => {
		const appliedStyleClass = blockStylesClass.find((styleClass) => {
			if (styleClass.type === style) {
				return styleClass;
			}
		});

		if (!hasBlockClass) {
			setAttributes({
				className: isEmpty(blockClassName)
					? appliedStyleClass.id
					: blockClassName + " " + appliedStyleClass.id,
				style: appliedStyleClass.type,
			});
		}
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}
	}, []);
	useEffect(() => {
		const appliedStyleClass = hasBlockClass
			? blockStylesClass.filter((styleClass) =>
					blockClassName
						.split(" ")
						.find((blockClass) => styleClass.id.includes(blockClass)),
				)
			: [];
		if (hasBlockClass && appliedStyleClass.length > 0) {
			setAttributes({ style: appliedStyleClass[0].type });
		}
	}, [blockClassName]);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);

	const timeUnits = ["week", "day", "hour", "minute", "second"];

	const styles = getStyles(props.attributes);
	return (
		<div {...useBlockProps()}>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Timer expiration")}>
							<div className="ub-date-time-picker">
								<DateTimePicker
									currentDate={endDate * 1000}
									onChange={(value) => {
										setAttributes({
											endDate: Math.floor(Date.parse(value) / 1000),
										});
									}}
								/>
							</div>
						</PanelBody>
						<PanelBody title={__("Displaying unit")} initialOpen={false}>
							<SelectControl
								label={__("Largest unit")}
								value={largestUnit}
								options={timeUnits
									.filter((_, i) => timeUnits.indexOf(smallestUnit) > i)
									.map((timeUnit) => ({
										label: __(timeUnit),
										value: timeUnit,
									}))}
								onChange={(largestUnit) => {
									setAttributes({ largestUnit });
									setForceUpdate(true);
								}}
							/>
							<SelectControl
								label={__("Smallest unit")}
								value={smallestUnit}
								options={timeUnits
									.filter((_, i) => timeUnits.indexOf(largestUnit) < i)
									.map((timeUnit) => ({
										label: __(timeUnit),
										value: timeUnit,
									}))}
								onChange={(smallestUnit) => {
									setAttributes({ smallestUnit });
									setForceUpdate(true);
								}}
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="color">
						{style === "Circular" && (
							<ColorSettings
								attrKey="circleColor"
								label={__("Circle Color", "ultimate-blocks")}
							/>
						)}
						<ColorSettings
							attrKey="countdownColor"
							label={__("Countdown Color", "ultimate-blocks")}
						/>
						<ColorSettings
							attrKey="unitColor"
							label={__("Unit Color", "ultimate-blocks")}
						/>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody
							title={__("Dimension Settings", "ultimate-blocks")}
							initialOpen={false}
						>
							<SpacingControl
								showByDefault
								attrKey="padding"
								label={__("Padding", "ultimate-blocks")}
							/>
							<SpacingControl
								minimumCustomValue={-Infinity}
								showByDefault
								attrKey="margin"
								label={__("Margin", "ultimate-blocks")}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			)}
			{isSelected && (
				<BlockControls>
					<ToolbarGroup>
						{["left", "center", "right", "justify"].map((a) => (
							<ToolbarButton
								icon={`editor-${a === "justify" ? a : "align" + a}`}
								label={__(
									(a !== "justify" ? "Align " : "") +
										a[0].toUpperCase() +
										a.slice(1),
								)}
								isActive={messageAlign === a}
								onClick={() => setAttributes({ messageAlign: a })}
							/>
						))}
					</ToolbarGroup>
				</BlockControls>
			)}
			<div className="ub-countdown-wrapper" style={styles}>
				<Timer
					timerStyle={style}
					deadline={endDate}
					color={circleColor}
					size={circleSize}
					largestUnit={largestUnit}
					smallestUnit={smallestUnit}
					isAnimated={true}
					forceUpdate={forceUpdate}
					countdownColor={countdownColor}
					unitColor={unitColor}
					finishForcedUpdate={() => setForceUpdate(false)}
				/>
				<RichText
					tagName="div"
					placeholder={__("Text to show after the countdown is over")}
					style={{ textAlign: messageAlign }}
					value={expiryMessage}
					onChange={(text) => setAttributes({ expiryMessage: text })}
					keepPlaceholderOnFocus={true}
				/>
			</div>
		</div>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	attributes: metadata.attributes,
	icon: icon,
	category: "ultimateblocks",
	example: {},
	edit: CountdownMain,
	save: () => null,
});
