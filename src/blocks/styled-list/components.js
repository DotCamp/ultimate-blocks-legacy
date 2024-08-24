import { __ } from "@wordpress/i18n";
import { isEmpty } from "lodash";
import { loadPromise, models } from "@wordpress/api";
import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { getStyles } from "./get-styles";
import {
	RichText,
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
	JustifyContentControl,
} from "@wordpress/block-editor";
import {
	Button,
	Dropdown,
	PanelBody,
	RangeControl,
	ToggleControl,
	ToolbarGroup,
} from "@wordpress/components";
import classnames from "classnames";
import { IconControl, IconSizePicker } from "$Library/ub-common/Components";

import {
	dashesToCamelcase,
	splitArrayIntoChunks,
	splitArray,
	getParentBlock,
} from "../../common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useRef } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import colorList from "./colorlist";
import { ColorSettings, SpacingControl } from "../components";

library.add(fas, fab);

const allIcons = Object.assign(fas, fab);

function convertOldStyledList(list) {
	let openingLiLocs = [...list.matchAll(/<li>/g)].map((l) => l.index);
	let closingLiLocs = [...list.matchAll(/<\/li>/g)].map((l) => l.index);
	let openingUlLocs = [...list.matchAll(/<ul>/g)].map((l) => l.index);
	let closingUlLocs = [...list.matchAll(/<\/ul>/g)].map((l) => l.index);

	let liLocs = pairTags(openingLiLocs, closingLiLocs);
	let ulLocs = pairTags(openingUlLocs, closingUlLocs);

	function pairTags(openingTagLocs, closingTagLocs) {
		let pairs = [];

		if (openingTagLocs.length === closingTagLocs.length) {
			pairs = openingTagLocs.map((o) => [o]);

			closingTagLocs.forEach((tagLoc) => {
				pairs[pairs.findLastIndex((a) => a[0] < tagLoc && a.length === 1)].push(
					tagLoc,
				);
			});
		}

		return pairs;
	}

	function listToArray(list) {
		let itemArray = [];

		list.forEach((item, i) => {
			const subitems = list.filter(
				(li) => li[0] > list[i][0] && li[1] < list[i][1],
			);
			const parentItems = list.filter(
				(li) => li[0] < list[i][0] && li[1] > list[i][1],
			);

			if (!parentItems.length) {
				itemArray.push(item);
				if (subitems.length) {
					itemArray.push(listToArray(subitems));
				}
			}
		});

		return itemArray;
	}

	const nestedItems = listToArray(liLocs);

	function renderItems(listArray) {
		let items = [];

		listArray.forEach((item) => {
			if (Array.isArray(item[0])) {
				items.push(renderItems(item));
			} else {
				items.push(
					list.substring(
						item[0] + 4,
						Math.min(
							item[1],
							...openingUlLocs.filter((ul) => ul > item[0] && ul < item[1]),
						),
					),
				);
			}
		});

		return items;
	}

	return renderItems(nestedItems);
}

