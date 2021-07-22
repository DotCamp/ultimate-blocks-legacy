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
const {
	Button,
	Dropdown,
	PanelBody,
	RangeControl,
	ToggleControl,
} = wp.components;

import {
	dashesToCamelcase,
	splitArrayIntoChunks,
	splitArray,
} from "../../common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Component, createRef } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas, fab);

const allIcons = Object.assign(fas, fab);

class EditorComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			iconChoices: [],
			availableIcons: [],
			iconSearchTerm: "",
			iconSearchResultsPage: 0,
			recentSelection: "",
			selectionTime: 0,
			setFontSize: false,
			hasApiAccess: false,
		};
		this.blockContainer = createRef();
	}

	loadIconList() {
		const iconList = Object.keys(allIcons).sort();

		loadPromise.then(() => {
			this.settings = new models.Settings();

			this.settings.fetch().then((response) => {
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
					this.setState({ iconChoices: frequentIcons });

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

					this.setState({ availableIcons: [...icons, ...otherIcons] });
				} else {
					this.setState({
						availableIcons: iconList.map((name) => allIcons[name]),
					});
				}
				this.setState({ hasApiAccess: true });
			});
		});
	}

	updateIconList() {
		const {
			availableIcons,
			recentSelection,
			selectionTime,
			iconChoices,
		} = this.state;
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

		this.setState({
			recentSelection: "",
			selectionTime: 0,
			iconChoices: iconPrefs,
			availableIcons: [...icons, ...otherIcons],
		});

		const newIconArray = new models.Settings({
			ub_icon_choices: JSON.stringify(iconPrefs),
		});
		newIconArray.save();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.hasApiAccess) {
			if (!prevProps.isSelected && this.props.isSelected) {
				this.loadIconList();
			}
			if (prevProps.isSelected && !this.props.isSelected) {
				this.updateIconList();
			}
		}
	}

	componentDidMount() {
		this.setState({
			availableIcons: Object.keys(allIcons)
				.sort()
				.map((name) => allIcons[name]),
		});

		this.loadIconList();

		this.setState({ setFontSize: this.props.attributes.fontSize > 0 });
	}

	render() {
		const {
			availableIcons,
			iconSearchTerm,
			iconSearchResultsPage,
			recentSelection,
			hasApiAccess,
			setFontSize,
		} = this.state;

		const {
			block,
			getBlock,
			getClientIdsWithDescendants,
			isSelected,
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
			onReplace,
		} = this.props;

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === this.props.attributes.blockID
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

		const iconListPage = splitArrayIntoChunks(
			availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
			24
		);

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
												onChange={(e) =>
													this.setState({
														iconSearchTerm: e.target.value,
														iconSearchResultsPage: 0,
													})
												}
											/>
											<br />
											{iconListPage.length > 0 && (
												<div>
													<button
														onClick={() => {
															if (iconSearchResultsPage > 0) {
																this.setState({
																	iconSearchResultsPage:
																		iconSearchResultsPage - 1,
																});
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
																this.setState({
																	iconSearchResultsPage:
																		iconSearchResultsPage + 1,
																});
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
																this.setState({
																	recentSelection: i.iconName,
																	selectionTime: ~~(Date.now() / 1000),
																});

																setAttributes({ selectedIcon: i.iconName });
															}
														}}
													/>
												))}
										</div>
									)}
									onToggle={(isOpen) => {
										if (!isOpen && recentSelection && hasApiAccess) {
											this.updateIconList();
										}
									}}
								/>
							)}
						</div>
						<p>
							{__("Icon color")}
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${iconColor})`}
								style={{ background: iconColor }}
							/>
						</p>
						<ColorPalette
							value={iconColor}
							onChange={(iconColor) => setAttributes({ iconColor })}
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
												this.blockContainer.current.children[0]
											).fontSize.slice(0, -2)
										),
									});
								}

								this.setState({ setFontSize: !setFontSize });
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
			),

			isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
				</BlockControls>
			),

			<div
				className="ub_styled_list"
				id={`ub-styled-list-${blockID}`}
				style={{ textAlign: alignment }}
				ref={this.blockContainer}
			>
				<RichText
					className="fa-ul"
					style={{ gridTemplateColumns: "auto ".repeat(columns - 1) + "auto" }}
					multiline="li"
					__unstableMultilineRootTag={"ul"}
					onSplit={(list) =>
						createBlock("ub/styled-list", {
							...this.props.attributes,
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
			</div>,
		];
	}
}

export default EditorComponent;
