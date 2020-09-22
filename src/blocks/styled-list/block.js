const { __ } = wp.i18n;

const { registerBlockType, createBlock } = wp.blocks;
const {
	RichText,
	InspectorControls,
	ColorPalette,
	AlignmentToolbar,
	BlockControls,
} = wp.blockEditor || wp.editor;
const { IconButton, Dropdown, PanelBody, RangeControl } = wp.components;
const { withState, compose } = wp.compose;
const { withSelect } = wp.data;

import { dashesToCamelcase } from "../../common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import icon from "./icon";

import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas, fab);

const allIcons = Object.assign(fas, fab);

registerBlockType("ub/styled-list", {
	title: __("Styled List"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		list: {
			type: "text",
			default: [...Array(3).keys()]
				.map((i) => `<li>${__(`Item ${i + 1}`)}</li>`)
				.join(),
		},
		//retained for reverse compatibility
		listItem: {
			type: "array",
			default: Array(3).fill({
				text: "",
				selectedIcon: "check",
				indent: 0,
			}),
		},
		selectedIcon: {
			type: "string",
			default: "check",
		},
		alignment: {
			type: "string",
			default: "left",
		},
		iconColor: {
			type: "string",
			default: "#000000",
		},
		iconSize: {
			type: "number",
			default: 5,
		},
		itemSpacing: {
			type: "number",
			default: 0, //in pixels
		},
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: "core/list",
				transform: (attributes) =>
					createBlock("ub/styled-list", { list: attributes.values }),
			},
		],
	},
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	edit: compose([
		withState({
			availableIcons: [],
			iconSearchTerm: "",
			recentSelection: "",
			edits: 0,
		}),
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
	])(function (props) {
		const {
			block,
			getBlock,
			getClientIdsWithDescendants,
			isSelected,
			setAttributes,
			setState,
			availableIcons,
			iconSearchTerm,
			edits,
			attributes: {
				list,
				listItem,
				alignment,
				iconColor,
				iconSize,
				selectedIcon,
				blockID,
				itemSpacing,
			},
		} = props;

		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map((name) => allIcons[name]) });
		}

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === props.attributes.blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}

		if (
			JSON.stringify(listItem) !==
			`[${Array(3)
				.fill('{"text":"","selectedIcon":"check","indent":0}')
				.join(",")}]`
		) {
			let newList = "";

			listItem.forEach((item, i) => {
				let insertionPoint = newList.length;

				for (let j = 0; j < item.indent; j++) {
					let ulPosition = newList.lastIndexOf("</ul>", insertionPoint - 1);
					if (ulPosition > -1 && newList.lastIndexOf("<li>") < ulPosition) {
						insertionPoint = ulPosition;
					} else {
						insertionPoint -= 5;
						break;
					}
				}

				let insertedItem =
					i === 0 || item.indent <= listItem[i - 1].indent
						? `<li>${item.text}</li>`
						: `<ul class="fa-ul"><li>${item.text}</li></ul>`;

				newList = [
					newList.slice(0, insertionPoint),
					insertedItem,
					newList.slice(insertionPoint),
				].join("");
			});

			setAttributes({
				selectedIcon: listItem[0].selectedIcon,
				list: newList,
				listItem: Array(3).fill({
					text: "",
					selectedIcon: "check",
					indent: 0,
				}),
			});
		}

		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__("Icon Options")}>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "5fr 1fr",
							}}
						>
							<p>{__("Selected icon")}</p>
							{listItem.length > 0 && (
								<Dropdown
									position="bottom right"
									renderToggle={({ isOpen, onToggle }) => (
										<IconButton
											icon={
												<FontAwesomeIcon
													icon={
														Object.keys(fas)
															.filter(
																(iconName) => fas[iconName].prefix === "fas"
															)
															.includes(`fa${dashesToCamelcase(selectedIcon)}`)
															? selectedIcon
															: ["fab", selectedIcon]
													}
													color={iconColor}
													size="lg"
												/>
											}
											label={__("Select icon for list")}
											onClick={onToggle}
											aria-expanded={isOpen}
										/>
									)}
									renderContent={() => (
										<div>
											<input
												type="text"
												value={iconSearchTerm}
												onChange={(e) =>
													setState({
														iconSearchTerm: e.target.value,
													})
												}
											/>
											<br />
											{availableIcons.length > 0 &&
												availableIcons
													.filter((i) => i.iconName.includes(iconSearchTerm))
													.map((i) => (
														<IconButton
															className="ub-styled-list-available-icon"
															icon={<FontAwesomeIcon icon={i} size="lg" />}
															label={i.iconName}
															onClick={() => {
																setState({
																	recentSelection: i.iconName,
																	edits: edits + 1,
																});

																setAttributes({
																	selectedIcon: i.iconName,
																});
															}}
														/>
													))}
										</div>
									)}
								/>
							)}
						</div>
						<p>{__("Icon color")}</p>
						<ColorPalette
							value={iconColor}
							onChange={(colorValue) =>
								setAttributes({ iconColor: colorValue })
							}
						/>
						<p>{__("Icon size")}</p>
						<RangeControl
							value={iconSize}
							onChange={(iconSize) => setAttributes({ iconSize })}
							min={1}
							max={10}
						/>
						<p>{__("Item spacing (pixels)")}</p>
						<RangeControl
							value={itemSpacing}
							onChange={(itemSpacing) => setAttributes({ itemSpacing })}
							min={0}
							max={50}
						/>
					</PanelBody>
				</InspectorControls>
			),

			isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={(value) => {
							setAttributes({ alignment: value });
						}}
					/>
				</BlockControls>
			),

			<div
				className="ub_styled_list"
				id={`ub-styled-list-${blockID}`}
				style={{
					justifyContent:
						alignment === "center"
							? "center"
							: `flex-${alignment === "left" ? "start" : "end"}`,
				}}
			>
				<RichText
					className="fa-ul"
					multiline="li"
					__unstableMultilineRootTag={"ul"}
					tagName="ul"
					value={list}
					onChange={(newList) => {
						newList = newList.replace("<ul>", '<ul class="fa-ul">');
						setAttributes({ list: newList });
					}}
				/>

				<style
					dangerouslySetInnerHTML={{
						__html: `#ub-styled-list-${blockID} li:before{
                top: ${iconSize >= 5 ? 3 : iconSize < 3 ? 2 : 0}px;
                height:${(4 + iconSize) / 10}em; 
                width:${(4 + iconSize) / 10}em; 
                background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${
									allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[0]
								} ${
							allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[1]
						}' color='${
							iconColor ? `%23${iconColor.slice(1)}` : "inherit"
						}'><path fill='currentColor' d='${
							allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[4]
						}'></path></svg>");}
				
				#ub-styled-list-${blockID} li{
					margin-bottom: ${itemSpacing}px;
					text-indent: -${(4 + iconSize) / 10}em;
				}
				#ub-styled-list-${blockID} li>ul{
					margin-top: ${itemSpacing}px;
				}`,
					}}
				/>
			</div>,
		];
	}),

	save: () => null,
});
