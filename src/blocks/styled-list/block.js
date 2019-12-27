const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;
const {
	RichText,
	InspectorControls,
	ColorPalette,
	AlignmentToolbar,
	BlockControls
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
			default: ""
		},
		list: {
			type: "text",
			default: [...Array(3).keys()]
				.map(i => `<li>${__(`Item ${i + 1}`)}</li>`)
				.join()
		},
		//retained for reverse compatibility
		listItem: {
			type: "array",
			default: Array(3).fill({
				text: "",
				selectedIcon: "check",
				indent: 0
			})
		},
		selectedIcon: {
			type: "string",
			default: "check"
		},
		alignment: {
			type: "string",
			default: "left"
		},
		iconColor: {
			type: "string",
			default: "#000000"
		},
		iconSize: {
			type: "number",
			default: 5
		}
	},
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	edit: compose([
		withState({
			availableIcons: [],
			iconSearchTerm: "",
			recentSelection: "",
			edits: 0
		}),
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId
			)
		}))
	])(function(props) {
		const {
			block,
			isSelected,
			attributes,
			setAttributes,
			setState,
			availableIcons,
			iconSearchTerm,
			edits
		} = props;
		const {
			list,
			listItem,
			alignment,
			iconColor,
			iconSize,
			selectedIcon,
			blockID
		} = attributes;

		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map(name => allIcons[name]) });
		}

		if (blockID !== block.clientId) {
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
					newList.slice(insertionPoint)
				].join("");
			});

			setAttributes({
				selectedIcon: listItem[0].selectedIcon,
				list: newList,
				listItem: Array(3).fill({
					text: "",
					selectedIcon: "check",
					indent: 0
				})
			});
		}

		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__("Icon Options")}>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "5fr 1fr"
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
																iconName => fas[iconName].prefix === "fas"
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
												onChange={e =>
													setState({
														iconSearchTerm: e.target.value
													})
												}
											/>
											<br />
											{availableIcons.length > 0 &&
												availableIcons
													.filter(i => i.iconName.includes(iconSearchTerm))
													.map(i => (
														<IconButton
															className="ub-styled-list-available-icon"
															icon={<FontAwesomeIcon icon={i} size="lg" />}
															label={i.iconName}
															onClick={() => {
																setState({
																	recentSelection: i.iconName,
																	edits: edits + 1
																});

																setAttributes({
																	selectedIcon: i.iconName
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
							onChange={colorValue => setAttributes({ iconColor: colorValue })}
						/>
						<p>{__("Icon size")}</p>
						<RangeControl
							value={iconSize}
							onChange={iconSize => setAttributes({ iconSize })}
							min={1}
							max={10}
						/>
					</PanelBody>
				</InspectorControls>
			),

			isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={value => {
							setAttributes({ alignment: value });
						}}
					/>
				</BlockControls>
			),

			<div
				className="ub-styled-list"
				id={`ub-styled-list-${blockID}`}
				style={{
					justifyContent:
						alignment === "center"
							? "center"
							: `flex-${alignment === "left" ? "start" : "end"}`
				}}
			>
				<RichText
					className="fa-ul"
					multiline="li"
					tagName="ul"
					value={list}
					onChange={newList => {
						newList = newList.replace("<ul>", '<ul class="fa-ul">');
						setAttributes({ list: newList });
					}}
				/>

				<style
					dangerouslySetInnerHTML={{
						__html: `#ub-styled-list-${blockID} li:before{
                content:''; 
                position:relative;
                left:-0.5em;
                top: ${iconSize >= 5 ? 3 : iconSize < 3 ? 2 : 0}px;
                display:inline-block; 
                height:${(4 + iconSize) / 10}em; 
                width:${(4 + iconSize) / 10}em; 
                background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${
									allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[0]
								} ${
							allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[1]
						}' color='%23${iconColor.slice(1)}'><path fill='currentColor' d='${
							allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[4]
						}'></path></svg>");
				background-repeat: no-repeat;}`
					}}
				/>
			</div>
		];
	}),

	save: () => null
});
