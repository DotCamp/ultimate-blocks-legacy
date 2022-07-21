const { __ } = wp.i18n;
const { loadPromise, models } = wp.api;
const { createBlock } = wp.blocks;
const {
	RichText,
	InspectorControls,
	ColorPalette,
	AlignmentToolbar,
	BlockControls,
} = wp.blockEditor || wp.editor;
const { Button, Dropdown, PanelBody, RangeControl, ToggleControl } =
	wp.components;

import {
	dashesToCamelcase,
	splitArrayIntoChunks,
	splitArray,
} from "../../common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useRef } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import colorList from "./colorlist";

library.add(fas, fab);

const allIcons = Object.assign(fas, fab);

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
		getClientIdsWithDescendants,
		isSelected,
		onReplace,
		setAttributes,
		attributes: {
			list,
			listItem,
			alignment,
			iconColor,
			iconSize,
			fontSize,
			selectedIcon,
			blockID,
			itemSpacing,
			columns,
			maxMobileColumns,
		},
	} = props;

	const blockContainer = useRef(null);

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
								(t) => t >= currentTime - 1209600
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
						(icon) => frequentIcons.map((i) => i.name).includes(icon.iconName)
					);

					const frequentIconNames = frequentIcons.map((i) => i.name);

					icons.sort(
						(a, b) =>
							frequentIconNames.indexOf(a.iconName) -
							frequentIconNames.indexOf(b.iconName)
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
			iconPrefs.map((i) => i.name).includes(icon.iconName)
		);

		const iconPrefsName = iconPrefs.map((i) => i.name);

		icons.sort(
			(a, b) =>
				iconPrefsName.indexOf(a.iconName) - iconPrefsName.indexOf(b.iconName)
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

	useEffect(() => {
		setAvailableIcons(
			Object.keys(allIcons)
				.sort()
				.map((name) => allIcons[name])
		);

		loadIconList();

		toggleSetFontSize(fontSize > 0);

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

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

	const iconListPage = splitArrayIntoChunks(
		availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
		24
	);

	return (
		<>
			{isSelected && (
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
																	iconSearchResultsPage - 1
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
																	iconSearchResultsPage + 1
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

																setAttributes({ selectedIcon: i.iconName });
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
							)}
						</div>
						<p>
							{__("Icon color")}
							<span
								id="ub-styled-list-selected-color"
								class="component-color-indicator"
								aria-label={`(Color: ${iconColor})`}
								style={{ background: iconColor }}
							/>
						</p>
						<ColorPalette
							value={iconColor}
							onChange={(iconColor) => {
								if (iconColor.match(/#[0-9a-f]{6}/gi)) {
									setAttributes({ iconColor });
								} else {
									setAttributes({
										iconColor:
											iconColor.toLowerCase() in colorList
												? colorList[iconColor.toLowerCase()]
												: getComputedStyle(
														document.documentElement
												  ).getPropertyValue(
														iconColor.substring(4, iconColor.length - 1)
												  ),
									});
								}
							}}
						/>
						<p>{__("Icon size")}</p>
						<RangeControl
							value={iconSize}
							onChange={(iconSize) => setAttributes({ iconSize })}
							min={1}
							max={10}
						/>
						<ToggleControl
							label={__("Customize font size")}
							checked={setFontSize}
							onChange={() => {
								if (setFontSize) {
									setAttributes({ fontSize: 0 });
								} else {
									setAttributes({
										fontSize: parseInt(
											getComputedStyle(
												blockContainer.current.children[0]
											).fontSize.slice(0, -2)
										),
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
									onChange={(fontSize) => setAttributes({ fontSize })}
									min={10}
									max={50}
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
					</PanelBody>
				</InspectorControls>
			)}

			{isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
				</BlockControls>
			)}

			<div
				className="ub_styled_list"
				id={`ub-styled-list-${blockID}`}
				style={{ textAlign: alignment }}
				ref={blockContainer}
			>
				<RichText
					className="fa-ul"
					style={{ gridTemplateColumns: "auto ".repeat(columns - 1) + "auto" }}
					multiline="li"
					__unstableMultilineRootTag={"ul"}
					onSplit={(list) =>
						createBlock("ub/styled-list", {
							...props.attributes,
							blockID: "",
							list,
						})
					}
					__unstableOnSplitMiddle={() => createBlock("core/paragraph")}
					onReplace={onReplace}
					tagName="ul"
					value={list}
					onChange={(newList) =>
						setAttributes({
							list: newList.replace("<ul>", '<ul class="fa-ul">'),
						})
					}
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
                        ${setFontSize ? `font-size: ${fontSize}px;` : ""}
                    }
                    #ub-styled-list-${blockID} li>ul{
                        margin-top: ${itemSpacing}px;
                    }`,
					}}
				/>
			</div>
		</>
	);
}

export default EditorComponent;