function EditorComponent(props) {
	const [iconChoices, setIconChoices] = useState([]);
	const [availableIcons, setAvailableIcons] = useState([]);
	const [iconSearchTerm, setIconSearchTerm] = useState("");
	const [iconSearchResultsPage, setIconSearchResultsPage] = useState(0);
	const [recentSelection, setRecentSelection] = useState("");
	const [selectionTime, setSelectionTime] = useState(0);
	const [setFontSize, toggleSetFontSize] = useState(false);
	const [hasApiAccess, setHasApiAccess] = useState(false);
	const {
		block,
		getBlock,
		getBlockParentsByBlockName,
		getClientIdsOfDescendants,
		getClientIdsWithDescendants,
		rootBlockClientId,
	} = useSelect((select) => {
		const {
			getBlock,
			getBlockParentsByBlockName,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			getBlockRootClientId,
		} = select("core/block-editor");
		const block = getBlock(props.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			getBlock,
			getBlockParentsByBlockName,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			rootBlockClientId,
		};
	});
	const { replaceInnerBlocks, updateBlockAttributes } =
		useDispatch("core/block-editor");
	const { isSelected, attributes, setAttributes } = props;

	const {
		blockID,
		list,
		selectedIcon,
		iconColor,
		iconSize,
		itemSpacing,
		isRootList,
		textColor,
		backgroundColor,
		fontSize,
		columns,
		maxMobileColumns,
		alignment,
		listAlignment,
	} = attributes;
	const blockProps = useBlockProps({
		className: classnames({
			[`ub-list-alignment-${listAlignment}`]: !isEmpty(listAlignment),
		}),
	});
	useEffect(() => {
		setAvailableIcons(
			Object.keys(allIcons)
				.sort()
				.map((name) => allIcons[name]),
		);

		loadIconList();

		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}

		function convertListToBlocks(items) {
			let blockArray = [];
			items.forEach((item, i) => {
				if (typeof item === "string") {
					let childBlocks = [];
					if (items.length > i && Array.isArray(items[i + 1])) {
						childBlocks = convertListToBlocks(items[i + 1]);
					}
					blockArray.push(
						createBlock(
							"ub/styled-list-item",
							{ itemText: item },
							childBlocks.length > 0
								? [createBlock("ub/styled-list", {}, childBlocks)]
								: [],
						),
					);
				}
			});
			return blockArray;
		}

		if (
			list !== "" &&
			getBlockParentsByBlockName(block.clientId, [
				"ub/styled-list",
				"ub/styled-list-item",
			]).length === 0
		) {
			const oldListData = convertOldStyledList(list);

			const convertedBlocks = convertListToBlocks(oldListData);
			replaceInnerBlocks(block.clientId, convertedBlocks);

			setAttributes({ list: "" });
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);

	function loadIconList() {
		const iconList = Object.keys(allIcons).sort();

		//promise not being loaded
		loadPromise.then(() => {
			const settings = new models.Settings();

			settings.fetch().then((response) => {
				let frequentIcons = [];

				if (response.ub_icon_choices !== "") {
					const currentTime = ~~(Date.now() / 1000);

					//trim old entries from frequenticons that are older than two weeks
					frequentIcons = JSON.parse(response.ub_icon_choices)
						.map((f) => ({
							name: f.name,
							selectionTime: f.selectionTime.filter(
								(t) => t >= currentTime - 1209600,
							),
						}))
						.filter((f) => f.selectionTime.length); //then remove entries with empty selectionTime arrays
				}
				if (frequentIcons.length) {
					setIconChoices(frequentIcons);

					//check if anything from ub_icon_choices has been trimmed in frequentIcons
					if (JSON.stringify(frequentIcons) !== response.ub_icon_choices) {
						const newIconArray = new models.Settings({
							ub_icon_choices: JSON.stringify(frequentIcons),
						});
						newIconArray.save();
					}

					let icons = [];
					let otherIcons = [];

					[icons, otherIcons] = splitArray(
						iconList.map((name) => allIcons[name]),
						(icon) => frequentIcons.map((i) => i.name).includes(icon.iconName),
					);

					const frequentIconNames = frequentIcons.map((i) => i.name);

					icons.sort(
						(a, b) =>
							frequentIconNames.indexOf(a.iconName) -
							frequentIconNames.indexOf(b.iconName),
					);

					setAvailableIcons([...icons, ...otherIcons]);
				}
				setHasApiAccess(true);
			});
		});
	}

	function updateIconList() {
		const prevIconMatch = iconChoices
			.map((i) => i.name)
			.indexOf(recentSelection);

		let iconPrefs = [];

		if (prevIconMatch > -1) {
			let match = Object.assign({}, iconChoices[prevIconMatch]);

			match.selectionTime = [selectionTime, ...match.selectionTime];

			iconPrefs = [
				match, //move matching element to head of array
				...iconChoices.slice(0, prevIconMatch),
				...iconChoices.slice(prevIconMatch + 1),
			];
		} else {
			iconPrefs = [
				{
					name: recentSelection,
					selectionTime: [selectionTime],
				}, //add newest pick to head of array
				...iconChoices,
			];
		}

		//rearrange the icons

		let icons = []; //most recent selection should always be first element of array
		let otherIcons = [];
		[icons, otherIcons] = splitArray(availableIcons, (icon) =>
			iconPrefs.map((i) => i.name).includes(icon.iconName),
		);

		const iconPrefsName = iconPrefs.map((i) => i.name);

		icons.sort(
			(a, b) =>
				iconPrefsName.indexOf(a.iconName) - iconPrefsName.indexOf(b.iconName),
		);

		setRecentSelection("");
		setSelectionTime(0);
		setIconChoices(iconPrefs);
		setAvailableIcons([...icons, ...otherIcons]);

		const newIconArray = new models.Settings({
			ub_icon_choices: JSON.stringify(iconPrefs),
		});

		newIconArray.save();
	}

	useEffect(() => {
		if (hasApiAccess) {
			if (isSelected) {
				loadIconList();
			} else {
				updateIconList();
			}
		}
	}, [isSelected]);

	const listItemBlocks = getClientIdsOfDescendants([block.clientId]).filter(
		(ID) => getBlock(ID).name === "ub/styled-list-item",
	);

	function setAttributesToAllItems(newAttributes) {
		updateBlockAttributes(listItemBlocks, newAttributes);
	}

	const iconListPage = splitArrayIntoChunks(
		availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
		24,
	);

	const isRootOfList =
		getBlockParentsByBlockName(block.clientId, [
			"ub/styled-list",
			"ub/styled-list-item",
		]).length === 0;

	if (isRootList !== isRootOfList) {
		setAttributes({ isRootList: isRootOfList });
	}
	const styles = getStyles(attributes);
	return (
		<div {...blockProps}>
			{isSelected && isRootOfList && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Icon")} initialOpen={true}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "5fr 1fr",
								}}
							>
								<p>{__("Selected icon")}</p>

								<Dropdown
									position="bottom right"
									renderToggle={({ isOpen, onToggle }) => (
										<Button
											label={__("Select icon for list")}
											onClick={onToggle}
											aria-expanded={isOpen}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="30"
												width="30"
												viewBox={`0, 0, ${
													allIcons[`fa${dashesToCamelcase(selectedIcon)}`]
														.icon[0]
												},  ${
													allIcons[`fa${dashesToCamelcase(selectedIcon)}`]
														.icon[1]
												}`}
											>
												<path
													fill={iconColor}
													d={
														allIcons[`fa${dashesToCamelcase(selectedIcon)}`]
															.icon[4]
													}
												/>
											</svg>
										</Button>
									)}
									renderContent={() => (
										<div>
											<input
												type="text"
												value={iconSearchTerm}
												onChange={(e) => {
													setIconSearchTerm(e.target.value);
													setIconSearchResultsPage(0);
												}}
											/>
											<br />
											{iconListPage.length > 0 && (
												<div>
													<button
														onClick={() => {
															if (iconSearchResultsPage > 0) {
																setIconSearchResultsPage(
																	iconSearchResultsPage - 1,
																);
															}
														}}
													>
														&lt;
													</button>
													<span>
														{iconSearchResultsPage + 1}/{iconListPage.length}
													</span>
													<button
														onClick={() => {
															if (
																iconSearchResultsPage <
																iconListPage.length - 1
															) {
																setIconSearchResultsPage(
																	iconSearchResultsPage + 1,
																);
															}
														}}
													>
														&gt;
													</button>
												</div>
											)}

											{iconListPage.length > 0 &&
												iconListPage[iconSearchResultsPage].map((i) => (
													<Button
														className="ub-styled-list-available-icon"
														icon={<FontAwesomeIcon icon={i} size="lg" />}
														label={i.iconName}
														onClick={() => {
															if (selectedIcon !== i.iconName) {
																setRecentSelection(i.iconName);
																setSelectionTime(~~(Date.now() / 1000));

																setAttributes({
																	selectedIcon: i.iconName,
																});

																setAttributesToAllItems({
																	selectedIcon: i.iconName,
																});
															}
														}}
													/>
												))}
										</div>
									)}
									onToggle={(isOpen) => {
										if (!isOpen && recentSelection && hasApiAccess) {
											updateIconList();
										}
									}}
								/>
							</div>

							<p>{__("Icon size")}</p>
							<RangeControl
								value={iconSize}
								onChange={(iconSize) => {
									setAttributes({ iconSize });
									setAttributesToAllItems({ iconSize });
								}}
								min={1}
								max={10}
							/>
						</PanelBody>

						<PanelBody title={__("Additional")} initialOpen={true}>
							<p>{__("Number of columns")}</p>
							<RangeControl
								value={columns}
								onChange={(columns) => {
									setAttributes({ columns });
									if (columns <= maxMobileColumns) {
										setAttributes({ maxMobileColumns: columns });
									}
								}}
								min={1}
								max={4}
							/>
							{columns > 1 && (
								<>
									<p>{__("Number of columns in mobile")}</p>
									<RangeControl
										value={maxMobileColumns}
										onChange={(maxMobileColumns) =>
											setAttributes({ maxMobileColumns })
										}
										min={1}
										max={columns}
									/>
								</>
							)}
							<p>{__("Item spacing (pixels)")}</p>
							<RangeControl
								value={itemSpacing}
								onChange={(itemSpacing) => setAttributes({ itemSpacing })}
								min={0}
								max={50}
							/>
							<ToggleControl
								label={__("Customize font size")}
								checked={setFontSize}
								onChange={() => {
									if (setFontSize) {
										setAttributes({ fontSize: 0 });

										//change font sizevalue of all list items to zero
										updateBlockAttributes(listItemBlocks, {
											fontSize: 0,
										});
									} else {
										setAttributes({ fontSize: 10 });
										//send signal to first child block to begin measuring
										updateBlockAttributes(block.innerBlocks[0].clientId, {
											fontSize: -1,
										});
									}
									toggleSetFontSize(!setFontSize);
								}}
							/>
							{setFontSize && (
								<>
									<p>{__("Font size (pixels)")}</p>
									<RangeControl
										value={fontSize}
										onChange={(fontSize) => {
											setAttributes({ fontSize });
											updateBlockAttributes(listItemBlocks, { fontSize });
										}}
										min={10}
										max={50}
									/>
								</>
							)}
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="color">
						<ColorSettings
							label={__("Icon color", "ultimate-blocks")}
							attrKey="iconColor"
							onAttributesUpdate={(updatedAttributes) =>
								setAttributesToAllItems(updatedAttributes)
							}
						/>
						<ColorSettings
							label={__("List Text Color", "ultimate-blocks")}
							attrKey="textColor"
						/>
						<ColorSettings
							label={__("List Background Color", "ultimate-blocks")}
							attrKey="backgroundColor"
						/>
					</InspectorControls>
					<InspectorControls group="styles">
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
			{isSelected && isRootList && (
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
					<ToolbarGroup>
						<JustifyContentControl
							value={attributes.listAlignment}
							allowedControls={["left", "center", "right"]}
							onChange={(next) => {
								setAttributes({ listAlignment: next });
							}}
						/>
					</ToolbarGroup>
				</BlockControls>
			)}
			<ul
				className={isRootList ? "ub_styled_list" : "ub_styled_list_sublist"}
				id={`ub-styled-list-${blockID}`}
				style={isRootList ? styles : {}}
			>
				<InnerBlocks
					template={isRootOfList ? [["ub/styled-list-item"]] : []} //initial content
					templateLock={false}
					allowedBlocks={["ub/styled-list-item"]}
					renderAppender={false}
				/>
			</ul>
			{isRootOfList && (
				<style
					dangerouslySetInnerHTML={{
						__html: `#ub-styled-list-${blockID} li::before{
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
										}'></path></svg>");
					}
					#ub-styled-list-${blockID} li{
						color: ${textColor};
					}
					#ub-styled-list-${blockID} [data-type="ub/styled-list-item"]:not(:first-child){
						margin-top: ${itemSpacing}px;
					}
					#ub-styled-list-${blockID} .block-editor-inner-blocks > .block-editor-block-list__layout .ub_styled_list_sublist > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-type="ub/styled-list-item"]:first-child{
						margin-top: ${itemSpacing}px;
					}
					#ub-styled-list-${blockID}  > .block-editor-inner-blocks > .block-editor-block-list__layout{
						column-count: ${columns};
					}
					#ub-styled-list-${blockID} {
						text-align: ${alignment};
					}
					.ub-list-alignment-left #ub-styled-list-${blockID} .block-editor-inner-blocks > .block-editor-block-list__layout{
						width: fit-content;
						margin-right: auto;
						margin-left: 0;
					}
					.ub-list-alignment-center #ub-styled-list-${blockID} .block-editor-inner-blocks > .block-editor-block-list__layout{
						width: fit-content;
						margin-right: auto;
						margin-left: auto;
					}
					.ub-list-alignment-right #ub-styled-list-${blockID} .block-editor-inner-blocks > .block-editor-block-list__layout{
						width: fit-content;
						margin-right: 0;
						margin-left: auto;
					}
					`,
					}}
				/>
			)}
		</div>
	);
}

