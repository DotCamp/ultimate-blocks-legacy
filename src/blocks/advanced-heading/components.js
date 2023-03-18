import "./formats/register-formats";
import fontsList from "./fonts";
import {
	textTransformOptions,
	fontWeightOptions,
	fontFamilyOptions,
} from "./settings-options";
import { h1Icon, h2Icon, h3Icon, h4Icon, h5Icon, h6Icon } from "./icons";

const { __ } = wp.i18n;
const {
	InspectorControls,
	BlockControls,
	PanelColorSettings,
	RichText,
	AlignmentToolbar,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	Button,
	ButtonGroup,
	RangeControl,
	SelectControl,
	DropdownMenu,
} = wp.components;
const { createRef, useEffect } = wp.element;
const { createBlock } = wp.blocks;

const AdvancedHeadingEdit = ({
	attributes,
	setAttributes,
	block,
	getBlock,
	getClientIdsWithDescendants,
	onReplace,
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
			let defaultFontSize = window.getComputedStyle(
				elementRef.current
			).fontSize;
			setAttributes({ fontSize: parseInt(defaultFontSize) });
		}

		if (!fontFamily) {
			let defaultFontFamily = window.getComputedStyle(
				elementRef.current
			).fontFamily;
			setAttributes({ fontFamily: defaultFontFamily });
		}

		if (!lineHeight) {
			let defaultLineHeight = window.getComputedStyle(
				elementRef.current
			).lineHeight;
			setAttributes({ lineHeight: parseInt(defaultLineHeight) });
		}
		if (blockID === "") {
			setAttributes({ blockID: block.clientId, level: "h2" });
		} else {
			if (!level) {
				setAttributes({ level: "h1" });
			}
			if (
				getClientIdsWithDescendants().some(
					(ID) =>
						"blockID" in getBlock(ID).attributes &&
						getBlock(ID).attributes.blockID === blockID
				)
			) {
				setAttributes({ blockID: block.clientId });
			}
		}
	}, [elementRef]);

	const headingIcons = [h1Icon, h2Icon, h3Icon, h4Icon, h5Icon, h6Icon];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("General", "ultimate-blocks")} intialOpen={true}>
					{/* Heading Level */}
					<p>{__("Heading Level", "ultimate-blocks")}</p>
					<ButtonGroup aria-label={__("Heading Level", "ultimate-blocks")}>
						{headingIcons.map((h, i) => (
							<Button
								onClick={() => {
									setAttributes({
										level: `h${i + 1}`,
										fontSize: 0,
										lineHeight: 0,
									});
								}}
								icon={h}
								key={i}
								isPrimary={level === `h${i + 1}`}
							/>
						))}
					</ButtonGroup>
					{/* Alignment */}
					<p>{__("Heading Alignment", "ultimate-blocks")}</p>
					<AlignmentToolbar
						value={alignment}
						onChange={(alignment) => setAttributes({ alignment })}
						isCollapsed={false}
					/>
				</PanelBody>
				<PanelBody
					title={__("Typography", "ultimate-blocks")}
					initialOpen={false}
				>
					{/* Font Size */}
					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={fontSize}
						onChange={(fontSize) => setAttributes({ fontSize })}
						min={12}
						max={100}
					/>
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
				<PanelBody title={__("Colors", "ultimate-blocks")} initialOpen={false}>
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
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<DropdownMenu
					className="ub_advanced_heading_toolbar_level_selector"
					icon={
						headingIcons[
							[...Array(6).keys()].map((a) => `h${a + 1}`).indexOf(level)
						]
					}
				>
					{({ onClose }) => (
						<>
							{headingIcons.map((h, i) => (
								<Button
									icon={h}
									onClick={() => {
										setAttributes({
											level: `h${i + 1}`,
											fontSize: 0,
											lineHeight: 0,
										});
										onClose();
									}}
									key={i}
									isPrimary={level === `h${i + 1}`}
								/>
							))}
						</>
					)}
				</DropdownMenu>
			</BlockControls>
			<link
				rel="stylesheet"
				href={`https://fonts.googleapis.com/css?family=${fontFamily}`}
			/>
			<RichText
				ref={elementRef}
				tagName={level || "h2"}
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
				onSplit={(contentFragment) =>
					contentFragment
						? createBlock("ub/advanced-heading", {
								...attributes,
								blockID: "",
								content: contentFragment,
						  })
						: createBlock("core/paragraph")
				}
				onReplace={onReplace}
			/>
		</>
	);
};

export default AdvancedHeadingEdit;
