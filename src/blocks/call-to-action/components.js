import { useEffect, useState } from "react";
import { SpacingControl } from "../components";
import { getStyles } from "./get-styles";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import {
	RichText,
	ColorPalette,
	InspectorControls,
	URLInput,
	BlockControls,
	PanelColorSettings,
	useBlockProps,
} from "@wordpress/block-editor";

import {
	PanelBody,
	Icon,
	Button,
	ToolbarGroup,
	ToolbarButton,
	RangeControl,
	CheckboxControl,
	ToggleControl,
	SelectControl,
} from "@wordpress/components";
import { getParentBlock } from "../../common";

export const blockControls = (props) => {
	const { editable, attributes, setAttributes } = props;

	const { headAlign, contentAlign } = attributes;

	return (
		<BlockControls>
			{["header", "content"].includes(editable) && (
				<ToolbarGroup>
					{["left", "center", "right", "justify"]
						.slice(0, editable === "header" ? 3 : 4)
						.map((a) => (
							<ToolbarButton
								icon={`editor-${a === "justify" ? a : "align" + a}`}
								label={__(
									(a !== "justify" ? "Align " : "") +
										a[0].toUpperCase() +
										a.slice(1),
								)}
								isActive={
									(editable === "header" ? headAlign : contentAlign) === a
								}
								onClick={() =>
									setAttributes(
										editable === "header"
											? { headAlign: a }
											: { contentAlign: a },
									)
								}
							/>
						))}
				</ToolbarGroup>
			)}
		</BlockControls>
	);
};

export const inspectorControls = (props) => {
	const { attributes, setAttributes } = props;

	const {
		ctaBackgroundColor,
		ctaBorderColor,
		headFontSize,
		headColor,
		contentColor,
		contentFontSize,
		buttonWidth,
		buttonFontSize,
		buttonColor,
		buttonTextColor,
		addNofollow,
		openInNewTab,
		linkIsSponsored,
		useHeadingTag,
		selectedHeadingTag,
	} = attributes;

	const headingTagOptions = [
		{ value: "h2", label: __("H2", "ultimate-blocks") },
		{ value: "h3", label: __("H3", "ultimate-blocks") },
		{ value: "h4", label: __("H4", "ultimate-blocks") },
		{ value: "h5", label: __("H5", "ultimate-blocks") },
		{ value: "h6", label: __("H6", "ultimate-blocks") },
	];

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={__("Headline", "ultimate-blocks")}
					initialOpen={false}
				>
					{typeof useHeadingTag !== "undefined" && (
						<ToggleControl
							label={__("Use Heading Tag", "ultimate-blocks")}
							checked={useHeadingTag}
							onChange={() =>
								setAttributes({
									useHeadingTag: !useHeadingTag,
								})
							}
						/>
					)}
					{useHeadingTag && (
						<SelectControl
							label={__("Select Heading Tag", "ultimate-blocks")}
							options={headingTagOptions}
							value={selectedHeadingTag}
							onChange={(selectedHeadingTag) =>
								setAttributes({ selectedHeadingTag })
							}
						/>
					)}
				</PanelBody>
				<PanelBody title={__("Link", "ultimate-blocks")} initialOpen={false}>
					<CheckboxControl
						label={__("Add Nofollow to Link", "ultimate-blocks")}
						checked={addNofollow}
						onChange={() => setAttributes({ addNofollow: !addNofollow })}
					/>
					<CheckboxControl
						label={__("Open Link in New Tab", "ultimate-blocks")}
						checked={openInNewTab}
						onChange={() => setAttributes({ openInNewTab: !openInNewTab })}
					/>
					<CheckboxControl
						label={__("Mark link as sponsored")}
						checked={linkIsSponsored}
						onChange={() =>
							setAttributes({
								linkIsSponsored: !linkIsSponsored,
							})
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody
					title={__("Headline", "ultimate-blocks")}
					initialOpen={false}
				>
					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={headFontSize}
						onChange={(value) => setAttributes({ headFontSize: value })}
						min={10}
						max={200}
						beforeIcon="editor-textcolor"
						allowReset
					/>
					<p>
						{__("Color", "ultimate-blocks")}
						{headColor && (
							<span
								className="component-color-indicator"
								aria-label={`(Color: ${headColor})`}
								style={{ background: headColor }}
							/>
						)}
					</p>
					<ColorPalette
						value={headColor}
						onChange={(headColor) => setAttributes({ headColor })}
					/>
				</PanelBody>
				<PanelColorSettings
					title={__("Color", "ultimate-blocks")}
					initialOpen={false}
					colorSettings={[
						{
							value: ctaBackgroundColor,
							onChange: (ctaBackgroundColor) =>
								setAttributes({ ctaBackgroundColor }),
							label: __("Background Color", "ultimate-blocks"),
						},
						{
							value: ctaBorderColor,
							onChange: (ctaBorderColor) => setAttributes({ ctaBorderColor }),
							label: __("Border Color", "ultimate-blocks"),
						},
					]}
				/>
				<PanelBody title={__("Content", "ultimate-blocks")} initialOpen={false}>
					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={contentFontSize}
						onChange={(value) => setAttributes({ contentFontSize: value })}
						min={10}
						max={200}
						beforeIcon="editor-textcolor"
						allowReset
					/>
					<p>
						{__("Color", "ultimate-blocks")}
						{contentColor && (
							<span
								className="component-color-indicator"
								aria-label={`(Color: ${contentColor})`}
								style={{ background: contentColor }}
							/>
						)}
					</p>

					<ColorPalette
						value={contentColor}
						onChange={(contentColor) => setAttributes({ contentColor })}
					/>
				</PanelBody>
				<PanelBody title={__("Button", "ultimate-blocks")} initialOpen={false}>
					<RangeControl
						label={__("Button Width", "ultimate-blocks")}
						value={buttonWidth}
						onChange={(value) => setAttributes({ buttonWidth: value })}
						min={10}
						max={500}
						beforeIcon="editor-code"
						allowReset
					/>

					<RangeControl
						label={__("Font Size", "ultimate-blocks")}
						value={buttonFontSize}
						onChange={(value) => setAttributes({ buttonFontSize: value })}
						min={10}
						max={200}
						beforeIcon="editor-textcolor"
						allowReset
					/>
					<p>
						{__("Button Color", "ultimate-blocks")}
						{buttonColor && (
							<span
								className="component-color-indicator"
								aria-label={`(Color: ${buttonColor})`}
								style={{ background: buttonColor }}
							/>
						)}
					</p>
					<ColorPalette
						value={buttonColor}
						onChange={(buttonColor) => setAttributes({ buttonColor })}
					/>

					<p>
						{__("Button Text Color", "ultimate-blocks")}
						{buttonTextColor && (
							<span
								className="component-color-indicator"
								aria-label={`(Color: ${buttonTextColor})`}
								style={{ background: buttonTextColor }}
							/>
						)}
					</p>
					<ColorPalette
						value={buttonTextColor}
						onChange={(buttonTextColor) => setAttributes({ buttonTextColor })}
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
		</>
	);
};

