import React from "react";
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	BaseControl,
	RangeControl,
	TextControl,
} from "@wordpress/components";

function Inspector(props) {
	const { attributes, setAttributes } = props;

	const { startNumber, endNumber, prefix, suffix, animationDuration } =
		attributes;

	return (
		<InspectorControls>
			<PanelBody title={__("General", "ultimate-blocks")}>
				<TextControl
					label={__("Starting Number", "ultimate-blocks")}
					type="number"
					value={startNumber}
					onChange={(newValue) => setAttributes({ startNumber: newValue })}
				/>

				<TextControl
					label={__("Ending Number", "ultimate-blocks")}
					type="number"
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
			</PanelBody>
		</InspectorControls>
	);
}

export default Inspector;
