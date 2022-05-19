const { __ } = wp.i18n;

const { registerBlockType, createBlock } = wp.blocks;

const {
	RichText,
	BlockControls,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
} = wp.blockEditor || wp.editor;

const {
	ToolbarGroup,
	ToolbarButton,
	Button,
	SelectControl,
	PanelBody,
	RangeControl,
} = wp.components;

const { withState, compose } = wp.compose;

const { withSelect, withDispatch } = wp.data;

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
	notificationBoxIcon,
	borderedBoxIcon,
	error,
} from "./icon";

registerBlockType("ub/styled-box", {
	title: __("Styled Box"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		text: {
			type: "array",
			default: [""],
		},
		textAlign: {
			type: "array",
			default: ["left"],
		},
		title: {
			type: "array",
			default: [""],
		},
		titleAlign: {
			type: "array",
			default: ["center"],
		},
		number: {
			type: "array",
			default: ["1", "2", "3"],
		},
		image: {
			type: "array",
			default: [{ id: null, alt: null, url: null }],
		},
		foreColor: {
			type: "string",
			default: "#000000",
		},
		backColor: {
			type: "string",
			default: "#CCCCCC",
		},
		boxColor: {
			type: "string",
			default: "",
		},
		outlineColor: {
			type: "string",
			default: "#000000",
		},
		outlineThickness: {
			type: "number",
			default: 0, //set to 3 for new inserts, but leave previously-inserted ones at 1
		},
		outlineStyle: {
			type: "string",
			default: "solid",
		},
		outlineRoundingRadius: {
			type: "number",
			default: 0,
		},
		outlineRadiusUnit: {
			type: "string",
			default: "percent", //other options: em, px
		},
		mode: {
			type: "string",
			default: "",
		},
	},

	edit: compose([
		withState({ editable: "" }),
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
		withDispatch((dispatch) => {
			const {
				insertBlock,
				insertBlocks,
				removeBlocks,
				replaceInnerBlocks,
				updateBlockAttributes,
			} = dispatch("core/block-editor") || dispatch("core/editor");
			return {
				insertBlock,
				insertBlocks,
				removeBlocks,
				replaceInnerBlocks,
				updateBlockAttributes,
			};
		}),
	])(function (props) {
		const {
			attributes: {
				text,
				title,
				number,
				image,
				foreColor,
				backColor,
				boxColor,
				outlineColor,
				outlineStyle,
				outlineThickness,
				outlineRoundingRadius,
				outlineRadiusUnit,
				mode,
				titleAlign,
				textAlign,
				blockID,
			},
			block,
			getBlock,
			getClientIdsWithDescendants,
			setAttributes,
			isSelected,
			setState,
			editable,
			insertBlock,
			insertBlocks,
			replaceInnerBlocks,
			removeBlocks,
			updateBlockAttributes,
		} = props;

		let renderedBlock;

		let inspectorExtras;

		let blockToolbarExtras;

		const newValue = (arr, newLength, val = "") =>
			newLength > arr.length
				? [...arr, ...Array(newLength - arr.length).fill(val)]
				: arr.slice(0, newLength);

		const columnCountToolbar = (
			<ToolbarGroup>
				{[
					[oneColumnIcon, "One"],
					[twoColumnsIcon, "Two"],
					[threeColumnsIcon, "Three"],
				].map((num, i) => (
					<ToolbarButton
						className="column-setting-button"
						icon={num[0]}
						label={__(`${num[1]} column${i > 0 ? "s" : ""}`)}
						isActive={
							(mode === "number" ? block.innerBlocks : text).length === i + 1
						}
						onClick={() => {
							if (mode === "number") {
								if (i + 1 > block.innerBlocks.length) {
									insertBlocks(
										[
											createBlock("ub/styled-box-numbered-box-column"),
											createBlock("ub/styled-box-numbered-box-column"),
										].slice(0, i + 1 - block.innerBlocks.length),
										block.innerBlocks.length,
										block.clientId
									);
								}
								if (i + 1 < block.innerBlocks.length) {
									removeBlocks(
										block.innerBlocks
											.map((i) => i.clientId)
											.slice(i + 1 - block.innerBlocks.length)
									);
								}
							} else {
								setAttributes({
									text: newValue(text, i + 1),
									textAlign: newValue(textAlign, i + 1, "left"),
									title: newValue(title, i + 1),
									titleAlign: newValue(titleAlign, i + 1, "center"),
									number: newValue(number, i + 1),
									image: newValue(image, i + 1, {
										id: null,
										alt: null,
										url: null,
									}),
								});
							}
						}}
					/>
				))}
			</ToolbarGroup>
		);

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === props.attributes.blockID
			)
		) {
			setAttributes({
				blockID: block.clientId,
				outlineThickness: blockID === "" ? 3 : outlineThickness,
			});
		} else if (outlineThickness === 0) {
			setAttributes({ outlineThickness: 1 });
		}

		if (mode === "notification") {
			if (
				block.innerBlocks.length > 0 &&
				block.innerBlocks[0].name !== "ub/styled-box-notification-content"
			) {
				replaceInnerBlocks(block.innerBlocks[0].clientId, [
					createBlock("ub/styled-box-notification-content"),
				]);
			}
			renderedBlock = (
				<InnerBlocks
					templateLock={"all"}
					template={[["ub/styled-box-notification-content"]]}
				/>
			);

			blockToolbarExtras = (
				<ToolbarGroup className="components-toolbar">
					<ToolbarButton
						className="components-icon-button components-toolbar-control"
						onClick={() =>
							setAttributes({
								foreColor: "#31708f",
								backColor: "#d9edf7",
								outlineColor: "#31708f",
							})
						}
					>
						{info}
					</ToolbarButton>
					<ToolbarButton
						className="components-icon-button components-toolbar-control"
						onClick={() =>
							setAttributes({
								foreColor: "#3c763d",
								backColor: "#dff0d8",
								outlineColor: "#3c763d",
							})
						}
					>
						{success}
					</ToolbarButton>
					<ToolbarButton
						className="components-icon-button components-toolbar-control"
						onClick={() =>
							setAttributes({
								foreColor: "#eaac00",
								backColor: "#ffdd80",
								outlineColor: "#eaac00",
							})
						}
					>
						{warning}
					</ToolbarButton>
					<ToolbarButton
						className="components-icon-button components-toolbar-control"
						onClick={() =>
							setAttributes({
								foreColor: "#d8000c",
								backColor: "#ffd2d2",
								outlineColor: "#d8000c",
							})
						}
					>
						{error}
					</ToolbarButton>
				</ToolbarGroup>
			);

			inspectorExtras = (
				<PanelColorSettings
					title={__("Advanced Color Scheme")}
					initialOpen={false}
					colorSettings={[
						{
							value: backColor,
							onChange: (colorValue) =>
								setAttributes({ backColor: colorValue }),
							label: __("Background Color"),
						},
						{
							value: foreColor,
							onChange: (colorValue) =>
								setAttributes({ foreColor: colorValue }),
							label: __("Foreground Color"),
						},
						{
							value: outlineColor,
							onChange: (colorValue) =>
								setAttributes({ outlineColor: colorValue }),
							label: __("Border Color"),
						},
					]}
				/>
			);
		} else if (mode === "feature") {
			renderedBlock = Array(text.length)
				.fill("")
				.map((_, i) => (
					<div className="ub-feature">
						{image[i] && image[i].id ? (
							<>
								{isSelected && (
									<Button
										className="remove-image"
										onClick={() =>
											setAttributes({
												image: [
													...image.slice(0, i),
													{
														id: null,
														alt: null,
														url: null,
													},
													...image.slice(i + 1),
												],
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
							</>
						) : (
							<div className="ub-feature-upload-button">
								<MediaUpload
									onSelect={(img) =>
										setAttributes({
											image: [
												...image.slice(0, i),
												{
													id: img.id,
													alt: img.alt,
													url: img.url,
												},
												...image.slice(i + 1),
											],
										})
									}
									allowedTypes={["image"]}
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
							onChange={(value) =>
								setAttributes({
									title: [...title.slice(0, i), value, ...title.slice(i + 1)],
								})
							}
							placeholder={__("Title goes here")}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={() => setState({ editable: `title${i}` })}
						/>
						<RichText
							tagName="p"
							className="ub-feature-body"
							style={{ textAlign: textAlign[i] }}
							value={text[i]}
							onChange={(value) =>
								setAttributes({
									text: [...text.slice(0, i), value, ...text.slice(i + 1)],
								})
							}
							placeholder={__("Text goes here")}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={() => setState({ editable: `text${i}` })}
						/>
					</div>
				));

			blockToolbarExtras = columnCountToolbar;
		} else if (mode === "number") {
			blockToolbarExtras = columnCountToolbar;

			if (block.innerBlocks.length > 0) {
				if (block.innerBlocks[0].name !== "ub/styled-box-numbered-box-column") {
					replaceInnerBlocks(block.clientId, [
						createBlock("ub/styled-box-numbered-box-column"),
					]);
				} else if (title.some((t) => t !== "")) {
					setAttributes({
						number: Array(number.length).fill(""),
						title: Array(title.length).fill(""),
						text: Array(text.length).fill(""),
					});
					console.log("titles cleared");
				}
			} else {
				if (title.some((t) => t !== "")) {
					const convertedBlocks = number.map((n, i) =>
						createBlock(
							"ub/styled-box-numbered-box-column",
							{
								number: n,
								title: title[i],
							},
							[createBlock("core/paragraph", { content: text[i] })]
						)
					);

					replaceInnerBlocks(block.clientId, convertedBlocks);
				} else {
					insertBlock(
						createBlock("ub/styled-box-numbered-box-column", {
							number: __("1"),
							title: "",
						}),
						0,
						block.clientId
					);
				}
			}

			renderedBlock = (
				<div className="ub-styled-box-number-box-main">
					<InnerBlocks
						allowedBlocks={["ub/styled-box-numbered-box-column"]}
						template={[["ub/styled-box-numbered-box-column"]]}
						renderAppender={() =>
							block.innerBlocks.length < 3 && (
								<InnerBlocks.ButtonBlockAppender />
							)
						}
					/>
					<style>
						{`.ub-styled-box-number-box-main
								> .block-editor-inner-blocks
								> .block-editor-block-list__layout {
									display: grid;
									grid-auto-flow: column;
									grid-template-columns: ${Array(Math.min(block.innerBlocks.length + 1, 3))
										.fill("1fr")
										.join(" ")};
									column-gap: 10px;
							}`}
					</style>
				</div>
			);

			inspectorExtras = (
				<PanelColorSettings
					title={__("Color Scheme")}
					initialOpen={false}
					colorSettings={[
						{
							value: backColor,
							onChange: (colorValue) => {
								setAttributes({ backColor: colorValue });

								if (
									block.innerBlocks.length > 0 &&
									block.innerBlocks[0].name ===
										"ub/styled-box-numbered-box-column"
								) {
									updateBlockAttributes(
										block.innerBlocks.map((i) => i.clientId),
										{ backColor: colorValue }
									);
								}
							},
							label: __("Number Background Color"),
						},
						{
							value: foreColor,
							onChange: (colorValue) => {
								setAttributes({ foreColor: colorValue });

								if (
									block.innerBlocks.length > 0 &&
									block.innerBlocks[0].name ===
										"ub/styled-box-numbered-box-column"
								) {
									updateBlockAttributes(
										block.innerBlocks.map((i) => i.clientId),
										{ numberColor: colorValue }
									);
								}
							},
							label: __("Number Color"),
						},
						{
							value: outlineColor,
							onChange: (colorValue) => {
								setAttributes({ outlineColor: colorValue });
								if (
									block.innerBlocks.length > 0 &&
									block.innerBlocks[0].name ===
										"ub/styled-box-numbered-box-column"
								) {
									updateBlockAttributes(
										block.innerBlocks.map((i) => i.clientId),
										{ borderColor: colorValue }
									);
								}
							},
							label: __("Border Color"),
						},
					]}
				/>
			);
		} else if (mode === "bordered") {
			if (
				block.innerBlocks.length > 0 &&
				block.innerBlocks[0].name !== "ub/styled-box-bordered-content"
			) {
				replaceInnerBlocks(block.innerBlocks[0].clientId, [
					createBlock("ub/styled-box-bordered-content"),
				]);
			}
			renderedBlock = (
				<InnerBlocks
					templateLock={"all"}
					template={[["ub/styled-box-bordered-content"]]}
				/>
			);

			inspectorExtras = (
				<PanelBody title={__("Border settings")} initialOpen={true}>
					<RangeControl
						label={__("Border size (pixels)")}
						value={outlineThickness}
						onChange={(outlineThickness) => setAttributes({ outlineThickness })}
						min={1}
						max={30}
					/>
					<SelectControl
						label={__("Border style")}
						value={outlineStyle}
						options={[
							"solid",
							"dashed",
							"dotted",
							"double",
							"groove",
							"ridge",
							"inset",
							"outset",
						].map((a) => ({
							label: __(a),
							value: a,
						}))}
						onChange={(outlineStyle) => setAttributes({ outlineStyle })}
					/>
					<RangeControl
						label={__("Border radius")}
						value={outlineRoundingRadius}
						onChange={(outlineRoundingRadius) =>
							setAttributes({ outlineRoundingRadius })
						}
						min={0}
						max={outlineRadiusUnit === "percent" ? 50 : 200} //percent max value: 50, pixel max value: 500
					/>
					<SelectControl
						label={__("Outline radius unit")}
						value={outlineRadiusUnit}
						options={["percent", "pixel", "em"].map((a) => ({
							label: __(a),
							value: a,
						}))}
						onChange={(outlineRadiusUnit) =>
							setAttributes({ outlineRadiusUnit })
						}
					/>
					<PanelColorSettings
						title={__("Color Scheme")}
						initialOpen={true}
						colorSettings={[
							{
								value: outlineColor,
								onChange: (outlineColor) => setAttributes({ outlineColor }),
								label: __("Border Color"),
							},
							{
								value: boxColor,
								onChange: (boxColor) => setAttributes({ boxColor }),
								label: __("Background Color"),
							},
						]}
					/>
				</PanelBody>
			);
		} else {
			renderedBlock = (
				<div className="ub-styled-box-selection">
					<h4>{__("Select a Style")}</h4>
					<div className="ub-styled-box-choices">
						<div
							onClick={() => {
								let newAttributes = {
									mode: "notification",
									number: [number[0]],
									title: [title[0]],
									titleAlign: [titleAlign[0]],
									text: [text[0]],
									textAlign: [textAlign[0]],
									image: [image[0]],
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
										outlineColor: "#31708f",
									});
								}
								setAttributes(newAttributes);
							}}
						>
							{notificationBoxIcon}
							<p>{__("Notification Box")}</p>
							<p>{__("Highlight Important Information.")}</p>
						</div>
						<div onClick={() => setAttributes({ mode: "feature" })}>
							{featureBoxIcon}
							<p>{__("Feature Box")}</p>
							<p>{__("Add Boxes with Images.")}</p>
						</div>
						<div onClick={() => setAttributes({ mode: "number" })}>
							{numberBoxIcon}
							<p>{__("Number Box")}</p>
							<p>{__("Add Numbered Boxes.")}</p>
						</div>
						<div onClick={() => setAttributes({ mode: "bordered" })}>
							{borderedBoxIcon}
							<p>{__("Bordered Box")}</p>
							<p>{__("Add Box with Border.")}</p>
						</div>
					</div>
				</div>
			);
		}

		let extraStyles = {};

		if (mode === "bordered") {
			let radiusUnit = "";
			switch (outlineRadiusUnit) {
				case "pixel":
					radiusUnit = "px";
					break;
				case "em":
					radiusUnit = "em";
					break;
				default:
				case "percent":
					radiusUnit = "%";
					break;
			}
			extraStyles = {
				backgroundColor: boxColor || "inherit",
				border: `${outlineThickness}px ${outlineStyle} ${outlineColor}`,
				borderRadius: `${outlineRoundingRadius}${radiusUnit}`,
			};
		}
		if (mode === "notification") {
			extraStyles = {
				backgroundColor: backColor,
				color: foreColor,
				borderLeftColor: outlineColor,
			};
			if (text[0] !== "" && block.innerBlocks.length === 1) {
				replaceInnerBlocks(block.innerBlocks[0].clientId, [
					createBlock("core/paragraph", {
						content: text[0],
						align: textAlign[0],
					}),
				]);
				setAttributes({ text: [""], textAlign: ["left"] });
			}
		}

		return [
			isSelected && (
				<BlockControls>
					{blockToolbarExtras}
					{mode !== "" && (
						<ToolbarGroup>
							{["left", "center", "right", "justify"].map((a) => (
								<ToolbarButton
									icon={`editor-${a === "justify" ? a : "align" + a}`}
									label={__(
										(a !== "justify" ? "Align " : "") +
											a[0].toUpperCase() +
											a.slice(1)
									)}
									onClick={() => {
										const columnNum = parseInt(
											editable.slice(editable.length - 1)
										);
										if (editable.includes("title")) {
											setAttributes({
												titleAlign: [
													...titleAlign.slice(0, columnNum),
													a,
													...titleAlign.slice(columnNum + 1),
												],
											});
										} else if (editable.includes("text")) {
											setAttributes({
												textAlign: [
													...textAlign.slice(0, columnNum),
													a,
													...textAlign.slice(columnNum + 1),
												],
											});
										}
									}}
								/>
							))}
						</ToolbarGroup>
					)}
				</BlockControls>
			),
			isSelected && (
				<InspectorControls>
					{mode !== "" && (
						<PanelBody>
							<SelectControl
								label="Select mode"
								value={mode}
								options={["number", "notification", "feature", "bordered"].map(
									(a) => ({
										label: `${a[0].toUpperCase() + a.slice(1)} box`,
										value: a,
									})
								)}
								onChange={(selection) => setAttributes({ mode: selection })}
							/>
						</PanelBody>
					)}
					{inspectorExtras}
				</InspectorControls>
			),
			<div className={`ub-styled-box ub-${mode}-box`} style={extraStyles}>
				{renderedBlock}
			</div>,
		];
	}),

	save: (props) =>
		["bordered", "notification", "number"].includes(props.attributes.mode) ? (
			<InnerBlocks.Content />
		) : null,
});

registerBlockType("ub/styled-box-bordered-content", {
	title: __("Bordered Box Content"),
	parent: ["ub/styled-box"],
	icon: icon,
	category: "ultimateblocks",
	supports: {
		inserter: false,
		reusable: false,
	},

	edit: () => (
		<InnerBlocks
			templateLock={false}
			template={[
				["core/paragraph", { placeholder: "Enter content for bordered box" }],
			]}
		/>
	),

	save: () => <InnerBlocks.Content />,
});

registerBlockType("ub/styled-box-notification-content", {
	title: __("Notification Box Content"),
	parent: ["ub/styled-box"],
	icon: icon,
	category: "ultimateblocks",
	supports: {
		inserter: false,
		reusable: false,
	},

	edit: () => (
		<InnerBlocks
			templateLock={false}
			template={[
				[
					"core/paragraph",
					{ placeholder: __("Enter content for notification box") },
				],
			]}
		/>
	),

	save: () => <InnerBlocks.Content />,
});

registerBlockType("ub/styled-box-numbered-content", {
	title: __("Numbered Box Content"),
	parent: ["ub/styled-box"],
	icon: icon,
	category: "ultimateblocks",
	supports: {
		inserter: false,
		reusable: false,
	},

	edit: () => (
		<InnerBlocks
			templateLock={false}
			template={[
				["core/paragraph", { placeholder: "Enter content for numbered box" }],
			]}
		/>
	),

	save: () => <InnerBlocks.Content />,
});

registerBlockType("ub/styled-box-numbered-box-column", {
	title: __("Numbered Box Column"),
	parent: ["ub/styled-box"],
	icon: icon,
	category: "ultimateblocks",
	supports: {
		//parent is alredy set, do not set inserter to false
		reusable: false,
	},

	attributes: {
		number: {
			type: "string",
			default: "",
		},
		title: {
			type: "string",
			default: "",
		},
		titleAlign: {
			type: "string",
			default: "center",
		},
		numberColor: {
			type: "string",
			default: "",
		},
		backColor: {
			type: "string",
			default: "",
		},
		borderColor: {
			type: "string",
			default: "",
		},
	},

	edit: withSelect((select, ownProps) => {
		const { getBlock, getBlockIndex, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getBlockIndex,
			getBlockRootClientId,
		};
	})(function (props) {
		const {
			attributes,
			setAttributes,
			block,
			getBlock,
			getBlockIndex,
			getBlockRootClientId,
		} = props;
		const { borderColor, numberColor, backColor, number, title, titleAlign } =
			attributes;

		const {
			outlineColor: parentOutlineColor,
			foreColor: parentForeColor,
			backColor: parentBackColor,
		} = getBlock(getBlockRootClientId(block.clientId)).attributes;

		if (borderColor === "") {
			setAttributes({ borderColor: parentOutlineColor });
		}
		if (numberColor === "") {
			setAttributes({ numberColor: parentForeColor });
		}
		if (backColor === "") {
			setAttributes({ backColor: parentBackColor });
		}

		return (
			<div className="ub-number-panel" style={{ borderColor: borderColor }}>
				<div
					className="ub-number-container"
					style={{ backgroundColor: backColor }}
				>
					<RichText
						tagName="p"
						placeholder={__(
							getBlockIndex(
								block.clientId,
								getBlockRootClientId(block.clientId)
							) + 1
						)}
						keep
						numerical
						placeholders
						className="ub-number-display"
						style={{ color: numberColor }}
						value={number}
						onChange={(number) => setAttributes({ number })}
						keepPlaceholderOnFocus={true}
					/>
				</div>
				<RichText
					tagName="p"
					style={{ textAlign: titleAlign }}
					placeholder={__("Title")}
					className="ub-number-box-title"
					value={title}
					onChange={(title) => setAttributes({ title })}
					keepPlaceholderOnFocus={true}
				/>
				<InnerBlocks
					templateLock={false}
					template={[
						[
							"core/paragraph",
							{ placeholder: "Enter content for numbered box" },
						],
					]}
				/>
			</div>
		);
	}),

	save: () => <InnerBlocks.Content />,
});
