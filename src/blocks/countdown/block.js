import icon, {
	RegularCountdownIcon,
	CircularCountdownIcon,
	TickingCountdownIcon,
} from "./icon";

import Timer from "./components";

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
	const { block, getBlock, parentID, getClientIdsWithDescendants, getBlocks } =
		useSelect((select) => {
			const {
				getBlock,
				getBlockRootClientId,
				getClientIdsWithDescendants,
				getBlocks,
			} = select("core/block-editor") || select("core/editor");

			return {
				getBlock,
				block: getBlock(props.clientId),
				parentID: getBlockRootClientId(props.clientId),
				getClientIdsWithDescendants,
				getBlocks,
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
		},
	} = props;

	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

	const timeUnits = ["week", "day", "hour", "minute", "second"];

	return (
		<div {...useBlockProps()}>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Timer expiration")}>
							<DateTimePicker
								currentDate={endDate * 1000}
								onChange={(value) => {
									setAttributes({
										endDate: Math.floor(Date.parse(value) / 1000),
									});
								}}
							/>
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

					{style === "Circular" && (
						<InspectorControls group="styles">
							<PanelBody title={__("Circle style")}>
								<PanelColorSettings
									title={__("Color")}
									initialOpen={true}
									colorSettings={[
										{
											value: circleColor,
											onChange: (colorValue) =>
												setAttributes({ circleColor: colorValue }),
											label: "",
										},
									]}
								/>
								<RangeControl
									label={__("Size")}
									value={circleSize}
									onChange={(circleSize) => setAttributes({ circleSize })}
									min={30}
									max={100}
								/>
							</PanelBody>
						</InspectorControls>
					)}
				</>
			)}
			{isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							isPrimary={style === "Regular"}
							icon={RegularCountdownIcon}
							label={__("Regular")}
							onClick={() => setAttributes({ style: "Regular" })}
						/>
						<ToolbarButton
							isPrimary={style === "Circular"}
							icon={CircularCountdownIcon}
							label={__("Circular")}
							onClick={() => setAttributes({ style: "Circular" })}
						/>
						<ToolbarButton
							isPrimary={style === "Odometer"}
							icon={TickingCountdownIcon}
							label={__("Odometer")}
							onClick={() => setAttributes({ style: "Odometer" })}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						{["left", "center", "right", "justify"].map((a) => (
							<ToolbarButton
								icon={`editor-${a === "justify" ? a : "align" + a}`}
								label={__(
									(a !== "justify" ? "Align " : "") +
										a[0].toUpperCase() +
										a.slice(1)
								)}
								isActive={messageAlign === a}
								onClick={() => setAttributes({ messageAlign: a })}
							/>
						))}
					</ToolbarGroup>
				</BlockControls>
			)}
			<>
				<Timer
					timerStyle={style}
					deadline={endDate}
					color={circleColor}
					size={circleSize}
					largestUnit={largestUnit}
					smallestUnit={smallestUnit}
					isAnimated={true}
					forceUpdate={forceUpdate}
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
			</>
		</div>
	);
}

registerBlockType(metadata, {
	icon: icon,
	category: "ultimateblocks",
	example: {},
	edit: CountdownMain,
	save: () => null,
});
