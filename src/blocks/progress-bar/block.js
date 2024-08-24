import icon, { CircProgressIcon, LinearProgressIcon } from "./icons";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";

import { withSelect } from "@wordpress/data";

import "./blocks-styles";
import Circle from "./Circle";
import Line from "./Line";
import { useEffect } from "react";
import {
	TextControl,
	Button,
	ButtonGroup,
	ToolbarGroup,
	ToolbarButton,
	RangeControl,
	PanelBody,
	PanelRow,
	ToolbarDropdownMenu,
	ToggleControl,
} from "@wordpress/components";
import {
	BorderRadiusControl,
	CustomToggleGroupControl,
	SpacingControl,
} from "../components";
import { getStyles } from "./get-styles";
import HalfCircle from "./HalfCircle";
import metadata from "./block.json";
import { getParentBlock } from "../../common";

function ProgressBarMain(props) {
	const {
		attributes: {
			blockID,
			percentage,
			barType,
			detail,
			detailAlign,
			barColor,
			barBackgroundColor,
			barThickness,
			circleSize,
			labelColor,
			percentagePosition,
			barBorderRadius,
			isStripe,
			isCircleRounded,
			showNumber,
			numberPrefix,
			numberSuffix,
		},
		isSelected,
		setAttributes,
		block,
		rootBlockClientId,
		className,
	} = props;
	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId, percentage: 75 });
		} else {
			if (percentage === -1) {
				setAttributes({ percentage: 25 });
			}
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);

	const progressBarAttributes = {
		percent: percentage,
		barColor,
		barBackgroundColor,
		barThickness,
		labelColor,
		percentagePosition,
		isStripe,
		detailAlign,
		detail,
		setAttributes,
		alignment: detailAlign,
		showNumber,
		numberPrefix,
		numberSuffix,
	};

	const percentagePositionOptions = [
		{
			label: __("Top", "ultimate-blocks"),
			value: "top",
		},
		{
			label: __("Inside", "ultimate-blocks"),
			value: "inside",
		},
		{
			label: __("Bottom", "ultimate-blocks"),
			value: "bottom",
		},
	];
	const styles = getStyles(props.attributes);

	const blockClassName = className ?? props.attributes?.className ?? "";
	const isStyleCircle = blockClassName
		?.split(" ")
		.includes("is-style-ub-progress-bar-circle-wrapper");
	const isStyleHalfCircle = blockClassName
		?.split(" ")
		.includes("is-style-ub-progress-bar-half-circle-wrapper");
	const finalClassNames = ["ub_progress-bar", blockClassName];
	if ((isStyleCircle || isStyleHalfCircle) && isCircleRounded) {
		finalClassNames.push("rounded-circle");
	}
	const blockProps = useBlockProps({
		className: finalClassNames.join(" "),
		style: styles,
	});

	return (
		<>
			{isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<div className={"ub_progress_bar_range_toolbar_wrapper"}>
							<RangeControl
								className="ub_progress_bar_value"
								value={percentage}
								onChange={(value) => setAttributes({ percentage: value })}
								min={0}
								max={100}
							/>
							<TextControl
								className={"ub_progress_bar_range_number_input"}
								value={percentage}
								type={"number"}
								onChange={(value) =>
									setAttributes({
										percentage: Number.parseInt(value),
									})
								}
								min={0}
								max={100}
							/>
						</div>
					</ToolbarGroup>
					<ToolbarDropdownMenu
						icon={`editor-${
							detailAlign === "justify" ? detailAlign : "align" + detailAlign
						}`}
						controls={["left", "center", "right", "justify"].map((a) => ({
							icon: `editor-${a === "justify" ? a : "align" + a}`,
							onClick: () => setAttributes({ detailAlign: a }),
						}))}
					/>
				</BlockControls>
			)}
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("General", "ultimate-blocks")}>
							<br />
							{!isStyleCircle && !isStyleHalfCircle && (
								<CustomToggleGroupControl
									label={__("Percentage Position", "ultimate-blocks")}
									attributeKey="percentagePosition"
									options={percentagePositionOptions}
								/>
							)}
							{!isStyleCircle && !isStyleHalfCircle && (
								<ToggleControl
									checked={isStripe}
									label={__("Stripe", "ultimate-blocks")}
									onChange={() => setAttributes({ isStripe: !isStripe })}
								/>
							)}
							<RangeControl
								label={__("Value", "ultimate-blocks")}
								className="ub_progress_bar_value"
								value={percentage}
								onChange={(value) => setAttributes({ percentage: value })}
								min={0}
								max={100}
								allowReset
							/>
						</PanelBody>
						<PanelBody title={__("Number Settings", "ultimate-blocks")}>
							<ToggleControl
								checked={showNumber}
								label={__("Show Number", "ultimate-blocks")}
								onChange={() => setAttributes({ showNumber: !showNumber })}
							/>
							<TextControl
								label={__("Number Prefix", "ultimate-blocks")}
								value={numberPrefix}
								onChange={(newValue) =>
									setAttributes({ numberPrefix: newValue })
								}
							/>
							<TextControl
								label={__("Number Suffix", "ultimate-blocks")}
								value={numberSuffix}
								onChange={(newValue) =>
									setAttributes({ numberSuffix: newValue })
								}
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody title={__("Style")}>
							<RangeControl
								label={__("Thickness")}
								value={barThickness}
								onChange={(value) => setAttributes({ barThickness: value })}
								min={1}
								max={100}
								step={0.1}
								allowReset
							/>
							{(isStyleCircle || isStyleHalfCircle) && (
								<RangeControl
									label={__("Circle size")}
									value={circleSize}
									onChange={(value) => setAttributes({ circleSize: value })}
									min={50}
									max={600}
									allowReset
								/>
							)}
							<ToggleControl
								checked={isCircleRounded}
								label={__("Rounded", "ultimate-blocks")}
								onChange={() =>
									setAttributes({ isCircleRounded: !isCircleRounded })
								}
							/>
							<PanelColorSettings
								title={__("Color")}
								initialOpen={false}
								colorSettings={[
									{
										value: barColor,
										onChange: (barColor) => setAttributes({ barColor }),
										label: "Progress Bar Color",
									},
									{
										value: barBackgroundColor,
										onChange: (barBackgroundColor) =>
											setAttributes({
												barBackgroundColor,
											}),
										label: "Background Bar Color",
									},
									{
										value: labelColor,
										onChange: (labelColor) => setAttributes({ labelColor }),
										label: "Label Color",
									},
								]}
							/>
						</PanelBody>
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
					{!isStyleCircle && !isStyleHalfCircle && (
						<InspectorControls group="border">
							<BorderRadiusControl
								attrKey="barBorderRadius"
								label={__("Bar Border Radius", "ultimate-blocks")}
							/>
						</InspectorControls>
					)}
				</>
			)}
			<div {...blockProps}>
				{(isStyleCircle || isStyleHalfCircle) && (
					<div className="ub_progress-bar-text">
						<RichText
							tagName="p"
							style={{ textAlign: detailAlign }}
							placeholder={__("Progress bar description")}
							value={detail}
							onChange={(text) => setAttributes({ detail: text })}
							keepPlaceholderOnFocus={true}
						/>
					</div>
				)}
				{percentage > -1 && ( //linear progress bar fails to render properly unless a value of 0 or greater is inputted
					<>
						{!isStyleCircle && !isStyleHalfCircle && (
							<Line {...progressBarAttributes} />
						)}
						{isStyleCircle && (
							<Circle {...progressBarAttributes} size={circleSize} />
						)}
						{isStyleHalfCircle && (
							<HalfCircle {...progressBarAttributes} size={circleSize} />
						)}
					</>
				)}
			</div>
		</>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	icon,
	attributes: metadata.attributes,
	example: {
		attributes: {
			barColor: "#e11b4c",
			barThickness: 2,
		},
	},
	edit: withSelect((select, ownProps) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(ownProps.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);
		return {
			block,
			rootBlockClientId,
		};
	})(ProgressBarMain),

	save: () => null,
});