export function StyledListItem(props) {
	const { isSelected, attributes, setAttributes } = props;
	const { blockID, itemText, iconSize, iconColor, selectedIcon, fontSize } =
		attributes;
	const {
		insertBlock,
		moveBlocksToPosition,
		removeBlock,
		replaceBlocks,
		updateBlockAttributes,
	} = useDispatch("core/block-editor");
	const {
		block,
		getBlock,
		getBlockIndex,
		currentBlockIndex,
		getBlockParents,
		listRootClientId,
		getBlockParentsByBlockName,
		getClientIdsOfDescendants,
		getClientIdsWithDescendants,
		getNextBlockClientId,
		getPreviousBlockClientId,
	} = useSelect((select) => {
		const {
			getBlock,
			getBlockIndex,
			getBlockParents,
			getBlockParentsByBlockName,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			getNextBlockClientId,
			getPreviousBlockClientId,
		} = select("core/block-editor");

		return {
			block: getBlock(props.clientId),
			getBlock,
			getBlockIndex,
			currentBlockIndex: getBlockIndex(props.clientId),
			getBlockParents,
			listRootClientId: getBlockParents(props.clientId, true)[0],
			getBlockParentsByBlockName,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
			getNextBlockClientId,
			getPreviousBlockClientId,
		};
	});
	const [useFontSize, toggleUseFontSize] = useState(false);
	const styles = getStyles(attributes);

	const blockProps = useBlockProps({ style: styles });

	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

	const listRoot = getBlock(listRootClientId);
	function outdentItem() {
		//outdents current item by default, but should also allow outdenting other list item blocks

		const ancestorItemsAndLists = getBlockParents(
			listRootClientId,
			true,
		).filter((b) =>
			["ub/styled-list", "ub/styled-list-item"].includes(getBlock(b).name),
		);

		if (ancestorItemsAndLists.length > 1) {
			moveBlocksToPosition(
				[block.clientId],

				listRootClientId, //get block id of parent list block

				ancestorItemsAndLists[1], //get block id of parent list of current parent list block

				getBlockIndex(ancestorItemsAndLists[0]) + 1, //ensure indented item moves to just after the parent item of the parent list
			);

			if (currentBlockIndex < listRoot.innerBlocks.length - 1) {
				const itemBlocksToTransfer = listRoot.innerBlocks
					.slice(currentBlockIndex + 1, listRoot.innerBlocks.length)
					.map((ib) => ib.clientId);

				if (block.innerBlocks.length > 0) {
					moveBlocksToPosition(
						itemBlocksToTransfer,

						parentListId,

						blockTarget.innerBlocks[0].clientId,

						blockTarget.innerBlocks[0].clientId.length,
					);
				} else {
					if (itemBlocksToTransfer.length === listRoot.innerBlocks.length - 1) {
						//descendant-less first item of list gets outdented

						moveBlocksToPosition(
							[listRootClientId],
							ancestorItemsAndLists[0],
							block.clientId,
							0,
						);
					} else {
						///middle item of list gets outdented

						insertBlock(
							createBlock("ub/styled-list", {}, []),
							0,
							block.clientId,
						);

						setTimeout(() => {
							moveBlocksToPosition(
								itemBlocksToTransfer,

								listRootClientId,

								getBlock(block.clientId).innerBlocks[0].clientId,

								0,
							);
						}, 20);
					}
				}
			} else {
				console.log("last item. nothing else to do here");
			}

			if (getBlock(listRootClientId).innerBlocks.length === 0) {
				//fresh value needed, do not substitute with listRoot
				removeBlock(listRootClientId);
			}
		} else {
			console.log("first item of outermost list. special handling needed");
		}
	}

	const parents = getBlockParentsByBlockName(block.clientId, [
		"ub/styled-list",
	]);

	const listItemRef = useRef(null); //relocate

	useEffect(() => {
		if (fontSize === -1) {
			const listItemBlocks = getClientIdsOfDescendants([parents[0]]).filter(
				(ID) => getBlock(ID).name === "ub/styled-list-item",
			);

			updateBlockAttributes([parents[0], ...listItemBlocks], {
				fontSize: parseInt(
					getComputedStyle(listItemRef.current).fontSize.slice(0, -2),
				),
			});
		} else {
			toggleUseFontSize(fontSize > 0);
		}
	}, [fontSize]);
	const rootIcon = listRoot?.attributes?.selectedIcon;
	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__("Icon", "ultimate-blocks")} initialOpen={true}>
					<IconControl
						selectedIcon={selectedIcon}
						label={__("Icon", "ultimate-blocks")}
						onIconSelect={(newIcon) => {
							if (newIcon) {
								setAttributes({ selectedIcon: newIcon });
							} else {
								setAttributes({ selectedIcon: "" });
							}
						}}
					/>
					<RangeControl
						value={iconSize}
						onChange={(iconSize) => {
							setAttributes({ iconSize });
						}}
						min={1}
						max={10}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
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
				<Button
					icon="editor-outdent"
					disabled={
						getBlockParentsByBlockName(block.clientId, ["ub/styled-list-item"])
							.length === 0
					}
					onClick={outdentItem}
				/>
				<Button
					icon="editor-indent"
					disabled={currentBlockIndex === 0}
					onClick={() => {
						if (
							getBlock(getPreviousBlockClientId(block.clientId)).innerBlocks
								.length === 0
						) {
							insertBlock(
								createBlock("ub/styled-list", {}, []),
								0,
								getPreviousBlockClientId(block.clientId),
							);
						}

						setTimeout(() => {
							moveBlocksToPosition(
								[block.clientId],

								listRootClientId, //get block id of parent list block

								getBlock(getPreviousBlockClientId(block.clientId))
									.innerBlocks[0].clientId, //get block id of newly-created list subblock

								getBlock(getPreviousBlockClientId(block.clientId))
									.innerBlocks[0].innerBlocks.length, //ensure indented item moves to bottom of destination list
							);
						}, 20);
					}}
				/>
			</BlockControls>

			<RichText
				tagName="li"
				id={`ub-styled-list-item-${blockID}`}
				value={itemText}
				placeholder={"List item"}
				keepPlaceholderOnFocus={true}
				onChange={(itemText) => setAttributes({ itemText })}
				identifier="itemText"
				onSplit={(itemFragment) => {
					const { blockID, itemText, ...filteredAttributes } = attributes;

					return createBlock("ub/styled-list-item", {
						filteredAttributes,
						blockID: "",
						selectedIcon: selectedIcon,
						itemText: itemFragment,
					});
				}}
				onReplace={(replacements) => {
					let replacementBlocks = [...replacements];
					replacementBlocks[replacementBlocks.length - 1].innerBlocks =
						block.innerBlocks;

					replaceBlocks(block.clientId, replacementBlocks);
				}}
				onMerge={(mergeWithNext) => {
					if (mergeWithNext) {
						let targetBlock = "";

						if (block.innerBlocks.length > 0) {
							targetBlock = block.innerBlocks[0].innerBlocks[0].clientId;

							//move is being performed correctly, but a clone of moved block remains for some reasons
							moveBlocksToPosition(
								[targetBlock], //present
								block.innerBlocks[0].clientId, //present
								listRootClientId, //
								currentBlockIndex + 1, //get target position
							);

							if (
								getBlock(block.clientId).innerBlocks[0].innerBlocks.length > 0
							) {
								moveBlocksToPosition(
									[block.innerBlocks[0].clientId], //present
									block.clientId, //present
									targetBlock, //
									0, //get target position
								);
							} else {
								removeBlock(getBlock(block.clientId).innerBlocks[0].clientId);
							}
						} else {
							const findNextItem = (id, ancestors) => {
								if (
									getBlockIndex(id) + 1 <
									getBlock(ancestors[0]).innerBlocks.length
								) {
									return getBlock(ancestors[0]).innerBlocks[
										getBlockIndex(id) + 1
									].clientId;
								} else {
									if (ancestors.length === 1) {
										return "";
									} else {
										return findNextItem(ancestors[1], ancestors.slice(2));
									}
								}
							};

							targetBlock = findNextItem(
								block.clientId,
								getBlockParents(block.clientId, true).filter((b) =>
									["ub/styled-list", "ub/styled-list-item"].includes(
										getBlock(b).name,
									),
								),
							);

							if (![null, ""].includes(targetBlock)) {
								const parentLists = getBlockParents(
									block.clientId,
									true,
								).filter((b) => getBlock(b).name === "ub/styled-list");

								if (
									getBlock(parentLists[0]).innerBlocks.filter(
										(i) => i.clientId === targetBlock,
									).length > 0 ||
									getBlock(
										parentLists[parentLists.length - 1],
									).innerBlocks.filter((i) => i.clientId === targetBlock)
										.length > 0
								) {
									updateBlockAttributes(block.clientId, {
										itemText:
											itemText + getBlock(targetBlock).attributes.itemText,
									});

									//outdent child blocks, merge only with blocks on the same level

									if (getBlock(targetBlock).innerBlocks.length > 0) {
										if (targetBlock === getNextBlockClientId()) {
											moveBlocksToPosition(
												[getBlock(targetBlock).innerBlocks[0].clientId], //present
												targetBlock, //source
												block.clientId, //destination
												0, //get target position
											);
										} else {
											const targetListItem = getBlock(
												getPreviousBlockClientId(targetBlock),
											);

											moveBlocksToPosition(
												getBlock(targetBlock).innerBlocks[0].innerBlocks.map(
													(ib) => ib.clientId,
												),
												getBlock(targetBlock).innerBlocks[0].clientId,
												targetListItem.innerBlocks[0].clientId,
												targetListItem.innerBlocks[0].innerBlocks.length,
											);
										}
									}

									removeBlock(targetBlock);
								}
							}
						}
					} else {
						if (currentBlockIndex > 0) {
							const findLastDescendant = (id) => {
								const ib = getBlock(id).innerBlocks;

								if (getBlock(id).innerBlocks.length === 0) {
									return id;
								} else {
									return findLastDescendant(ib[ib.length - 1].clientId);
								}
							};

							const targetBlock = findLastDescendant(
								getPreviousBlockClientId(),
							);

							updateBlockAttributes(targetBlock, {
								itemText: getBlock(targetBlock).attributes.itemText + itemText,
							});

							//also move subitems of soon-to-be-deleted block

							if (block.innerBlocks.length > 0) {
								moveBlocksToPosition(
									block.innerBlocks.map((ib) => ib.clientId),
									block.clientId,
									targetBlock,
									getBlock(targetBlock).innerBlocks.length,
								);
							}

							removeBlock(block.clientId);
						} else {
							outdentItem();
						}
					}

					return mergeWithNext;
				}}
				ref={
					currentBlockIndex === 0 && parents.length === 1 ? listItemRef : null
				}
				style={useFontSize ? { fontSize: `${fontSize}px` } : null}
			/>
			{/* INSERT INNERBLOCKS HERE* */}
			<InnerBlocks
				template={[]} //initial content
				templateLock={false}
				allowedBlocks={["ub/styled-list"]}
				renderAppender={false}
			/>
			{rootIcon !== selectedIcon && selectedIcon !== "" && (
				<style
					dangerouslySetInnerHTML={{
						__html: `#ub-styled-list-item-${blockID}::before{
					top: ${iconSize >= 5 ? 3 : iconSize < 3 ? 2 : 0}px !important;
					height:${(4 + iconSize) / 10}em !important;
					width:${(4 + iconSize) / 10}em !important;
					background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${
						allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[0]
					} ${
						allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[1]
					}' color='${
						iconColor ? `%23${iconColor.slice(1)}` : "inherit"
					}'><path fill='currentColor' d='${
						allIcons[`fa${dashesToCamelcase(selectedIcon)}`].icon[4]
					}'></path></svg>") !important;
						}
					`,
					}}
				/>
			)}
		</div>
	);
}

export default EditorComponent;
