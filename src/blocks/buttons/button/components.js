import { isEmpty } from "lodash";
import { useRef, useEffect, useState } from "react";
import {
	generateIcon,
	dashesToCamelcase,
	splitArrayIntoChunks,
	splitArray,
} from "../../../common";
import { getStyles } from "./get-styles";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import SavedStylesInspector from "$Inc/components/SavedStyles/SavedStylesInspector";
import { IconControl } from "../../../../library/ub-common/Components";

import {
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
	URLInput,
	RichText,
	ColorPalette,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Button,
	ButtonGroup,
	ToggleControl,
	RangeControl,
	Dropdown,
	CheckboxControl,
	RadioControl,
	Popover,
	ToolbarGroup,
	ToolbarButton,
	TabPanel,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { loadPromise, models } from "@wordpress/api";
import { useSelect } from "@wordpress/data";
import {
	BorderControl,
	SpacingControl,
	TabsPanelControl,
} from "../../components";
import ColorSettings from "./components/ButtonColorSettings";

export const allIcons = Object.assign(fas, fab);

export const presetIconSize = { small: 25, medium: 30, large: 35, larger: 40 };

function useOutsideAlerter(ref, triggerOn, triggerOff) {
	useEffect(() => {
		function handleClickOutside(event) {
			const { classList } = event.target;

			if (
				ref.current &&
				!ref.current.contains(event.target) &&
				!(
					classList.contains("block-editor-url-input__suggestion") ||
					classList.contains("block-editor-url-input__suggestions")
				)
			) {
				triggerOff();
			}
		}

		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		//document.addEventListener("keydown", handleKeypress); //is this needed? probably not
		//props.showLinkInput();
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
			//document.removeEventListener("keydown", handleKeypress);
		};
	}, [triggerOn]);
}

//*
//* Component that alerts if you click outside of it
// *
function OutsideAlerter(props) {
	const wrapperRef = useRef(null);

	useOutsideAlerter(wrapperRef, props.visibilityTrigger, props.hideLinkInput);

	return (
		<div ref={wrapperRef} className={props.className}>
			{props.children}
		</div>
	);
}

