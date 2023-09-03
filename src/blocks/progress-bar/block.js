import icon, { CircProgressIcon, LinearProgressIcon } from "./icons";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;
const { BlockControls, InspectorControls, PanelColorSettings, RichText } =
	wp.blockEditor || wp.editor;

const { withSelect } = wp.data;

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
} from "../../components";
import { getStyles } from "./get-styles";

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
	const isStyleCircle = className
		.split(" ")
		.includes("is-style-ub-progress-bar-circle-wrapper");
	const isStyleHalfCircle = className
		.split(" ")
		.includes("is-style-ub-progress-bar-half-circle-wrapper");

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
							<ToggleControl
								checked={isStripe}
								label={__("Stripe", "ultimate-blocks")}
								onChange={() => setAttributes({ isStripe: !isStripe })}
							/>
						</PanelBody>
						<PanelBody title={__("Value")} initialOpen={false}>
							<RangeControl
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
					<InspectorControls group="border">
						<BorderRadiusControl
							attrKey="barBorderRadius"
							label={__("Bar Border Radius", "ultimate-blocks")}
						/>
					</InspectorControls>
				</>
			)}
			<div className={`ub_progress-bar ${className}`} style={styles}>
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
					</>
				)}
			</div>
		</>
	);
}

registerBlockType("ub/progress-bar", {
	title: __("Progress Bar"),
	description: __(
		"Add Cirle/Line Progress bar with this blocks. Comes with options to change thickness, color.",
		"ultimate-blocks"
	),
	icon,
	category: "ultimateblocks",
	keywords: [__("Progress Bar"), __("Ultimate Blocks")],

	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		percentage: {
			type: "number",
			default: -1,
		},
		barType: {
			type: "string",
			default: "linear", //choose between linear and circular
		},
		detail: {
			type: "string",
			default: "",
		},
		detailAlign: {
			type: "string",
			default: "left",
		},
		barColor: {
			type: "string",
			default: "#2DB7F5",
		},
		barBackgroundColor: {
			type: "string",
			default: "#d9d9d9",
		},
		barThickness: {
			type: "number",
			default: 1,
		},
		circleSize: {
			type: "number",
			default: 150,
		},
		labelColor: {
			type: "string",
			default: "",
		},
		percentagePosition: {
			type: "string",
			default: "bottom",
		},
		isStripe: {
			type: "boolean",
			default: false,
		},
		barBorderRadius: {
			type: "object",
			default: {},
		},
	},
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
