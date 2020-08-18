import "./highlight-format.js";
import fontsList from "./fonts";
import { createRef, useEffect } from "react";
const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings, RichText, AlignmentToolbar } =
	wp.blockEditor || wp.editor;
const {
	PanelBody,
	Button,
	ButtonGroup,
	RangeControl,
	Dropdown,
	TextControl,
	SelectControl
} = wp.components;
const { applyFormat, removeFormat } = wp.richText;

const AdvancedHeadingEdit = ({ attributes, setAttributes, onChange }) => {
	const {
		content,
		level,
		alignment,
		textColor,
		backgroundColor,
		fontSize,
		textTransform,
		letterSpacing,
		fontFamily,
		fontWeight,
		lineHeight,
		highlightBgColor
	} = attributes;
	const headingLevels = [1, 2, 3, 4, 5, 6];
	const textTransformOptions = [
		{ value: "none", label: __("None", "ultimate-blocks") },
		{ value: "uppercase", label: __("Uppercase", "ultimate-blocks") },
		{ value: "lowercase", label: __("Lowercase", "ultimate-blocks") },
		{ value: "capitalize", label: __("Capitalize", "ultimate-blocks") }
	];
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
	const fontFamilyOptions = fontsList.sort().map(fontFamilyOption => {
		return {
			value: fontFamilyOption,
			label: __(fontFamilyOption, "ultimate-blocks")
		};
	});

	const elementRef = createRef();
	useEffect(() => {
		if (!fontSize) {
			let defaultFontSize = window.getComputedStyle(elementRef.current)
				.fontSize;

			defaultFontSize = Math.round(parseInt(defaultFontSize)) + "px";
			setAttributes({ fontSize: defaultFontSize });
		}

		if (!fontFamily) {
			let defaultFontFamily = window.getComputedStyle(elementRef.current)
				.fontFamily;
			setAttributes({ fontFamily: defaultFontFamily });
		}

		if (!lineHeight) {
			let defaultLineHeight = window.getComputedStyle(elementRef.current)
				.lineHeight;
			defaultLineHeight = Math.round(parseInt(defaultLineHeight)) + "px";
			setAttributes({ lineHeight: defaultLineHeight });
		}
	}, [elementRef]);

	/* Methods */
	const onChangeHeadingLevel = e => {
		const newHeadingLevel = e.target.innerText;
		setAttributes({ level: newHeadingLevel, fontSize: null, lineHeight: null });
	};

	const onChangeFontFamily = newFontFamily => {
		setAttributes({ fontFamily: newFontFamily });
	};
let highlightFontWeight;
	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Heading Settings", "ultimate-blocks")}>
					{/* Heading Level */}
					<p>{__("Heading Level", "ultimate-blocks")}</p>
					<ButtonGroup aria-label={__("Heading Level", "ultimate-blocks")}>
						{headingLevels.map(headingLevel => (
							<Button
								onClick={onChangeHeadingLevel}
								key={headingLevel}
								isPrimary={level === `h${headingLevel}`}
							>
								h{headingLevel}
							</Button>
						))}
					</ButtonGroup>
					{/* Alignment */}
					<p>{__("Heading Alignment", "ultimate-blocks")}</p>
					<AlignmentToolbar
						value={alignment}
						onChange={newAlignment =>
							setAttributes({ alignment: newAlignment })
						}
						isCollapsed={false}
					/>
					{/* Background & Text Color */}
					<PanelColorSettings
						title={__("Colors", "ultimate-blocks")}
						colorSettings={[
							{
								value: textColor,
								onChange: newTextColor =>
									setAttributes({ textColor: newTextColor }),
								label: __("Heading Text Color", "ultimate-blocks")
							},
							{
								value: backgroundColor,
								onChange: newBackgroundColor =>
									setAttributes({ backgroundColor: newBackgroundColor }),
								label: __("Heading Background Color", "ultimate-blocks")
							}
						]}
					/>
					{/* Font Size */}
					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={fontSize ? parseInt(fontSize) : 0}
						onChange={newFontSize => setAttributes({ fontSize: newFontSize })}
						min={12}
						max={100}
					/>
				</PanelBody>
				<PanelBody title={__("Typography Settings", "ultimate-blocks")}>
					{/* Text Transform */}
					<SelectControl
						label={__("Text transform", "ultimate-blocks")}
						options={textTransformOptions}
						value={textTransform}
						onChange={newTextTransform =>
							setAttributes({ textTransform: newTextTransform })
						}
					/>
					{/* Font Family */}
					<SelectControl
						label={__("Font Family", "ultimate-blocks")}
						options={fontFamilyOptions}
						value={fontsList.includes(fontFamily) ? fontFamily : "Default"}
						onChange={onChangeFontFamily}
					/>
					{/* Letter Spacing */}
					<RangeControl
						label={__("Letter Spacing", "ultimate-blocks")}
						value={letterSpacing}
						onChange={newLetterSpacing =>
							setAttributes({ letterSpacing: newLetterSpacing })
						}
						min={-2}
						max={6}
					/>
					{/* Font Weight */}
					<SelectControl
						label={__("Font Weight", "ultimate-blocks")}
						options={fontWeightOptions}
						value={fontWeight}
						onChange={newFontWeight =>
							setAttributes({ fontWeight: newFontWeight })
						}
					/>
					{/* Line Height */}
					<RangeControl
						label={__("Line Height", "ultimate-blocks")}
						value={lineHeight ? parseInt(lineHeight) : 0}
						onChange={newLineHeight =>
							setAttributes({ lineHeight: newLineHeight + "px" })
						}
						min={10}
						max={120}
					/>
		{/*<SelectControl
						label={__("Highlight Font Weight", "ultimate-blocks")}
						options={fontWeightOptions}
						value={highlightFontWeight}
						onChange={newFontWeight => {
							if (newFontWeight) {
								highlightFontWeight = newFontWeight;
								console.log("weight", highlightFontWeight);

								onChange(
									applyFormat(value, {
										type: name, //"highlight-font-weight",
										attributes: {
											style: `font-weight:${highlightFontWeight};color:${textColor}`
										}
									})
								);
								console.log("weight", highlightFontWeight);
							}
						}}
					/>*/}
				</PanelBody>
			</InspectorControls>
			<RichText
				ref={elementRef}
				tagName={level}
				value={content}
				onChange={value => setAttributes({ content: value })}
				style={{
					textAlign: alignment,
					color: textColor,
					backgroundColor,
					fontSize,
					letterSpacing,
					textTransform,
					fontFamily,
					fontWeight,
					lineHeight
				}}
			/>
		</>
	);
};

export default AdvancedHeadingEdit;
