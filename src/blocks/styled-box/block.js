const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const {
	RichText,
	BlockControls,
	MediaUpload,
	InspectorControls,
	PanelColorSettings
} = wp.blockEditor || wp.editor;

const { Toolbar, Button, IconButton, SelectControl } = wp.components;

const { withState, compose } = wp.compose;

const { withSelect } = wp.data;

import { Fragment } from "react";

import icon, {
	info,
	success,
	warning,
	oneColumnIcon,
	twoColumnsIcon,
	threeColumnsIcon,
	remove_icon,
	numberBoxIcon,
	featureBoxIcon,
	notificationBoxIcon
} from "./icon";

registerBlockType("ub/styled-box", {
	title: __("Styled Box"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: ""
		},
		text: {
			type: "array",
			default: [""]
		},
		textAlign: {
			type: "array",
			default: ["left"]
		},
		title: {
			type: "array",
			default: [""]
		},
		titleAlign: {
			type: "array",
			default: ["center"]
		},
		number: {
			type: "array",
			default: [""]
		},
		image: {
			type: "array",
			default: [{ id: null, alt: null, url: null }]
		},
		foreColor: {
			type: "string",
			default: "#000000"
		},
		backColor: {
			type: "string",
			default: "#CCCCCC"
		},
		outlineColor: {
			type: "string",
			default: "#000000"
		},
		mode: {
			type: "string",
			default: ""
		}
	},

	edit: compose([
		withState({ editable: "" }),
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId
			)
		}))
	])(function(props) {
		const {
			attributes,
			block,
			setAttributes,
			isSelected,
			setState,
			editable
		} = props;

		const {
			text,
			title,
			number,
			image,
			foreColor,
			backColor,
			outlineColor,
			mode,
			titleAlign,
			textAlign,
			blockID
		} = attributes;

		let renderedBlock;

		let inspectorExtras;

		let blockToolbarExtras;

		const newValue = (arr, newLength, val = "") =>
			newLength > arr.length
				? [...arr, ...Array(newLength - arr.length).fill(val)]
				: arr.slice(0, newLength);

		const columnCountToolbar = (
			<Toolbar>
				{[
					[oneColumnIcon, "One"],
					[twoColumnsIcon, "Two"],
					[threeColumnsIcon, "Three"]
				].map((num, i) => (
					<IconButton
						icon={num[0]}
						label={__(`${num[1]} column${i > 0 ? "s" : ""}`)}
						isActive={text.length === i}
						onClick={_ =>
							setAttributes({
								text: newValue(text, i + 1),
								textAlign: newValue(textAlign, i + 1, "left"),
								title: newValue(title, i + 1),
								titleAlign: newValue(titleAlign, i + 1, "center"),
								number: newValue(number, i + 1),
								image: newValue(image, i + 1, {
									id: null,
									alt: null,
									url: null
								})
							})
						}
					/>
				))}
			</Toolbar>
		);

		if (blockID !== block.clientId) {
			setAttributes({ blockID: block.clientId });
		}

		if (mode === "notification") {
			renderedBlock = (
				<RichText
					style={{
						backgroundColor: backColor,
						color: foreColor,
						borderLeftColor: outlineColor,
						textAlign: textAlign[0]
					}}
					className="ub-notification-text"
					tag="div"
					placeholder={__("Add Your Content Here")}
					formattingControls={["bold", "italic", "link", "strikethrough"]}
					onChange={newText =>
						setAttributes({
							text: [newText, ...text.slice(1)]
						})
					}
					unstableOnFocus={_ => setState({ editable: "text0" })}
					value={text[0]}
				/>
			);

			blockToolbarExtras = (
				<Toolbar className="components-toolbar">
					<Button
						className="components-icon-button components-toolbar-control"
						onClick={_ =>
							setAttributes({
								foreColor: "#31708f",
								backColor: "#d9edf7",
								outlineColor: "#31708f"
							})
						}
					>
						{info}
					</Button>
					<Button
						className="components-icon-button components-toolbar-control"
						onClick={_ =>
							setAttributes({
								foreColor: "#3c763d",
								backColor: "#dff0d8",
								outlineColor: "#3c763d"
							})
						}
					>
						{success}
					</Button>
					<Button
						className="components-icon-button components-toolbar-control"
						onClick={_ =>
							setAttributes({
								foreColor: "#d8000c",
								backColor: "#ffd2d2",
								outlineColor: "#d8000c"
							})
						}
					>
						{warning}
					</Button>
				</Toolbar>
			);
		} else if (mode === "feature") {
			renderedBlock = Array(text.length)
				.fill("")
				.map((_, i) => (
					<div className="ub-feature">
						{image[i] && image[i].id ? (
							<Fragment>
								{isSelected && (
									<Button
										className="remove-image"
										onClick={_ =>
											setAttributes({
												image: [
													...image.slice(0, i),
													{
														id: null,
														alt: null,
														url: null
													},
													...image.slice(i + 1)
												]
											})
										}
									>
										{remove_icon}
									</Button>
								)}
								<img
									className="ub-feature-img"
									src={image[i].url}
									alt={image[i].alt}
								/>
							</Fragment>
						) : (
							<div className="ub-feature-upload-button">
								<MediaUpload
									onSelect={img =>
										setAttributes({
											image: [
												...image.slice(0, i),
												{
													id: img.id,
													alt: img.alt,
													url: img.url
												},
												...image.slice(i + 1)
											]
										})
									}
									type="image"
									value={image[i].id}
									render={({ open }) => (
										<Button
											className="components-button button button-medium"
											onClick={open}
										>
											{__("Upload Image")}
										</Button>
									)}
								/>
							</div>
						)}
						<RichText
							tagName="p"
							className="ub-feature-title"
							style={{ textAlign: titleAlign[i] }}
							value={title[i]}
							onChange={value =>
								setAttributes({
									title: [...title.slice(0, i), value, ...title.slice(i + 1)]
								})
							}
							placeholder={__("Title goes here")}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={_ => setState({ editable: `title${i}` })}
						/>
						<RichText
							tagName="p"
							className="ub-feature-body"
							style={{ textAlign: textAlign[i] }}
							value={text[i]}
							onChange={value =>
								setAttributes({
									text: [...text.slice(0, i), value, ...text.slice(i + 1)]
								})
							}
							placeholder={__("Text goes here")}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={_ => setState({ editable: `text${i}` })}
						/>
					</div>
				));

			blockToolbarExtras = columnCountToolbar;
		} else if (mode === "number") {
			blockToolbarExtras = columnCountToolbar;
			renderedBlock = Array(text.length)
				.fill("")
				.map((_, i) => (
					<div
						className="ub-number-panel"
						style={{
							borderColor: outlineColor
						}}
					>
						<div
							className="ub-number-container"
							style={{
								backgroundColor: backColor
							}}
						>
							<RichText
								tagName="p"
								placeholder={__(i + 1)}
								className="ub-number-display"
								style={{
									color: foreColor
								}}
								value={number[i]}
								onChange={value =>
									setAttributes({
										number: [
											...number.slice(0, i),
											value,
											...number.slice(i + 1)
										]
									})
								}
								keepPlaceholderOnFocus={true}
								unstableOnFocus={_ => setState({ editable: "" })}
							/>
						</div>
						<RichText
							tagName="p"
							style={{ textAlign: titleAlign[i] }}
							placeholder={__("Title")}
							className="ub-number-box-title"
							value={title[i]}
							onChange={value =>
								setAttributes({
									title: [...title.slice(0, i), value, ...title.slice(i + 1)]
								})
							}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={_ => setState({ editable: `title${i}` })}
						/>
						<RichText
							tagName="p"
							placeholder={__("Your content goes here.")}
							style={{ textAlign: textAlign[i] }}
							className="ub-number-box-body"
							value={text[i]}
							onChange={value =>
								setAttributes({
									text: [...text.slice(0, i), value, ...text.slice(i + 1)]
								})
							}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={_ => setState({ editable: `text${i}` })}
						/>
					</div>
				));

			inspectorExtras = (
				<PanelColorSettings
					title={__("Color Scheme")}
					initialOpen={false}
					colorSettings={[
						{
							value: backColor,
							onChange: colorValue =>
								setAttributes({
									backColor: colorValue
								}),
							label: __("Number Background Color")
						},
						{
							value: foreColor,
							onChange: colorValue =>
								setAttributes({
									foreColor: colorValue
								}),
							label: __("Number Color")
						},
						{
							value: outlineColor,
							onChange: colorValue =>
								setAttributes({
									outlineColor: colorValue
								}),
							label: __("Border Color")
						}
					]}
				/>
			);
		} else {
			renderedBlock = (
				<div className="ub-styled-box-selection">
					<h4>{__("Select a Style")}</h4>
					<div className="ub-styled-box-choices">
						<div
							onClick={_ => {
								let newAttributes = {
									mode: "notification",
									number: [number[0]],
									title: [title[0]],
									titleAlign: [titleAlign[0]],
									text: [text[0]],
									textAlign: [textAlign[0]],
									image: [image[0]]
								};
								if (
									!(
										(foreColor === "#31708f" &&
											backColor === "#d9edf7" &&
											outlineColor === "#31708f") ||
										(foreColor === "#3c763d" &&
											backColor === "#dff0d8" &&
											outlineColor === "#3c763d") ||
										(foreColor === "#d8000c" &&
											backColor === "#ffd2d2" &&
											outlineColor === "#d8000c")
									)
								) {
									Object.assign(newAttributes, {
										foreColor: "#31708f",
										backColor: "#d9edf7",
										outlineColor: "#31708f"
									});
								}
								setAttributes(newAttributes);
							}}
						>
							{notificationBoxIcon}
							<p>{__("Notification Box")}</p>
							<p>{__("Highlight Important Information.")}</p>
						</div>
						<div onClick={_ => setAttributes({ mode: "feature" })}>
							{featureBoxIcon}
							<p>{__("Feature Box")}</p>
							<p>{__("Add Boxes with Images.")}</p>
						</div>
						<div onClick={_ => setAttributes({ mode: "number" })}>
							{numberBoxIcon}
							<p>{__("Number Box")}</p>
							<p>{__("Add Numbered Boxes.")}</p>
						</div>
					</div>
				</div>
			);
		}

		return [
			isSelected && (
				<BlockControls>
					{blockToolbarExtras}
					<Toolbar>
						{["left", "center", "right", "justify"].map(a => (
							<IconButton
								icon={`editor-${a === "justify" ? a : "align" + a}`}
								label={__(
									(a !== "justify" ? "Align " : "") +
										a[0].toUpperCase() +
										a.slice(1)
								)}
								onClick={_ => {
									const columnNum = parseInt(
										editable.slice(editable.length - 1)
									);
									if (editable.includes("title")) {
										setAttributes({
											titleAlign: [
												...titleAlign.slice(0, columnNum),
												a,
												...titleAlign.slice(columnNum + 1)
											]
										});
									} else if (editable.includes("text")) {
										setAttributes({
											textAlign: [
												...textAlign.slice(0, columnNum),
												a,
												...textAlign.slice(columnNum + 1)
											]
										});
									}
								}}
							/>
						))}
					</Toolbar>
				</BlockControls>
			),
			isSelected && (
				<InspectorControls>
					{mode !== "" && (
						<SelectControl
							label="Select mode"
							value={mode}
							options={["number", "notification", "feature"].map(a => ({
								label: `${a[0].toUpperCase() + a.slice(1)} box`,
								value: a
							}))}
							onChange={selection => {
								let newAttributes = { mode: selection };
								if (selection === "notification") {
									Object.assign(newAttributes, {
										number: [number[0]],
										title: [title[0]],
										titleAlign: [titleAlign[0]],
										text: [text[0]],
										textAlign: [textAlign[0]],
										image: [image[0]]
									});
									if (
										!(
											(foreColor === "#31708f" &&
												backColor === "#d9edf7" &&
												outlineColor === "#31708f") ||
											(foreColor === "#3c763d" &&
												backColor === "#dff0d8" &&
												outlineColor === "#3c763d") ||
											(foreColor === "#d8000c" &&
												backColor === "#ffd2d2" &&
												outlineColor === "#d8000c")
										)
									) {
										Object.assign(newAttributes, {
											foreColor: "#31708f",
											backColor: "#d9edf7",
											outlineColor: "#31708f"
										});
									}
								}
								setAttributes(newAttributes);
							}}
						/>
					)}

					{inspectorExtras}
				</InspectorControls>
			),
			<div className={`ub-styled-box ub-${mode}-box`}>{renderedBlock}</div>
		];
	}),

	save: _ => null
});
