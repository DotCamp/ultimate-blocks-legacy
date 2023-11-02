const { __ } = wp.i18n;

const {
	RichText,
	BlockControls,
	MediaUpload,
	InspectorControls,
	ColorPalette,
} = wp.blockEditor || wp.editor;

const { Button, PanelBody, RangeControl, ToolbarGroup, ToolbarButton } =
	wp.components;
import { SpacingControl } from "../components";
import { getStyles } from "./get-styles";

import icons from "./icons";

export const blockControls = (props) => {
	const { setAttributes, setState, editable, activeAlignment } = props;

	return (
		<BlockControls>
			<ToolbarGroup>
				{["left", "center", "right", "justify"]
					.slice(0, editable.indexOf("text") > 0 ? 4 : 3)
					.map((a) => (
						<ToolbarButton
							icon={`editor-${a === "justify" ? a : "align" + a}`}
							label={__(
								(a !== "justify" ? "Align " : "") +
									a[0].toUpperCase() +
									a.slice(1)
							)}
							isActive={a === activeAlignment}
							onClick={() => {
								switch (editable) {
									case "testimonial_text":
										setAttributes({ textAlign: a });
										setState({ activeAlignment: a });
										break;
									case "author":
										setAttributes({ authorAlign: a });
										setState({ activeAlignment: a });
										break;
									case "author_role":
										setAttributes({ authorRoleAlign: a });
										setState({ activeAlignment: a });
										break;
								}
							}}
						/>
					))}
			</ToolbarGroup>
		</BlockControls>
	);
};

export const inspectorControls = (props) => {
	const { attributes, setAttributes } = props;

	const { backgroundColor, textColor, textSize } = attributes;
	return (
		<>
			<InspectorControls group="styles">
				<PanelBody title={__("General")}>
					<label for="ub-testimonial-bgcolor-select">
						{__("Background Color")}
					</label>
					<ColorPalette
						id="ub-testimonial-bgcolor-select"
						value={backgroundColor}
						onChange={(backgroundColor) => setAttributes({ backgroundColor })}
						allowReset
					/>
					<label for="ub-testimonial-textcolor-select">
						{__("Font Color")}
					</label>
					<ColorPalette
						id="ub-testimonial-textcolor-select"
						value={textColor}
						onChange={(textColor) => setAttributes({ textColor })}
						allowReset
					/>
					<RangeControl
						label={__("Font Size")}
						value={textSize}
						onChange={(value) => setAttributes({ textSize: value })}
						min={14}
						max={200}
						beforeIcon="editor-textcolor"
						allowReset
					/>
				</PanelBody>
			</InspectorControls>
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
	);
};

export const editorDisplay = (props) => {
	const { isSelected, setState, attributes, setAttributes } = props;

	const {
		textSize,
		imgID,
		imgURL,
		imgAlt,
		ub_testimonial_author,
		ub_testimonial_author_role,
		ub_testimonial_text,
		textAlign,
		authorAlign,
		authorRoleAlign,
	} = attributes;
	const styles = getStyles(props.attributes);
	return (
		<div className="ub_testimonial" style={styles}>
			<div className="ub_testimonial_img">
				{!imgID ? (
					<div className="ub_testimonial_upload_button">
						<MediaUpload
							onSelect={(img) =>
								setAttributes({
									imgID: img.id,
									imgURL: img.url,
									imgAlt: img.alt,
								})
							}
							allowedTypes={["image"]}
							value={imgID}
							render={({ open }) => (
								<Button
									className="components-button button button-medium"
									onClick={open}
								>
									{__("Upload Image")}
								</Button>
							)}
						/>
						<p>{__("Ideal Image size is Square i.e 150x150.")}</p>
					</div>
				) : (
					<div>
						<img src={imgURL} alt={imgAlt} height={100} width={100} />
						{isSelected ? (
							<Button
								className="ub-remove-image"
								onClick={() =>
									setAttributes({
										imgID: null,
										imgURL: null,
										imgAlt: null,
									})
								}
							>
								{icons.remove}
							</Button>
						) : null}
					</div>
				)}
			</div>
			<div className="ub_testimonial_content">
				<RichText
					placeholder={__(
						"This is the testimonial body. Add the testimonial text you want to add here."
					)}
					className="ub_testimonial_text"
					style={{ fontSize: textSize, textAlign: textAlign }}
					onChange={(value) => setAttributes({ ub_testimonial_text: value })}
					value={ub_testimonial_text}
					keepPlaceholderOnFocus={true}
					allowedFormats={["core/bold", "core/strikethrough", "core/link"]}
					unstableOnFocus={() =>
						setState({
							editable: "testimonial_text",
							activeAlignment: textAlign,
						})
					}
				/>
			</div>
			<div className="ub_testimonial_sign">
				<RichText
					placeholder={__("John Doe")}
					style={{ textAlign: authorAlign }}
					className="ub_testimonial_author"
					onChange={(value) => setAttributes({ ub_testimonial_author: value })}
					value={ub_testimonial_author}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() =>
						setState({ editable: "author", activeAlignment: authorAlign })
					}
				/>
				<RichText
					placeholder={__("Founder, Company X")}
					style={{ textAlign: authorRoleAlign }}
					className="ub_testimonial_author_role"
					onChange={(value) =>
						setAttributes({ ub_testimonial_author_role: value })
					}
					value={ub_testimonial_author_role}
					keepPlaceholderOnFocus={true}
					allowedFormats={["core/bold", "core/strikethrough", "core/link"]}
					unstableOnFocus={() =>
						setState({
							editable: "author_role",
							activeAlignment: authorRoleAlign,
						})
					}
				/>
			</div>
		</div>
	);
};
