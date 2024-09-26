import "./formats/register-formats";
import fontsList from "./fonts";
import { useSelect } from "@wordpress/data";
import {
	textTransformOptions,
	fontWeightOptions,
	fontFamilyOptions,
} from "./settings-options";
import { h1Icon, h2Icon, h3Icon, h4Icon, h5Icon, h6Icon } from "./icons";
import { SpacingControl } from "../components";
import { generateStyles, getSpacingCss } from "../utils/styling-helpers";
import { getParentBlock } from "../../common";
import { isNumber } from "lodash";
import { __ } from "@wordpress/i18n";
import {
	InspectorControls,
	BlockControls,
	PanelColorSettings,
	RichText,
	useBlockProps,
	AlignmentToolbar,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Button,
	ButtonGroup,
	RangeControl,
	SelectControl,
	DropdownMenu,
} from "@wordpress/components";
import { createRef, useEffect } from "@wordpress/element";
import { createBlock } from "@wordpress/blocks";

const AdvancedHeadingEdit = ({
	attributes,
	setAttributes,
	onReplace,
	clientId,
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
		padding,
		margin,
	} = attributes;

	const { block, rootBlockClientId } = useSelect((select) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			rootBlockClientId,
		};
	});
	/* set default values for the style attributes */
	const elementRef = createRef();
	useEffect(() => {
		if (!fontSize) {
			let defaultFontSize = window.getComputedStyle(
				elementRef.current,
			).fontSize;
			setAttributes({ fontSize: parseInt(defaultFontSize) });
		}

		if (!fontFamily) {
			let defaultFontFamily = window.getComputedStyle(
				elementRef.current,
			).fontFamily;
			setAttributes({ fontFamily: defaultFontFamily });
		}

		if (!lineHeight) {
			let defaultLineHeight = window.getComputedStyle(
				elementRef.current,
			).lineHeight;
			setAttributes({ lineHeight: parseInt(defaultLineHeight) });
		}
		if (blockID === "") {
			setAttributes({ blockID: block.clientId, level: "h2" });
		} else {
			if (!level) {
				setAttributes({ level: "h1" });
			}
		}
	}, [elementRef]);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const paddingObj = getSpacingCss(padding);
	const marginObj = getSpacingCss(margin);

	// Clean up the content from img and script tags.
	useEffect(() => {
		const imgTagRegex = /<img[^>]+>/i;
		const imgTagCleaned = content.replace(imgTagRegex, "");

		const scriptTagRegex = /<script[^>]*?>.*?<\/script>/is;
		const allCleaned = imgTagCleaned.replace(scriptTagRegex, "");

		setAttributes({ content: allCleaned });
	}, []);

	const headingIcons = [h1Icon, h2Icon, h3Icon, h4Icon, h5Icon, h6Icon];
	const styles = {
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: marginObj?.top,
		marginRight: marginObj?.right,
		marginBottom: marginObj?.bottom,
		marginLeft: marginObj?.left,
		textAlign: alignment,
		color: textColor,
		backgroundColor,
		fontSize: fontSize ? `${fontSize}px` : null,
		letterSpacing: isNumber(letterSpacing) ? `${letterSpacing}px` : "",
		textTransform,
		fontFamily: fontFamily.includes(" ") ? `'${fontFamily}'` : fontFamily,
		fontWeight,
		lineHeight: lineHeight ? `${lineHeight}px` : null,
	};
	return (
		<div {...useBlockProps()}>
			<InspectorControls group="settings">
				<PanelBody title={__("General", "ultimate-blocks")} intialOpen={true}>
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
					<p>{__("Heading Alignment", "ultimate-blocks")}</p>
					<AlignmentToolbar
						value={alignment}
						onChange={(alignment) => setAttributes({ alignment })}
						isCollapsed={false}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody title={__("Colors", "ultimate-blocks")} initialOpen={true}>
					<PanelColorSettings
						title={__("Heading Colors", "ultimate-blocks")}
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
				<PanelBody
					title={__("Typography", "ultimate-blocks")}
					initialOpen={false}
				>
					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={fontSize}
						onChange={(fontSize) => setAttributes({ fontSize })}
						min={12}
						max={100}
					/>
					<SelectControl
						label={__("Text Transform", "ultimate-blocks")}
						options={textTransformOptions}
						value={textTransform}
						onChange={(textTransform) => setAttributes({ textTransform })}
					/>
					<SelectControl
						label={__("Font Family", "ultimate-blocks")}
						options={fontFamilyOptions}
						value={fontsList.includes(fontFamily) ? fontFamily : "Default"}
						onChange={(fontFamily) => setAttributes({ fontFamily })} //default doesn't work here
					/>
					<RangeControl
						label={__("Letter Spacing", "ultimate-blocks")}
						value={letterSpacing}
						onChange={(letterSpacing) => setAttributes({ letterSpacing })}
						min={-2}
						max={6}
					/>
					<SelectControl
						label={__("Font Weight", "ultimate-blocks")}
						options={fontWeightOptions}
						value={fontWeight}
						onChange={(fontWeight) => setAttributes({ fontWeight })}
					/>
					<RangeControl
						label={__("Line Height", "ultimate-blocks")}
						value={lineHeight}
						onChange={(lineHeight) => setAttributes({ lineHeight })}
						min={10}
						max={120}
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
				placeholder={__("Write heading...", "ultimate-blocks")}
				onChange={(value) => setAttributes({ content: value })}
				style={generateStyles(styles)}
				identifier="content"
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
		</div>
	);
};

export default AdvancedHeadingEdit;
