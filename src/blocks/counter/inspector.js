import React from "react";
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, RangeControl, TextControl } from "@wordpress/components";
import {
	CustomFontSizePicker,
	CustomToggleGroupControl,
	SpacingControl,
	ColorSettings,
} from "../components";

function Inspector(props) {
	const { attributes, setAttributes } = props;

	const { startNumber, endNumber, prefix, suffix, animationDuration } =
		attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("General", "ultimate-blocks")}>
					<TextControl
						label={__("Starting Number", "ultimate-blocks")}
						type="number"
						min={0}
						value={startNumber}
						onChange={(newValue) => setAttributes({ startNumber: newValue })}
					/>
					<TextControl
						label={__("Ending Number", "ultimate-blocks")}
						type="number"
						min={0}
						value={endNumber}
						onChange={(newValue) => setAttributes({ endNumber: newValue })}
					/>
					<TextControl
						label={__("Prefix", "ultimate-blocks")}
						value={prefix}
						onChange={(newValue) => setAttributes({ prefix: newValue })}
					/>
					<TextControl
						label={__("Suffix", "ultimate-blocks")}
						value={suffix}
						onChange={(newValue) => setAttributes({ suffix: newValue })}
					/>
					<RangeControl
						label={__("Animation Duration (Seconds)", "ultimate-blocks")}
						value={animationDuration}
						onChange={(newValue) =>
							setAttributes({ animationDuration: newValue })
						}
						min={1}
						max={20}
					/>
					<CustomToggleGroupControl
						label={__("Label Alignment", "ultimate-blocks")}
						attributeKey="labelPosition"
						isBlock
						options={[
							{ label: __("Top", "ultimate-blocks"), value: "top" },
							{ label: __("Bottom", "ultimate-blocks"), value: "bottom" },
						]}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorSettings
					attrKey="labelColor"
					label={__("Label Color", "ultimate-blocks")}
				/>
			</InspectorControls>
			<InspectorControls group="typography">
				<CustomFontSizePicker
					attrKey={"counterFontSize"}
					label={__("Counter Font", "ultimate-blocks")}
				/>
				<CustomFontSizePicker
					attrKey={"labelFontSize"}
					label={__("Label Font", "ultimate-blocks")}
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
					<SpacingControl
						showByDefault
						sides={["all"]}
						attrKey="gap"
						label={__("Gap", "ultimate-blocks")}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}

export default Inspector;