export const editorDisplay = (props) => {
	const { isSelected, attributes, setAttributes, setEditable } = props;

	const {
		headFontSize,
		headColor,
		headAlign,
		contentAlign,
		contentColor,
		contentFontSize,
		buttonWidth,
		buttonFontSize,
		buttonColor,
		buttonTextColor,
		ub_call_to_action_headline_text,
		ub_cta_content_text,
		ub_cta_button_text,
		useHeadingTag,
	} = attributes;
	const styles = getStyles(attributes);
	return (
		<>
			<div className="ub_call_to_action" style={styles}>
				<div className="ub_call_to_action_headline">
					<RichText
						tagName={useHeadingTag ? "h2" : "p"}
						placeholder={__("CTA Title Goes Here", "ultimate-blocks")}
						className="ub_call_to_action_headline_text"
						style={{
							fontSize: headFontSize + "px",
							color: headColor || "inherit",
							textAlign: headAlign,
						}}
						onChange={(value) =>
							setAttributes({
								ub_call_to_action_headline_text: value,
							})
						}
						value={ub_call_to_action_headline_text}
						allowedFormats={["core/bold", "core/italic", "core/strikethrough"]}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => setEditable("header")}
					/>
				</div>

				<div className="ub_call_to_action_content">
					<RichText
						tagName="p"
						placeholder={__("Add Call to Action Text Here", "ultimate-blocks")}
						className="ub_cta_content_text"
						style={{
							fontSize: contentFontSize + "px",
							color: contentColor || "inherit",
							textAlign: contentAlign,
						}}
						onChange={(value) => setAttributes({ ub_cta_content_text: value })}
						value={ub_cta_content_text}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => setEditable("content")}
					/>
				</div>

				<div className="ub_call_to_action_button">
					<span
						className={`wp-block-button ub_cta_button`}
						style={{
							backgroundColor: buttonColor,
							width: buttonWidth + "px",
						}}
					>
						<RichText
							tagName="p"
							placeholder={__("Button Text", "ultimate-blocks")}
							className="ub_cta_button_text"
							style={{
								color: buttonTextColor || "inherit",
								fontSize: buttonFontSize + "px",
							}}
							onChange={(value) => setAttributes({ ub_cta_button_text: value })}
							value={ub_cta_button_text}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={() => setEditable("button")}
						/>
					</span>
				</div>
			</div>
			<div className="ub_call_to_action_url_input">
				{isSelected && (
					<form
						onSubmit={(event) => event.preventDefault()}
						className={`editor-format-toolbar__link-modal-line ub_cta_url_input_box flex-container`}
					>
						<div className="ub-icon-holder">
							<Icon icon="admin-links" />
						</div>
						<URLInput
							__nextHasNoMarginBottom
							autoFocus={false}
							className="button-url"
							value={props.attributes.url}
							onChange={(value) => setAttributes({ url: value })}
							unstableOnFocus={() => setEditable("URLInput")}
						/>
						<Button
							icon={"editor-break"}
							label={__("Apply", "ultimate-blocks")}
							type={"submit"}
						/>
					</form>
				)}
			</div>
		</>
	);
};

export function CallToAction(props) {
	const {
		attributes: { blockID },
		isSelected,
		setAttributes,
	} = props;

	const { block, rootBlockClientId } = useSelect((select) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(props.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			rootBlockClientId,
		};
	});
	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const [editable, setEditable] = useState("");

	return (
		<div {...useBlockProps()}>
			{isSelected && blockControls({ ...props, editable, setEditable })}
			{isSelected && inspectorControls({ ...props, editable, setEditable })}
			<div className={props.className}>
				{editorDisplay({ ...props, editable, setEditable })}
			</div>
		</div>
	);
}
