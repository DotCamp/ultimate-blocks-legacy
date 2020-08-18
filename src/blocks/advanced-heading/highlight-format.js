const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { toggleFormat, applyFormat } = wp.richText;
const {
	RichTextToolbarButton,
	InspectorControls,
	PanelColorSettings
} = wp.editor;
const { registerFormatType } = wp.richText;
const { PanelBody, RangeControl, SelectControl } = wp.components;

const name = "ultimate-blocks/highlight";

export const highlight = {
	name,
	title: __("Highlight"),
	tagName: "span",
	className: "ub-highlight",
	attributes: {
		style: "style"
	},
	edit: ({ isActive, value, onChange }) => {
		const fontWeightOptions = [
			{ value: "Normal", label: __("Normal", "ultimate-blocks") },
			{ value: "Bold", label: __("Bold", "ultimate-blocks") },
			{ value: "100", label: __("100", "ultimate-blocks") },
			{ value: "200", label: __("200", "ultimate-blocks") },
			{ value: "300", label: __("300", "ultimate-blocks") },
			{ value: "400", label: __("400", "ultimate-blocks") },
			{ value: "500", label: __("500", "ultimate-blocks") },
			{ value: "600", label: __("600", "ultimate-blocks") },
			{ value: "700", label: __("700", "ultimate-blocks") },
			{ value: "800", label: __("800", "ultimate-blocks") },
			{ value: "900", label: __("900", "ultimate-blocks") }
		];

		var backgroundColor,
			textColor,
			fontSize = window.getComputedStyle(
				window.getSelection().anchorNode.parentNode
			).fontSize,
			highlightFontWeight,
			letterSpacing,
			textTransform;

		return (
			<InspectorControls>
				<PanelBody title={__("Highlight Settings", "ultimate-blocks")}>
					{/* Colors Settings */}
					<PanelColorSettings
						title={__("Highlight Colors")}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: color => {
									if (color) {
										backgroundColor = color;
										onChange(
											applyFormat(value, {
												type: "highlight",
												attributes: {
													style: `background-color:${backgroundColor}`
												}
											})
										);
										console.log(backgroundColor);
									}
								}
							},
							{
								value: textColor,
								onChange: color => {
									if (color) {
										textColor = color;
										onChange(
											applyFormat(value, {
												type: name, //"highlight-color",
												attributes: {
													style: `color:${textColor};font-weight:${highlightFontWeight}`
												}
											})
										);
									}
								}
							}
						]}
					/>
					{/* Font Size Settings */}
					<RangeControl
						label={__("Highlight Font Size", "ultimate-blocks")}
						value={parseInt(fontSize)}
						onChange={newFontSize => {
							if (newFontSize) {
								fontSize = newFontSize;
								console.log("size", fontSize);

								onChange(
									applyFormat(value, {
										type: "highlight-font-size",
										attributes: {
											style: `font-size:${fontSize}px`
										}
									})
								);
							}
						}}
						min={12}
						max={100}
					/>
					{/* Font Weight Settings */}
					<SelectControl
						label={__("Highlight Font Weight", "ultimate-blocks")}
						options={fontWeightOptions}
						value={highlightFontWeight}
						onChange={newFontWeight => {
							if (newFontWeight) {
								highlightFontWeight = newFontWeight;
								//console.log("value", value);
								textColor = window.getComputedStyle(
									window.getSelection().anchorNode.parentNode
								).color;
								onChange(
									applyFormat(value, {
										type: name, //"highlight-font-weight",
										attributes: {
											style: `font-weight:${highlightFontWeight};color:${textColor}`
										}
									})
								);
								console.log("color", textColor);
							}
						}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
};

[highlight].forEach(({ name, ...settings }) =>
	registerFormatType(name, settings)
);
//console.log(highlight)
