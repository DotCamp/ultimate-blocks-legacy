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
		},
		isSelected,
		setAttributes,
		block,
		getBlock,
		getClientIdsWithDescendants,
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
		setAttributes({ blockID: block.clientId });
	}, [block.clientId]);

	const progressBarAttributes = {
		percent: percentage,
		barColor,
		barBackgroundColor,
		barThickness,
		labelColor,
		percentagePosition,
		isStripe,
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
	const blockProps = useBlockProps({
		className: `ub_progress-bar ${blockClassName}`,
		style: styles,
	});

	return (
		<>
			{isSelected && (
				<BlockControls>
					{/* 
					 Convert into styles api
					<ToolbarGroup>
						<ToolbarButton
							isPressed={barType === "linear"}
							showTooltip={true}
							label={__("Horizontal")}
							onClick={() => setAttributes({ barType: "linear" })}
						>
							<LinearProgressIcon />
						</ToolbarButton>
						<ToolbarButton
							isPressed={barType === "circular"}
							showTooltip={true}
							label={__("Circular")}
							onClick={() => setAttributes({ barType: "circular" })}
						>
							<CircProgressIcon />
						</ToolbarButton>
					</ToolbarGroup> */}
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
						<PanelBody title={__("General")}>
							{/* 
							 Convert into styles api
							<PanelRow>
								<p>{__("Progress Bar Type")}</p>
								<ButtonGroup>
									<Button
										isPressed={barType === "linear"}
										showTooltip={true}
										label={__("Horizontal")}
										onClick={() => setAttributes({ barType: "linear" })}
									>
										<LinearProgressIcon size={30} />
									</Button>
									<Button
										isPressed={barType === "circular"}
										showTooltip={true}
										label={__("Circular")}
										onClick={() =>
											setAttributes({
												barType: "circular",
											})
										}
									>
										<CircProgressIcon size={30} />
									</Button>
								</ButtonGroup>
							</PanelRow> */}
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
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody title={__("Style")}>
							<RangeControl
								label={__("Thickness")}
								value={barThickness}
								onChange={(value) => setAttributes({ barThickness: value })}
								min={1}
								max={5}
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
					</InspectorControls>
					{!isStyleCircle && !isStyleHalfCircle && (
						<InspectorControls group="border">
							<BorderRadiusControl
								attrKey="barBorderRadius"
								label={__("Bar Border Radius", "ultimate-blocks")}
							/>
						</InspectorControls>
					)}
					<InspectorControls group="dimensions">
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
					</InspectorControls>
				</>
			)}
			<div {...blockProps}>
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
				{percentage > -1 && ( //linear progress bar fails to render properly unless a value of 0 or greater is inputted
					<>
						{!isStyleCircle && !isStyleHalfCircle && (
							<Line {...progressBarAttributes} />
						)}
						{isStyleCircle && (
							<Circle
								{...progressBarAttributes}
								alignment={detailAlign}
								size={circleSize}
							/>
						)}
						{isStyleHalfCircle && (
							<HalfCircle
								{...progressBarAttributes}
								alignment={detailAlign}
								size={circleSize}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
}

registerBlockType(metadata, {
	icon,
	attributes: metadata.attributes,
	example: {
		attributes: {
			barColor: "#e11b4c",
			barThickness: 2,
		},
	},
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(ProgressBarMain),

	save: () => null,
});