export function EditorComponent(props) {
	const {
		isSelected,
		setAttributes,
		clientId,
		attributes: {
			blockID,
			align,
			buttonText,
			url,
			size,
			buttonColor,
			buttonHoverColor,
			buttonTextColor,
			buttonTextHoverColor,
			buttonIsTransparent,
			buttonWidth,
			chosenIcon,
			iconPosition,
			addNofollow,
			openInNewTab,
			iconSize,
			addSponsored,
			iconUnit,
			className,
		},
	} = props;
	const { block, getBlock, parentID, getClientIdsWithDescendants, getBlocks } =
		useSelect((select) => {
			const {
				getBlock,
				getBlockRootClientId,
				getClientIdsWithDescendants,
				getBlocks,
			} = select("core/block-editor") || select("core/editor");

			return {
				getBlock,
				block: getBlock(props.clientId),
				parentID: getBlockRootClientId(props.clientId),
				getClientIdsWithDescendants,
				getBlocks,
			};
		});
	const [availableIcons, setAvailableIcons] = useState([]);
	const [enableLinkInput, setLinkInputStatus] = useState(false);
	const [iconChoices, setIconChoices] = useState([]);
	const [iconSearchTerm, setIconSearchTerm] = useState("");
	const [iconSearchResultsPage, setIconSearchResultsPage] = useState(0);
	const [recentSelection, setRecentSelection] = useState("");
	const [hasApiAccess, setApiStatus] = useState(false);
	const [selectionTime, setSelectionTime] = useState(-1);

	if (blockID === "") {
		setAttributes({ blockID: block.clientId, align: "center" });
	} else {
		if (align === "") {
			setAttributes({ align: "center" });
		}
	}
	useEffect(() => {
		setAttributes({ blockID: block.clientId });
	}, [block.clientId]);
	if (!isSelected && enableLinkInput) {
		setLinkInputStatus(false);
	}
	const splittedClassNames = !isEmpty(className) ? className : [];
	useEffect(() => {
		if (
			buttonIsTransparent &&
			!splittedClassNames.includes("is-style-outline")
		) {
			splittedClassNames.push("is-style-outline");
			setAttributes({ className: splittedClassNames.join(" ") });
		}
	}, []);
	useEffect(() => {
		if (splittedClassNames.length > 0) {
			if (splittedClassNames.includes("is-style-fill")) {
				setAttributes({ buttonIsTransparent: false });
			} else {
				setAttributes({ buttonIsTransparent: true });
			}
		}
	}, [className]);

	const BUTTON_SIZES = {
		small: __("S", "ultimate-blocks"),
		medium: __("M", "ultimate-blocks"),
		large: __("L", "ultimate-blocks"),
		larger: __("XL", "ultimate-blocks"),
	};

	const BUTTON_WIDTHS = {
		fixed: __("Fixed", "ultimate-blocks"),
		flex: __("Flexible", "ultimate-blocks"),
		full: __("Full", "ultimate-blocks"),
	};

	const iconListPage = splitArrayIntoChunks(
		availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
		20,
	);

	const normalStateColors = (
		<>
			<ColorSettings
				value={buttonColor}
				onValueChange={(colorValue) =>
					setAttributes({
						buttonColor: colorValue,
					})
				}
				onValueReset={() => {
					setAttributes({
						buttonColor: "",
					});
				}}
				label={__("Button Color", "ultimate-blocks")}
			/>
			{!buttonIsTransparent && (
				<ColorSettings
					value={buttonTextColor}
					onValueChange={(colorValue) =>
						setAttributes({
							buttonTextColor: colorValue,
						})
					}
					onValueReset={() =>
						setAttributes({
							buttonTextColor: "",
						})
					}
					label={__("Button Text Color", "ultimate-blocks")}
				/>
			)}
		</>
	);
	const hoverStateColors = (
		<>
			<ColorSettings
				value={buttonHoverColor}
				onValueChange={(colorValue) =>
					setAttributes({
						buttonHoverColor: colorValue,
					})
				}
				onValueReset={() =>
					setAttributes({
						buttonHoverColor: "",
					})
				}
				label={__("Button Color", "ultimate-blocks")}
			/>
			{!buttonIsTransparent && (
				<ColorSettings
					value={buttonTextHoverColor}
					onValueChange={(colorValue) =>
						setAttributes({
							buttonTextHoverColor: colorValue,
						})
					}
					onValueReset={() =>
						setAttributes({
							buttonTextHoverColor: "",
						})
					}
					label={__("Button Text Color", "ultimate-blocks")}
				/>
			)}
		</>
	);

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
				setApiStatus(true);
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
		setAvailableIcons(
			Object.keys(allIcons)
				.sort()
				.map((name) => allIcons[name]),
		);

		loadIconList();
	}, []);

	useEffect(() => {
		if (hasApiAccess) {
			if (isSelected) {
				loadIconList();
			} else {
				updateIconList();
			}
		}
	}, [isSelected]);

	const blockProps = useBlockProps({
		className: `ub-button ub-button-block-main ub-button-${size} ${
			buttonWidth === "full"
				? "ub-button-full-width"
				: buttonWidth === "flex"
					? `ub-button-flex-${size}`
					: ""
		}`,
		style: getStyles(props.attributes),
	});

	return (
		<>
			{isSelected && (
				<>
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								icon="admin-links"
								label={__("Add button link")}
								onClick={() => setLinkInputStatus(true)}
							/>
						</ToolbarGroup>
					</BlockControls>
				</>
			)}
			{
				<>
					<InspectorControls group="settings">
						<>
							<PanelBody
								title={__("Size", "ultimate-blocks")}
								initialOpen={true}
							>
								<div className="ub-button-group">
									<ButtonGroup
										aria-label={__("Button Size", "ultimate-blocks")}
									>
										{Object.keys(BUTTON_SIZES).map((b) => (
											<Button
												isLarge
												isPrimary={size === b}
												aria-pressed={size === b}
												onClick={() =>
													setAttributes({
														size: b,
													})
												}
											>
												{BUTTON_SIZES[b]}
											</Button>
										))}
									</ButtonGroup>
								</div>
							</PanelBody>
							<PanelBody
								title={__("Width", "ultimate-blocks")}
								initialOpen={true}
							>
								<div className="ub-button-group">
									<ButtonGroup
										aria-label={__("Button Width", "ultimate-blocks")}
									>
										{Object.keys(BUTTON_WIDTHS).map((b) => (
											<Button
												isLarge
												isPrimary={buttonWidth === b}
												aria-pressed={buttonWidth === b}
												onClick={() =>
													setAttributes({
														buttonWidth: b,
													})
												}
											>
												{BUTTON_WIDTHS[b]}
											</Button>
										))}
									</ButtonGroup>
								</div>
							</PanelBody>
							<PanelBody
								title={__("Icon", "ultimate-blocks")}
								initialOpen={true}
							>
								<div style={{ gridColumn: "1/-1" }}>
									<IconControl
										onIconSelect={(val) => {
											setAttributes({
												chosenIcon: val,
											});
										}}
										label={__("Icon", "ultimate-blocks-pro")}
										selectedIcon={chosenIcon}
									/>
								</div>
								<RadioControl
									className="ub-button-icon-position"
									label={__("Icon position")}
									selected={iconPosition}
									options={[
										{
											label: __("Left", "ultimate-blocks"),
											value: "left",
										},
										{
											label: __("Right", "ultimate-blocks"),
											value: "right",
										},
									]}
									onChange={(pos) =>
										setAttributes({
											iconPosition: pos,
										})
									}
								/>
								{chosenIcon !== "" && (
									<>
										<ToggleControl
											label={__("Change icon size", "ultimate-blocks")}
											checked={iconSize > 0}
											onChange={(isOn) => {
												let newAttributes = { iconUnit: "px" };

												if (isOn) {
													newAttributes = Object.assign({}, newAttributes, {
														iconSize: presetIconSize[size],
													});
												} else {
													newAttributes = Object.assign({}, newAttributes, {
														iconSize: 0,
													});
												}

												setAttributes(newAttributes);
											}}
										/>
										{iconSize > 0 && (
											<div id="ub-button-radius-panel">
												<RangeControl
													label={__("Icon size")}
													value={iconSize}
													step={iconUnit === "em" ? 0.1 : 1}
													onChange={(value) =>
														setAttributes({
															iconSize: value,
														})
													}
												/>
												<ButtonGroup
													aria-label={__("Button Size Unit", "ultimate-blocks")}
												>
													{["px", "em"].map((b) => (
														<Button
															isLarge
															isPrimary={b === iconUnit}
															aria-pressed={b === iconUnit}
															onClick={() =>
																setAttributes({
																	iconUnit: b,
																})
															}
														>
															{b}
														</Button>
													))}
												</ButtonGroup>
											</div>
										)}
									</>
								)}
							</PanelBody>
						</>
					</InspectorControls>
					<InspectorControls group="styles">
						<>
							<SavedStylesInspector
								attributes={props.attributes}
								defaultAttributes={(() => {
									// eslint-disable-next-line no-unused-vars
									const { buttonText, url, ...rest } = props.attributes;

									return rest;
								})()}
								attributesToSave={(() => {
									// eslint-disable-next-line no-unused-vars
									const { buttonText, url, ...rest } = props.attributes;
									return Object.keys(rest).filter((key) => {
										return Object.prototype.hasOwnProperty.call(rest, key);
									});
								})()}
								setAttribute={(styleObject) => {
									setAttributes(styleObject);
								}}
								previewAttributeCallback={(attr, styleName) => {
									return {
										...attr,
										buttonText: styleName,
									};
								}}
								previewElementCallback={(el) => {
									if (el && typeof el.querySelector === "function") {
										const plusButton = el.querySelector("button");

										const textEditor = el.querySelector('div[role="textbox"]');
										if (textEditor) {
											// disable in-place text editor
											textEditor.setAttribute("contenteditable", false);
										}

										el.removeChild(plusButton);
									}

									return el;
								}}
							/>
						</>
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
					<InspectorControls group="color">
						<TabsPanelControl
							tabs={[
								{
									name: "normalState",
									title: __("Normal", "ultimate-blocks"),
									component: normalStateColors,
								},
								{
									name: "hoverState",
									title: __("Hover", "ultimate-blocks"),
									component: hoverStateColors,
								},
							]}
						/>
					</InspectorControls>
					<InspectorControls group="border">
						<BorderControl
							showDefaultBorder
							showDefaultBorderRadius
							attrBorderKey="border"
							attrBorderRadiusKey="borderRadius"
							borderLabel={__("Border", "ultimate-blocks")}
							borderRadiusLabel={__("Border Radius", "ultimate-blocks")}
						/>
					</InspectorControls>
				</>
			}
			<>
				<div {...blockProps}>
					<div
						className="ub-button-content-holder"
						style={{
							flexDirection: iconPosition === "left" ? "row" : "row-reverse",
						}}
					>
						{chosenIcon !== "" &&
							allIcons.hasOwnProperty(`fa${dashesToCamelcase(chosenIcon)}`) && (
								<div className="ub-button-icon-holder">
									{generateIcon(
										allIcons[`fa${dashesToCamelcase(chosenIcon)}`],
										iconSize || presetIconSize[size],
										iconUnit || "px",
									)}
								</div>
							)}
						<RichText
							className="ub-button-block-btn"
							placeholder={__("Button Text", "ultimate-blocks")}
							onChange={(value) =>
								setAttributes({
									buttonText: value,
								})
							}
							value={buttonText}
							allowedFormats={[
								"core/bold",
								"core/italic",
								"core/strikethrough",
							]}
							keepPlaceholderOnFocus={true}
						/>
					</div>
				</div>
				{enableLinkInput && (
					<Popover>
						<OutsideAlerter
							className="ub_button_popover"
							visibilityTrigger={enableLinkInput}
							hideLinkInput={() => setLinkInputStatus(false)}
						>
							<div className="ub_button_url_input">
								<form
									onSubmit={(event) => event.preventDefault()}
									className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
								>
									<URLInput
										autoFocus={false}
										className="button-url"
										disableSuggestions={
											url?.startsWith("#") || isEmpty(url?.trim())
										}
										value={url}
										onChange={(value) => {
											setAttributes({
												url: value,
											});
										}}
									/>
									<Button
										icon={"editor-break"}
										label={__("Apply", "ultimate-blocks")}
										type={"submit"}
									/>
								</form>
							</div>
							<CheckboxControl
								label={__("Open Link in New Tab", "ultimate-blocks")}
								checked={openInNewTab}
								onChange={() =>
									setAttributes({
										openInNewTab: !openInNewTab,
									})
								}
							/>
							<CheckboxControl
								label={__("Add Nofollow to Link", "ultimate-blocks")}
								checked={addNofollow}
								onChange={() =>
									setAttributes({
										addNofollow: !addNofollow,
									})
								}
							/>
							<CheckboxControl
								label={__("Mark link as sponsored", "ultimate-blocks")}
								checked={addSponsored}
								onChange={() =>
									setAttributes({
										addSponsored: !addSponsored,
									})
								}
							/>
						</OutsideAlerter>
					</Popover>
				)}
			</>
		</>
	);
}
