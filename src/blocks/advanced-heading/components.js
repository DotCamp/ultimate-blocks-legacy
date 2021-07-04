import "./formats/register-formats";
import fontsList from "./fonts";
import {
	headingLevels,
	textTransformOptions,
	fontWeightOptions,
	fontFamilyOptions,
} from "./settings-options";

const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings, RichText, AlignmentToolbar } =
	wp.blockEditor || wp.editor;
const {
	PanelBody,
	Button,
	ButtonGroup,
	RangeControl,
	SelectControl,
} = wp.components;
const { createRef, useEffect } = wp.element;

const AdvancedHeadingEdit = ({
	attributes,
	setAttributes,
	block,
	getBlock,
	getClientIdsWithDescendants,
}) => {
	const {
		blockID,
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
	} = attributes;

	/* set default values for the style attributes */
	const elementRef = createRef();
	useEffect(() => {
		if (!fontSize) {
			let defaultFontSize = window.getComputedStyle(elementRef.current)
				.fontSize;
			setAttributes({ fontSize: parseInt(defaultFontSize) });
		}

		if (!fontFamily) {
			let defaultFontFamily = window.getComputedStyle(elementRef.current)
				.fontFamily;
			setAttributes({ fontFamily: defaultFontFamily });
		}

		if (!lineHeight) {
			let defaultLineHeight = window.getComputedStyle(elementRef.current)
				.lineHeight;
			setAttributes({ lineHeight: parseInt(defaultLineHeight) });
		}
		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}, [elementRef]);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Heading Settings", "ultimate-blocks")}
					intialOpen={false}
				>
					{/* Heading Level */}
					<p>{__("Heading Level", "ultimate-blocks")}</p>
					<ButtonGroup aria-label={__("Heading Level", "ultimate-blocks")}>
						{headingLevels.map((headingLevel) => (
							<Button
								onClick={() => {
									setAttributes({
										level: `h${headingLevel}`,
										fontSize: 0,
										lineHeight: 0,
									});
								}}
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
						onChange={(alignment) => setAttributes({ alignment })}
						isCollapsed={false}
					/>
					{/* Background & Text Color */}
					<PanelColorSettings
						title={__("Colors", "ultimate-blocks")}
						colorSettings={[
							{
								value: textColor,
								onChange: (textColor) => setAttributes({ textColor }),
								label: __("Heading Text Color", "ultimate-blocks"),
							},
							{
								value: backgroundColor,
								onChange: (backgroundColor) =>
									setAttributes({ backgroundColor }),
								label: __("Heading Background Color", "ultimate-blocks"),
							},
						]}
					/>
					{/* Font Size */}
					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={fontSize}
						onChange={(fontSize) => setAttributes({ fontSize })}
						min={12}
						max={100}
					/>
				</PanelBody>
				<PanelBody
					title={__("Typography Settings", "ultimate-blocks")}
					intialOpen={false}
				>
					{/* Text Transform */}
					<SelectControl
						label={__("Text Transform", "ultimate-blocks")}
						options={textTransformOptions}
						value={textTransform}
						onChange={(textTransform) => setAttributes({ textTransform })}
					/>
					{/* Font Family */}
					<SelectControl
						label={__("Font Family", "ultimate-blocks")}
						options={fontFamilyOptions}
						value={fontsList.includes(fontFamily) ? fontFamily : "Default"}
						onChange={(fontFamily) => setAttributes({ fontFamily })} //default doesn't work here
					/>
					{/* Letter Spacing */}
					<RangeControl
						label={__("Letter Spacing", "ultimate-blocks")}
						value={letterSpacing}
						onChange={(letterSpacing) => setAttributes({ letterSpacing })}
						min={-2}
						max={6}
					/>
					{/* Font Weight */}
					<SelectControl
						label={__("Font Weight", "ultimate-blocks")}
						options={fontWeightOptions}
						value={fontWeight}
						onChange={(fontWeight) => setAttributes({ fontWeight })}
					/>
					{/* Line Height */}
					<RangeControl
						label={__("Line Height", "ultimate-blocks")}
						value={lineHeight}
						onChange={(lineHeight) => setAttributes({ lineHeight })}
						min={10}
						max={120}
					/>
				</PanelBody>
			</InspectorControls>
			<RichText
				ref={elementRef}
				tagName={level}
				value={content}
				onChange={(value) => setAttributes({ content: value })}
				style={{
					textAlign: alignment,
					color: textColor,
					backgroundColor,
					fontSize: fontSize ? `${fontSize}px` : null,
					letterSpacing,
					textTransform,
					fontFamily: fontFamily.includes(" ") ? `'${fontFamily}'` : fontFamily,
					fontWeight,
					lineHeight: lineHeight ? `${lineHeight}px` : null,
				}}
			/>
		</>
	);
};

export default AdvancedHeadingEdit;
