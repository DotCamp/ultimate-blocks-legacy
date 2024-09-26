import { __ } from "@wordpress/i18n";

import { registerBlockType, createBlock } from "@wordpress/blocks";
import { SpacingControl } from "../components";
import { getStyles } from "./get-styles";
import { getParentBlock } from "../../common";
import {
	RichText,
	BlockControls,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
	useBlockProps,
} from "@wordpress/block-editor";

import {
	ToolbarGroup,
	ToolbarButton,
	Button,
	SelectControl,
	PanelBody,
	RangeControl,
} from "@wordpress/components";

const { compose } = wp.compose;

import {
	withSelect,
	withDispatch,
	useSelect,
	useDispatch,
} from "@wordpress/data";

import { useState, useEffect } from "react";
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
import metadata from "./block.json";
import borderBoxMetaData from "./styled-box-border/block.json";
import notificationBoxMetaData from "./styled-box-notification/block.json";
import numberBoxMetaData from "./styled-box-number/block.json";
import numberBoxColumnMetaData from "./styled-box-numbered-box-column/block.json";

function StyledBox(props) {
	const [editable, setEditable] = useState("");
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
	const {
		insertBlock,
		insertBlocks,
		removeBlocks,
		replaceInnerBlocks,
		updateBlockAttributes,
	} = useDispatch("core/block-editor");
	const blockProps = useBlockProps();
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
		setAttributes,
		isSelected,
	} = props;

	let renderedBlock;

	let inspectorExtras;

	let blockToolbarExtras;

	useEffect(() => {
		if (blockID === "") {
			setAttributes({
				blockID: block.clientId,
				outlineThickness: blockID === "" ? 3 : outlineThickness,
			});
		} else if (outlineThickness === 0) {
			setAttributes({ outlineThickness: 1 });
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
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
									block.clientId,
								);
							}
							if (i + 1 < block.innerBlocks.length) {
								removeBlocks(
									block.innerBlocks
										.map((i) => i.clientId)
										.slice(i + 1 - block.innerBlocks.length),
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

	if (mode === "notification") {
		if (
			block.innerBlocks.length > 0 &&
			block.innerBlocks[0].name !== "ub/styled-box-notification-content"
		) {
			replaceInnerBlocks(block.clientId, [
				createBlock(
					"ub/styled-box-notification-content",
					{},
					block.innerBlocks[0].innerBlocks,
				),
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
						onChange: (colorValue) => setAttributes({ backColor: colorValue }),
						label: __("Background Color"),
					},
					{
						value: foreColor,
						onChange: (colorValue) => setAttributes({ foreColor: colorValue }),
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
			?.map((_, i) => (
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
						unstableOnFocus={() => setEditable(`title${i}`)}
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
						unstableOnFocus={() => setEditable(`text${i}`)}
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
			}
		} else {
			if (title.some((t) => t !== "")) {
				const convertedBlocks = number.map((n, i) =>
					createBlock(
						"ub/styled-box-numbered-box-column",
						{
							number: String(n),
							title: title[i],
						},
						[createBlock("core/paragraph", { content: text[i] })],
					),
				);

				replaceInnerBlocks(block.clientId, convertedBlocks);
			} else {
				insertBlock(
					createBlock("ub/styled-box-numbered-box-column", {
						number: __("1"),
						title: "",
					}),
					0,
					block.clientId,
				);
			}
		}

		renderedBlock = (
			<div className="ub-styled-box-number-box-main">
				<InnerBlocks
					allowedBlocks={["ub/styled-box-numbered-box-column"]}
					template={[["ub/styled-box-numbered-box-column"]]}
					renderAppender={() =>
						block.innerBlocks.length < 3 && <InnerBlocks.ButtonBlockAppender />
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
									{ backColor: colorValue },
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
									{ numberColor: colorValue },
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
									{ borderColor: colorValue },
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
			replaceInnerBlocks(block.clientId, [
				createBlock(
					"ub/styled-box-bordered-content",
					{},
					block.innerBlocks[0].innerBlocks,
				),
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
					onChange={(outlineRadiusUnit) => setAttributes({ outlineRadiusUnit })}
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
	const styles = getStyles(props.attributes);

	return (
		<div {...blockProps}>
			{isSelected && (
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
											a.slice(1),
									)}
									onClick={() => {
										const columnNum = parseInt(
											editable.slice(editable.length - 1),
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
			)}
			{isSelected && (
				<>
					<InspectorControls group="settings">
						{mode !== "" && (
							<PanelBody>
								<SelectControl
									label="Select mode"
									value={mode}
									options={[
										"number",
										"notification",
										"feature",
										"bordered",
									].map((a) => ({
										label: `${a[0].toUpperCase() + a.slice(1)} box`,
										value: a,
									}))}
									onChange={(selection) => setAttributes({ mode: selection })}
								/>
							</PanelBody>
						)}
					</InspectorControls>
					<InspectorControls group="styles">
						{inspectorExtras}
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
			)}
			<div
				className={`ub-styled-box ub-${mode}-box`}
				style={{ ...extraStyles, ...styles }}
			>
				{renderedBlock}
			</div>
		</div>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	attributes: metadata.attributes,
	example: {},
	edit: StyledBox,

	save: (props) =>
		["bordered", "notification", "number"].includes(props.attributes.mode) ? (
			<InnerBlocks.Content />
		) : null,
});

registerBlockType(borderBoxMetaData.name, {
	...borderBoxMetaData,
	icon: icon,
	attributes: borderBoxMetaData.attributes,
	edit: (props) => (
		<InnerBlocks
			templateLock={false}
			template={[
				["core/paragraph", { placeholder: "Enter content for bordered box" }],
			]}
			{...useBlockProps()}
		/>
	),

	save: () => <InnerBlocks.Content {...useBlockProps.save()} />,
});

registerBlockType(notificationBoxMetaData.name, {
	...notificationBoxMetaData,
	icon: icon,
	attributes: notificationBoxMetaData.attributes,
	edit: () => (
		<InnerBlocks
			templateLock={false}
			template={[
				[
					"core/paragraph",
					{ placeholder: __("Enter content for notification box") },
				],
			]}
			{...useBlockProps()}
		/>
	),

	save: () => <InnerBlocks.Content {...useBlockProps.save()} />,
});

registerBlockType(numberBoxMetaData.name, {
	...numberBoxMetaData,
	icon: icon,
	attributes: numberBoxMetaData.attributes,
	edit: () => (
		<InnerBlocks
			templateLock={false}
			template={[
				["core/paragraph", { placeholder: "Enter content for numbered box" }],
			]}
			{...useBlockProps()}
		/>
	),

	save: () => <InnerBlocks.Content {...useBlockProps.save()} />,
});

registerBlockType(numberBoxColumnMetaData.name, {
	...numberBoxColumnMetaData,
	icon: icon,
	attributes: numberBoxColumnMetaData.attributes,
	edit: function (props) {
		const { attributes, setAttributes } = props;
		const {
			blockID,
			borderColor,
			numberColor,
			backColor,
			number,
			title,
			titleAlign,
		} = attributes;
		const {
			block,
			getBlock,
			getBlockIndex,
			getBlockRootClientId,
			getClientIdsWithDescendants,
		} = useSelect((select) => {
			const {
				getBlock,
				getBlockIndex,
				getBlockRootClientId,
				getClientIdsWithDescendants,
			} = select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(props.clientId),
				getBlock,
				getBlockIndex,
				getBlockRootClientId,
				getClientIdsWithDescendants,
			};
		});
		const {
			outlineColor: parentOutlineColor,
			foreColor: parentForeColor,
			backColor: parentBackColor,
		} = getBlock(getBlockRootClientId(block.clientId)).attributes;

		useEffect(() => {
			if (borderColor === "") {
				setAttributes({ borderColor: parentOutlineColor });
			}
			if (numberColor === "") {
				setAttributes({ numberColor: parentForeColor });
			}
			if (backColor === "") {
				setAttributes({ backColor: parentBackColor });
			}
			if (
				blockID === "" &&
				/* PREVENT AUTOMATIC SETTING OF NUMBER SINCE NUMBER BLOCK STARTED WITHOUT BLOCKID ATTRIBUTE */
				borderColor === "" &&
				numberColor === "" &&
				backColor === ""
			) {
				setAttributes({
					blockID: block.clientId,
					number: String(
						getBlockIndex(
							block.clientId,
							getBlockRootClientId(block.clientId),
						) + 1,
					),
				});
			}
		}, []);

		return (
			<div
				{...useBlockProps({
					className: "ub-number-panel",
					style: { borderColor: borderColor },
				})}
			>
				<div
					className="ub-number-container"
					style={{ backgroundColor: backColor }}
				>
					<RichText
						tagName="p"
						placeholder={__(
							getBlockIndex(
								block.clientId,
								getBlockRootClientId(block.clientId),
							) + 1,
						)}
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
	},

	save: () => <InnerBlocks.Content />,
});
