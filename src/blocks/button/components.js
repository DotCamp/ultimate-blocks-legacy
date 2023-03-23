import { useRef, useEffect, useState } from "react";
import {
	generateIcon,
	dashesToCamelcase,
	splitArrayIntoChunks,
	splitArray,
} from "../../common";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

const {
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
	URLInput,
	RichText,
	ColorPalette,
} = wp.blockEditor || wp.editor;
const {
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
} = wp.components;
const { __ } = wp.i18n;
const { loadPromise, models } = wp.api;

export const allIcons = Object.assign(fas, fab);

export const presetIconSize = { small: 25, medium: 30, large: 35, larger: 40 };

export const defaultButtonProps = {
	buttonText: "Button Text",
	url: "",
	size: "medium",
	buttonColor: "#313131",
	buttonHoverColor: "#313131",
	buttonTextColor: "#ffffff",
	buttonTextHoverColor: "#ffffff",
	buttonRounded: true,
	buttonRadius: 10, //retained for compatibility
	buttonRadiusUnit: "px", //retained for compatibility

	topLeftRadius: 10,
	topLeftRadiusUnit: "px",
	topRightRadius: 10,
	topRightRadiusUnit: "px",
	bottomLeftRadius: 10,
	bottomLeftRadiusUnit: "px",
	bottomRightRadius: 10,
	bottomRightRadiusUnit: "px",

	chosenIcon: "",
	iconPosition: "left",
	iconSize: 0,
	iconUnit: "px",
	buttonIsTransparent: false,
	addNofollow: false,
	openInNewTab: true,
	addSponsored: false,
	buttonWidth: "flex",
};

//commented out in old button block
export const blockControls = (props) => {
	const {
		setAttributes,
		attributes: { buttons, align },
		toggleLinkInput,
	} = props;

	return (
		buttons.length > 0 && (
			<BlockControls>
				<BlockAlignmentToolbar
					value={align}
					onChange={(newAlignment) => setAttributes({ align: newAlignment })}
					controls={["left", "center", "right"]}
				/>
				<ToolbarGroup>
					<ToolbarButton
						icon="admin-links"
						label={__("Add button link")}
						onClick={() => toggleLinkInput(true)}
					/>
				</ToolbarGroup>
			</BlockControls>
		)
	);
};

//commented out in old button block
export const inspectorControls = (props) => {
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

	const {
		attributes: { buttons },
		setAttributes,
		availableIcons,
		iconSearchTerm,
		setIconSearchTerm,
		iconSearchResultsPage,
		setIconSearchResultsPage,
		activeButtonIndex,
	} = props;

	const iconListPage = splitArrayIntoChunks(
		availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
		20
	);

	const normalColorPanels = buttons.length && activeButtonIndex > -1 && (
		<>
			<p>
				{__("Button Color", "ultimate-blocks")}
				{buttons[activeButtonIndex].buttonColor && (
					<span
						class="component-color-indicator"
						aria-label={`(Color: ${buttons[activeButtonIndex].buttonColor})`}
						style={{
							background: buttons[activeButtonIndex].buttonColor,
						}}
					/>
				)}
			</p>
			<ColorPalette
				value={buttons[activeButtonIndex].buttonColor}
				onChange={(colorValue) =>
					setAttributes({
						buttons: [
							...buttons.slice(0, activeButtonIndex),
							Object.assign({}, buttons[activeButtonIndex], {
								buttonColor: colorValue,
							}),
							...buttons.slice(activeButtonIndex + 1),
						],
					})
				}
			/>
			{!buttons[activeButtonIndex].buttonIsTransparent && (
				<>
					<p>
						{__("Button Text Color", "ultimate-blocks")}
						{buttons[activeButtonIndex].buttonTextColor && (
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${buttons[activeButtonIndex].buttonTextColor})`}
								style={{
									background: buttons[activeButtonIndex].buttonTextColor,
								}}
							/>
						)}
					</p>
					<ColorPalette
						value={buttons[activeButtonIndex].buttonTextColor}
						onChange={(colorValue) =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonTextColor: colorValue,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</>
			)}
		</>
	);

	const hoverColorPanels = buttons.length && activeButtonIndex > -1 && (
		<>
			<p>
				{__("Button Color", "ultimate-blocks")}
				{buttons[activeButtonIndex].buttonHoverColor && (
					<span
						class="component-color-indicator"
						aria-label={`(Color: ${buttons[activeButtonIndex].buttonHoverColor})`}
						style={{
							background: buttons[activeButtonIndex].buttonHoverColor,
						}}
					/>
				)}
			</p>
			<ColorPalette
				value={buttons[activeButtonIndex].buttonHoverColor}
				onChange={(colorValue) =>
					setAttributes({
						buttons: [
							...buttons.slice(0, activeButtonIndex),
							Object.assign({}, buttons[activeButtonIndex], {
								buttonHoverColor: colorValue,
							}),
							...buttons.slice(activeButtonIndex + 1),
						],
					})
				}
			/>
			{!buttons[activeButtonIndex].buttonIsTransparent && (
				<>
					<p>
						{__("Button Text Color", "ultimate-blocks")}
						{buttons[activeButtonIndex].buttonTextHoverColor && (
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${buttons[activeButtonIndex].buttonTextHoverColor})`}
								style={{
									background: buttons[activeButtonIndex].buttonTextHoverColor,
								}}
							/>
						)}
					</p>
					<ColorPalette
						value={buttons[activeButtonIndex].buttonTextHoverColor}
						onChange={(colorValue) =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonTextHoverColor: colorValue,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</>
			)}
		</>
	);

	return (
		buttons.length > 0 && (
			<InspectorControls>
				<PanelBody title={__("Size", "ultimate-blocks")} initialOpen={true}>
					<div className="ub-button-group">
						<ButtonGroup aria-label={__("Button Size", "ultimate-blocks")}>
							{Object.keys(BUTTON_SIZES).map((b) => (
								<Button
									isLarge
									isPrimary={buttons[activeButtonIndex].size === b}
									aria-pressed={buttons[activeButtonIndex].size === b}
									onClick={() =>
										setAttributes({
											buttons: [
												...buttons.slice(0, activeButtonIndex),
												Object.assign({}, buttons[activeButtonIndex], {
													size: b,
												}),
												...buttons.slice(activeButtonIndex + 1),
											],
										})
									}
								>
									{BUTTON_SIZES[b]}
								</Button>
							))}
						</ButtonGroup>
					</div>
				</PanelBody>
				<PanelBody title={__("Width", "ultimate-blocks")} initialOpen={true}>
					<div className="ub-button-group">
						<ButtonGroup aria-label={__("Button Width", "ultimate-blocks")}>
							{Object.keys(BUTTON_WIDTHS).map((b) => (
								<Button
									isLarge
									isPrimary={buttons[activeButtonIndex].buttonWidth === b}
									aria-pressed={buttons[activeButtonIndex].buttonWidth === b}
									onClick={() =>
										setAttributes({
											buttons: [
												...buttons.slice(0, activeButtonIndex),
												Object.assign({}, buttons[activeButtonIndex], {
													buttonWidth: b,
												}),
												...buttons.slice(activeButtonIndex + 1),
											],
										})
									}
								>
									{BUTTON_WIDTHS[b]}
								</Button>
							))}
						</ButtonGroup>
					</div>
				</PanelBody>
				<PanelBody title={__("Border", "ultimate-blocks")} initialOpen={false}>
					<ToggleControl
						label={__("Rounded", "ultimate-blocks")}
						checked={buttons[activeButtonIndex].buttonRounded}
						onChange={() =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonRounded: !buttons[activeButtonIndex].buttonRounded,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</PanelBody>
				{buttons[activeButtonIndex].buttonRounded && (
					<PanelBody title={__("Button Radius", "ultimate-blocks")}>
						<div id="ub-button-radius-panel">
							<RangeControl
								label={__("Button Radius")}
								value={buttons[activeButtonIndex].buttonRadius}
								onChange={(value) =>
									setAttributes({
										buttons: [
											...buttons.slice(0, activeButtonIndex),
											Object.assign({}, buttons[activeButtonIndex], {
												buttonRadius: value,
											}),
											...buttons.slice(activeButtonIndex + 1),
										],
									})
								}
								min={1}
								max={100}
							/>
							<ButtonGroup
								aria-label={__("Button Radius Unit", "ultimate-blocks")}
							>
								{["px", "%"].map((b) => (
									<Button
										isLarge
										isPrimary={
											buttons[activeButtonIndex].buttonRadiusUnit === b
										}
										aria-pressed={
											buttons[activeButtonIndex].buttonRadiusUnit === b
										}
										onClick={() =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonRadiusUnit: b,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											})
										}
									>
										{b}
									</Button>
								))}
							</ButtonGroup>
						</div>
					</PanelBody>
				)}

				<PanelBody title={__("Icon", "ultimate-blocks")} initialOpen={false}>
					<div className="ub-button-grid">
						<p>{__("Selected icon", "ultimate-blocks")}</p>
						<div className="ub-button-grid-selector">
							<Dropdown
								position="bottom right"
								renderToggle={({ isOpen, onToggle }) => (
									<Button
										className="ub-button-icon-select"
										icon={
											buttons[activeButtonIndex].chosenIcon !== "" &&
											generateIcon(
												allIcons[
													`fa${dashesToCamelcase(
														buttons[activeButtonIndex].chosenIcon
													)}`
												],
												35
											)
										}
										label={__("Open icon selection dialog", "ultimate-blocks")}
										onClick={onToggle}
										aria-expanded={isOpen}
									/>
								)}
								renderContent={() => (
									<div>
										<input
											type="text"
											value={iconSearchTerm}
											onChange={(e) => {
												setIconSearchResultsPage(0);
												setIconSearchTerm(e.target.value);
											}}
										/>
										{iconSearchTerm === "" && (
											<Button
												className="ub-button-available-icon"
												onClick={() =>
													setAttributes({
														buttons: [
															...buttons.slice(0, activeButtonIndex),
															Object.assign({}, buttons[activeButtonIndex], {
																chosenIcon: "",
															}),
															...buttons.slice(activeButtonIndex + 1),
														],
													})
												}
											>
												{__("No icon", "ultimate-blocks")}
											</Button>
										)}
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
													className="ub-button-available-icon"
													icon={generateIcon(i, 35)}
													label={i.iconName}
													onClick={() =>
														setAttributes({
															buttons: [
																...buttons.slice(0, activeButtonIndex),
																Object.assign({}, buttons[activeButtonIndex], {
																	chosenIcon: i.iconName,
																}),
																...buttons.slice(activeButtonIndex + 1),
															],
														})
													}
												/>
											))}
									</div>
								)}
							/>
						</div>
					</div>
					<RadioControl
						className="ub-button-icon-position"
						label={__("Icon position")}
						selected={buttons[activeButtonIndex].iconPosition}
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
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										iconPosition: pos,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</PanelBody>
				<PanelBody
					title={__("Colors", "ultimate-blocks")}
					initialOpen={false}
				>
					<ToggleControl
						label={__("Transparent", "ultimate-blocks")}
						checked={buttons[activeButtonIndex].buttonIsTransparent}
						onChange={() =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonIsTransparent:
											!buttons[activeButtonIndex].buttonIsTransparent,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
					<TabPanel
						className="ub-tab-panel"
						tabs={[
							{
								name: "buttoncolor",
								title: __("Normal"),
							},
							{
								name: "buttonhovercolor",
								title: __("Hover"),
							},
						]}
					>
						{(tab) =>
							tab.name === "buttoncolor" ? normalColorPanels : hoverColorPanels
						}
					</TabPanel>
				</PanelBody>
			</InspectorControls>
		)
	);
};

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

const URLInputBox = (props) => {
	const { attributes, setAttributes, index, visibilityTrigger } = props;
	const { buttons } = attributes;
	const [currentURL, setCurrentURL] = useState("");

	useEffect(() => {
		setCurrentURL(buttons[index].url);
	}, []);

	return (
		<OutsideAlerter
			className="ub_button_popover"
			visibilityTrigger={visibilityTrigger}
		>
			<div className="ub_button_url_input">
				<form
					onSubmit={(event) => event.preventDefault()}
					className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
				>
					{
						<URLInput
							//autoFocus={false}
							className="button-url"
							value={currentURL}
							onChange={(value) => {
								setCurrentURL(value);
								setAttributes({
									buttons: [
										...buttons.slice(0, index),
										Object.assign({}, buttons[index], {
											url: value,
										}),
										...buttons.slice(index + 1),
									],
								});
							}}
						/>
					}
					{/*<input
								type="text"
								value={currentURL}
								placeholder="not the built-in url input box"
								onChange={(e) => setCurrentURL(e.target.value)}
							/>*/}
					<Button
						icon={"editor-break"}
						label={__("Apply", "ultimate-blocks")}
						type={"submit"}
						/*onClick={() =>

							}*/
					/>
				</form>
			</div>
			<CheckboxControl
				label={__("Open Link in New Tab", "ultimate-blocks")}
				checked={buttons[index].openInNewTab}
				onChange={() =>
					setAttributes({
						buttons: [
							...buttons.slice(0, index),
							Object.assign({}, buttons[index], {
								openInNewTab: !buttons[index].openInNewTab,
							}),
							...buttons.slice(index + 1),
						],
					})
				}
			/>
			<CheckboxControl
				label={__("Add Nofollow to Link", "ultimate-blocks")}
				checked={buttons[index].addNofollow}
				onChange={() =>
					setAttributes({
						buttons: [
							...buttons.slice(0, index),
							Object.assign({}, buttons[index], {
								addNofollow: !buttons[index].addNofollow,
							}),
							...buttons.slice(index + 1),
						],
					})
				}
			/>
			<CheckboxControl
				label={__("Mark link as sponsored", "ultimate-blocks")}
				checked={buttons[index].addSponsored}
				onChange={() =>
					setAttributes({
						buttons: [
							...buttons.slice(0, index),
							Object.assign({}, buttons[index], {
								addSponsored: !buttons[index].addSponsored,
							}),
							...buttons.slice(index + 1),
						],
					})
				}
			/>
		</OutsideAlerter>
	);
};

export const editorDisplay = (props) => {
	const {
		isSelected,
		setAttributes,
		attributes: { buttons, align },
		activeButtonIndex,
		setActiveButtonIndex,
		hoveredButton,
		setHoveredButton,
		enableLinkInput,
		toggleLinkInput,
	} = props;

	return (
		<div className={`ub-buttons align-button-${align}`}>
			{typeof buttons !== "undefined" && (
				<>
					{buttons.map((b, i) => (
						<div
							className={`ub-button-container${
								b.buttonWidth === "full" ? " ub-button-full-container" : ""
							}`}
						>
							{buttons.length > 1 && (
								<div className="ub-button-delete">
									<span
										title={__("Delete This Button")}
										onClick={() => {
											setActiveButtonIndex(
												activeButtonIndex > i
													? activeButtonIndex - 1
													: Math.min(activeButtonIndex, buttons.length - 2)
											);
											setAttributes({
												buttons: [
													...buttons.slice(0, i),
													...buttons.slice(i + 1),
												],
											});
										}}
										class="dashicons dashicons-dismiss"
									/>
								</div>
							)}
							<div
								className={`ub-button-block-main ub-button-${b.size} ${
									b.buttonWidth === "full"
										? "ub-button-full-width"
										: b.buttonWidth === "flex"
										? `ub-button-flex-${b.size}`
										: ""
								}`}
								onMouseEnter={() => setHoveredButton(i)}
								onMouseLeave={() => setHoveredButton(-1)}
								onClick={() => setActiveButtonIndex(i)}
								style={{
									backgroundColor: b.buttonIsTransparent
										? "transparent"
										: hoveredButton === i
										? b.buttonHoverColor
										: b.buttonColor,
									color:
										hoveredButton === i
											? b.buttonIsTransparent
												? b.buttonHoverColor
												: b.buttonTextHoverColor || "inherit"
											: b.buttonIsTransparent
											? b.buttonColor
											: b.buttonTextColor || "inherit",
									borderRadius: b.buttonRounded
										? `${b.buttonRadius || 10}${b.buttonRadiusUnit || "px"}`
										: "0",
									borderStyle: b.buttonIsTransparent ? "solid" : "none",
									borderColor: b.buttonIsTransparent
										? hoveredButton === i
											? b.buttonHoverColor
											: b.buttonColor
										: null,
									boxShadow:
										isSelected && activeButtonIndex === i
											? "0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 -10px 8px 0 rgba(0, 0, 0, 0.2)"
											: null,
								}}
							>
								<div
									className="ub-button-content-holder"
									style={{
										flexDirection:
											b.iconPosition === "left" ? "row" : "row-reverse",
									}}
								>
									{b.chosenIcon !== "" &&
										allIcons.hasOwnProperty(
											`fa${dashesToCamelcase(b.chosenIcon)}`
										) && (
											<div className="ub-button-icon-holder">
												{generateIcon(
													allIcons[`fa${dashesToCamelcase(b.chosenIcon)}`],
													presetIconSize[b.size]
												)}
											</div>
										)}
									<RichText
										className="ub-button-block-btn"
										placeholder={__("Button Text", "ultimate-blocks")}
										onChange={(value) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, i),
													Object.assign({}, buttons[i], {
														buttonText: value,
													}),
													...buttons.slice(i + 1),
												],
											})
										}
										unstableOnFocus={() => setActiveButtonIndex(i)}
										value={b.buttonText}
										allowedFormats={[
											"core/bold",
											"core/italic",
											"core/strikethrough",
										]}
										keepPlaceholderOnFocus={true}
									/>
								</div>
							</div>
							{activeButtonIndex === i && enableLinkInput && (
								<URLInputBox
									{...props}
									index={i}
									visibilityTrigger={enableLinkInput}
									hideLinkInput={() => toggleLinkInput(false)}
									showLinkInput={() => toggleLinkInput(true)}
								/>
							)}
						</div>
					))}
					<button
						onClick={() => {
							setAttributes({ buttons: [...buttons, defaultButtonProps] });
							setActiveButtonIndex(buttons.length);
						}}
					>
						+
					</button>
				</>
			)}
		</div>
	);
};

export function EditorComponent(props) {
	const {
		isSelected,
		block,
		setAttributes,
		attributes: {
			blockID,
			buttons,
			align,
			buttonText,
			url,
			size,
			buttonColor,
			buttonHoverColor,
			buttonTextColor,
			buttonTextHoverColor,
			buttonIsTransparent,
			buttonRounded,
			buttonWidth,
			chosenIcon,
			iconPosition,
			addNofollow,
			openInNewTab,
		},
		getBlock,
		getClientIdsWithDescendants,
	} = props;

	const [availableIcons, setAvailableIcons] = useState([]);
	const [activeButtonIndex, setActiveButtonIndex] = useState(-1);
	const [enableLinkInput, setLinkInputStatus] = useState(false);
	const [hoveredButton, setHoveredButton] = useState(-1);
	const [iconChoices, setIconChoices] = useState([]);
	const [iconSearchTerm, setIconSearchTerm] = useState("");
	const [iconSearchResultsPage, setIconSearchResultsPage] = useState(0);
	const [recentSelection, setRecentSelection] = useState("");
	const [hasApiAccess, setApiStatus] = useState(false);
	const [selectionTime, setSelectionTime] = useState(-1);
	const [currentCorner, setCurrentCorner] = useState("all");

	if (blockID === "") {
		setAttributes({ blockID: block.clientId, align: "center" });
	} else {
		if (align === "") {
			setAttributes({ align: "center" });
		}
		if (
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}

	if (!isSelected && enableLinkInput) {
		setLinkInputStatus(false);
	}

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
		20
	);

	const normalColorPanels = buttons.length && activeButtonIndex > -1 && (
		<>
			<p>
				{__("Button Color", "ultimate-blocks")}
				{buttons[activeButtonIndex].buttonColor && (
					<span
						class="component-color-indicator"
						aria-label={`(Color: ${buttons[activeButtonIndex].buttonColor})`}
						style={{
							background: buttons[activeButtonIndex].buttonColor,
						}}
					/>
				)}
			</p>
			<ColorPalette
				value={buttons[activeButtonIndex].buttonColor}
				onChange={(colorValue) =>
					setAttributes({
						buttons: [
							...buttons.slice(0, activeButtonIndex),
							Object.assign({}, buttons[activeButtonIndex], {
								buttonColor: colorValue,
							}),
							...buttons.slice(activeButtonIndex + 1),
						],
					})
				}
			/>
			{!buttons[activeButtonIndex].buttonIsTransparent && (
				<>
					<p>
						{__("Button Text Color", "ultimate-blocks")}
						{buttons[activeButtonIndex].buttonTextColor && (
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${buttons[activeButtonIndex].buttonTextColor})`}
								style={{
									background: buttons[activeButtonIndex].buttonTextColor,
								}}
							/>
						)}
					</p>
					<ColorPalette
						value={buttons[activeButtonIndex].buttonTextColor}
						onChange={(colorValue) =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonTextColor: colorValue,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</>
			)}
		</>
	);

	const hoverColorPanels = buttons.length && activeButtonIndex > -1 && (
		<>
			<p>
				{__("Button Color", "ultimate-blocks")}
				{buttons[activeButtonIndex].buttonHoverColor && (
					<span
						class="component-color-indicator"
						aria-label={`(Color: ${buttons[activeButtonIndex].buttonHoverColor})`}
						style={{
							background: buttons[activeButtonIndex].buttonHoverColor,
						}}
					/>
				)}
			</p>
			<ColorPalette
				value={buttons[activeButtonIndex].buttonHoverColor}
				onChange={(colorValue) =>
					setAttributes({
						buttons: [
							...buttons.slice(0, activeButtonIndex),
							Object.assign({}, buttons[activeButtonIndex], {
								buttonHoverColor: colorValue,
							}),
							...buttons.slice(activeButtonIndex + 1),
						],
					})
				}
			/>
			{!buttons[activeButtonIndex].buttonIsTransparent && (
				<>
					<p>
						{__("Button Text Color", "ultimate-blocks")}
						{buttons[activeButtonIndex].buttonTextHoverColor && (
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${buttons[activeButtonIndex].buttonTextHoverColor})`}
								style={{
									background: buttons[activeButtonIndex].buttonTextHoverColor,
								}}
							/>
						)}
					</p>
					<ColorPalette
						value={buttons[activeButtonIndex].buttonTextHoverColor}
						onChange={(colorValue) =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonTextHoverColor: colorValue,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</>
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
		setAvailableIcons(
			Object.keys(allIcons)
				.sort()
				.map((name) => allIcons[name])
		);

		loadIconList();

		if (buttons.length === 0) {
			setAttributes({
				buttons: [
					Object.assign({}, defaultButtonProps, {
						buttonText,
						url,
						size,
						buttonColor,
						buttonHoverColor,
						buttonTextColor,
						buttonTextHoverColor,
						buttonRounded,
						chosenIcon,
						iconPosition,
						buttonIsTransparent,
						addNofollow,
						openInNewTab,
						buttonWidth,
					}),
				],
			});
		} else {
			let newButtons = JSON.parse(JSON.stringify(buttons));
			let cornersNotSet = false;

			newButtons.forEach((b) => {
				if (!b.hasOwnProperty("topLeftRadius")) {
					if (!cornersNotSet) {
						cornersNotSet = true;
					}

					b.topLeftRadius = b.buttonRadius;
					b.topRightRadius = b.buttonRadius;
					b.bottomLeftRadius = b.buttonRadius;
					b.bottomRightRadius = b.buttonRadius;

					b.topLeftRadiusUnit = b.buttonRadiusUnit;
					b.topRightRadiusUnit = b.buttonRadiusUnit;
					b.bottomLeftRadiusUnit = b.buttonRadiusUnit;
					b.bottomRightRadiusUnit = b.buttonRadiusUnit;

					b.iconSize = 0;
					b.iconUnit = "px";
				}
			});

			if (cornersNotSet) {
				setAttributes({ buttons: JSON.parse(JSON.stringify(newButtons)) });
			}
		}
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

	return (
		<>
			{isSelected && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						onChange={(newAlignment) => setAttributes({ align: newAlignment })}
						controls={["left", "center", "right"]}
					/>
					<ToolbarGroup>
						<ToolbarButton
							icon="admin-links"
							label={__("Add button link")}
							onClick={() => setLinkInputStatus(true)}
						/>
					</ToolbarGroup>
				</BlockControls>
			)}
			{
				<InspectorControls>
					{isSelected && buttons.length > 0 && activeButtonIndex > -1 && (
						<>
							<PanelBody title={__("Size", "ultimate-blocks")} initialOpen={true}>
								<div className="ub-button-group">
									<ButtonGroup
										aria-label={__("Button Size", "ultimate-blocks")}
									>
										{Object.keys(BUTTON_SIZES).map((b) => (
											<Button
												isLarge
												isPrimary={buttons[activeButtonIndex].size === b}
												aria-pressed={buttons[activeButtonIndex].size === b}
												onClick={() =>
													setAttributes({
														buttons: [
															...buttons.slice(0, activeButtonIndex),
															Object.assign({}, buttons[activeButtonIndex], {
																size: b,
															}),
															...buttons.slice(activeButtonIndex + 1),
														],
													})
												}
											>
												{BUTTON_SIZES[b]}
											</Button>
										))}
									</ButtonGroup>
								</div>
							</PanelBody>
							<PanelBody title={__("Width", "ultimate-blocks")} initialOpen={true}>
								<div className="ub-button-group">
									<ButtonGroup
										aria-label={__("Button Width", "ultimate-blocks")}
									>
										{Object.keys(BUTTON_WIDTHS).map((b) => (
											<Button
												isLarge
												isPrimary={buttons[activeButtonIndex].buttonWidth === b}
												aria-pressed={
													buttons[activeButtonIndex].buttonWidth === b
												}
												onClick={() =>
													setAttributes({
														buttons: [
															...buttons.slice(0, activeButtonIndex),
															Object.assign({}, buttons[activeButtonIndex], {
																buttonWidth: b,
															}),
															...buttons.slice(activeButtonIndex + 1),
														],
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
								title={__("Colors", "ultimate-blocks")}
								initialOpen={false}
							>
								<ToggleControl
									label={__("Transparent", "ultimate-blocks")}
									checked={buttons[activeButtonIndex].buttonIsTransparent}
									onChange={() =>
										setAttributes({
											buttons: [
												...buttons.slice(0, activeButtonIndex),
												Object.assign({}, buttons[activeButtonIndex], {
													buttonIsTransparent:
														!buttons[activeButtonIndex].buttonIsTransparent,
												}),
												...buttons.slice(activeButtonIndex + 1),
											],
										})
									}
								/>
								<TabPanel
									className="ub-tab-panels"
									tabs={[
										{
											name: "buttoncolor",
											title: __("Normal"),
										},
										{
											name: "buttonhovercolor",
											title: __("Hover"),
										},
									]}
								>
									{(tab) =>
										tab.name === "buttoncolor"
											? normalColorPanels
											: hoverColorPanels
									}
								</TabPanel>
							</PanelBody>
							<PanelBody title={__("Border", "ultimate-blocks")} initialOpen={false}>
								<ToggleControl
									label={__("Rounded", "ultimate-blocks")}
									checked={buttons[activeButtonIndex].buttonRounded}
									onChange={() => {
										setAttributes({
											buttons: [
												...buttons.slice(0, activeButtonIndex),
												Object.assign({}, buttons[activeButtonIndex], {
													buttonRounded:
														!buttons[activeButtonIndex].buttonRounded,
												}),
												...buttons.slice(activeButtonIndex + 1),
											],
										});
										setCurrentCorner("all");
									}}
								/>
								{buttons[activeButtonIndex].buttonRounded && (
									<>
										<div className="ub-indicator-grid">
											{/* FIRST ROW */}
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-bottom-border ub-indicator-grid-right-border"
												style={{
													borderTop: `2px solid ${
														currentCorner === "topleft" ? "blue" : "black"
													}`,
													borderLeft: `2px solid ${
														currentCorner === "topleft" ? "blue" : "black"
													}`,
												}}
												onClick={() => setCurrentCorner("topleft")}
											/>
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-bottom-border ub-indicator-grid-left-border"
												style={{
													borderTop: `2px solid ${
														currentCorner === "topright" ? "blue" : "black"
													}`,
													borderRight: `2px solid ${
														currentCorner === "topright" ? "blue" : "black"
													}`,
												}}
												onClick={() => setCurrentCorner("topright")}
											></div>
											{/* SECOND ROW */}
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell"
												style={{
													border: `2px solid ${
														currentCorner === "all" ? "blue" : "black"
													}`,
												}}
												onClick={() => {
													if (currentCorner !== "all") {
														let commonRadius = 0;
														let commonUnit = "px";

														switch (currentCorner) {
															case "topleft":
																commonRadius =
																	buttons[activeButtonIndex].topLeftRadius;
																commonUnit =
																	buttons[activeButtonIndex].topLeftRadiusUnit;
																break;
															case "topright":
																commonRadius =
																	buttons[activeButtonIndex].topRightRadius;
																commonUnit =
																	buttons[activeButtonIndex].topRightRadiusUnit;
																break;
															case "bottomleft":
																commonRadius =
																	buttons[activeButtonIndex].bottomLeftRadius;
																commonUnit =
																	buttons[activeButtonIndex]
																		.bottomLeftRadiusUnit;
																break;
															case "bottomright":
																commonRadius =
																	buttons[activeButtonIndex].bottomRightRadius;
																commonUnit =
																	buttons[activeButtonIndex]
																		.bottomLeftRadiusUnit;
																break;
														}

														setAttributes({
															buttons: [
																...buttons.slice(0, activeButtonIndex),
																Object.assign({}, buttons[activeButtonIndex], {
																	topLeftRadius: commonRadius,
																	topRightRadius: commonRadius,
																	bottomLeftRadius: commonRadius,
																	bottomRightRadius: commonRadius,
																	topLeftRadiusUnit: commonUnit,
																	topRightRadiusUnit: commonUnit,
																	bottomLeftRadiusUnit: commonUnit,
																	bottomRightRadiusUnit: commonUnit,
																}),
																...buttons.slice(activeButtonIndex + 1),
															],
														});
													}
													setCurrentCorner("all");
												}}
											></div>
											<div className="ub-indicator-grid-cell" />
											{/* THIRD ROW */}
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-top-border ub-indicator-grid-right-border"
												style={{
													borderBottom: `2px solid ${
														currentCorner === "bottomleft" ? "blue" : "black"
													}`,
													borderLeft: `2px solid ${
														currentCorner === "bottomleft" ? "blue" : "black"
													}`,
												}}
												onClick={() => setCurrentCorner("bottomleft")}
											/>
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-top-border ub-indicator-grid-left-border"
												style={{
													borderBottom: `2px solid ${
														currentCorner === "bottomright" ? "blue" : "black"
													}`,
													borderRight: `2px solid ${
														currentCorner === "bottomright" ? "blue" : "black"
													}`,
												}}
												onClick={() => setCurrentCorner("bottomright")}
											></div>
										</div>
										<div id="ub-button-radius-panel">
											<RangeControl
												label={__("Button Radius")}
												value={
													currentCorner === "topleft"
														? buttons[activeButtonIndex].topLeftRadius
														: currentCorner === "topright"
														? buttons[activeButtonIndex].topRightRadius
														: currentCorner === "bottomleft"
														? buttons[activeButtonIndex].bottomLeftRadius
														: buttons[activeButtonIndex].bottomRightRadius
												}
												onChange={(value) => {
													switch (currentCorner) {
														case "topleft":
															setAttributes({
																buttons: [
																	...buttons.slice(0, activeButtonIndex),
																	Object.assign(
																		{},
																		buttons[activeButtonIndex],
																		{
																			topLeftRadius: value,
																		}
																	),
																	...buttons.slice(activeButtonIndex + 1),
																],
															});
															break;
														case "topright":
															setAttributes({
																buttons: [
																	...buttons.slice(0, activeButtonIndex),
																	Object.assign(
																		{},
																		buttons[activeButtonIndex],
																		{
																			topRightRadius: value,
																		}
																	),
																	...buttons.slice(activeButtonIndex + 1),
																],
															});
															break;
														case "bottomleft":
															setAttributes({
																buttons: [
																	...buttons.slice(0, activeButtonIndex),
																	Object.assign(
																		{},
																		buttons[activeButtonIndex],
																		{
																			bottomLeftRadius: value,
																		}
																	),
																	...buttons.slice(activeButtonIndex + 1),
																],
															});
															break;
														case "bottomright":
															setAttributes({
																buttons: [
																	...buttons.slice(0, activeButtonIndex),
																	Object.assign(
																		{},
																		buttons[activeButtonIndex],
																		{
																			bottomRightRadius: value,
																		}
																	),
																	...buttons.slice(activeButtonIndex + 1),
																],
															});
															break;
														default:
														case "all":
															setAttributes({
																buttons: [
																	...buttons.slice(0, activeButtonIndex),
																	Object.assign(
																		{},
																		buttons[activeButtonIndex],
																		{
																			buttonRadius: value,
																			topLeftRadius: value,
																			topRightRadius: value,
																			bottomLeftRadius: value,
																			bottomRightRadius: value,
																		}
																	),
																	...buttons.slice(activeButtonIndex + 1),
																],
															});
															break;
													}
												}}
												min={1}
												max={100}
												step={
													(currentCorner === "topleft"
														? buttons[activeButtonIndex].topLeftRadiusUnit
														: currentCorner === "topright"
														? buttons[activeButtonIndex].topRightRadiusUnit
														: currentCorner === "bottomleft"
														? buttons[activeButtonIndex].bottomLeftRadiusUnit
														: buttons[activeButtonIndex]
																.bottomRightRadiusUnit) === "em"
														? 0.1
														: 1
												}
											/>
											<ButtonGroup
												aria-label={__("Button Radius Unit", "ultimate-blocks")}
											>
												{["px", "%", "em"].map((b) => (
													<Button
														isLarge
														isPrimary={
															currentCorner === "topleft"
																? buttons[activeButtonIndex]
																		.topLeftRadiusUnit === b
																: currentCorner === "topright"
																? buttons[activeButtonIndex]
																		.topRightRadiusUnit === b
																: currentCorner === "bottomleft"
																? buttons[activeButtonIndex]
																		.bottomLeftRadiusUnit === b
																: buttons[activeButtonIndex]
																		.bottomRightRadiusUnit === b
														}
														aria-pressed={
															currentCorner === "topleft"
																? buttons[activeButtonIndex]
																		.topLeftRadiusUnit === b
																: currentCorner === "topright"
																? buttons[activeButtonIndex]
																		.topRightRadiusUnit === b
																: currentCorner === "bottomleft"
																? buttons[activeButtonIndex]
																		.bottomLeftRadiusUnit === b
																: buttons[activeButtonIndex]
																		.bottomRightRadiusUnit === b
														}
														onClick={() => {
															switch (currentCorner) {
																case "topleft":
																	setAttributes({
																		buttons: [
																			...buttons.slice(0, activeButtonIndex),
																			Object.assign(
																				{},
																				buttons[activeButtonIndex],
																				{
																					topLeftRadiusUnit: b,
																				}
																			),
																			...buttons.slice(activeButtonIndex + 1),
																		],
																	});
																	break;
																case "topright":
																	setAttributes({
																		buttons: [
																			...buttons.slice(0, activeButtonIndex),
																			Object.assign(
																				{},
																				buttons[activeButtonIndex],
																				{
																					topRightRadiusUnit: b,
																				}
																			),
																			...buttons.slice(activeButtonIndex + 1),
																		],
																	});
																	break;
																case "bottomleft":
																	setAttributes({
																		buttons: [
																			...buttons.slice(0, activeButtonIndex),
																			Object.assign(
																				{},
																				buttons[activeButtonIndex],
																				{
																					bottomLeftRadiusUnit: b,
																				}
																			),
																			...buttons.slice(activeButtonIndex + 1),
																		],
																	});
																	break;
																case "bottomright":
																	setAttributes({
																		buttons: [
																			...buttons.slice(0, activeButtonIndex),
																			Object.assign(
																				{},
																				buttons[activeButtonIndex],
																				{
																					bottomRightRadiusUnit: b,
																				}
																			),
																			...buttons.slice(activeButtonIndex + 1),
																		],
																	});
																	break;
																default:
																case "all":
																	setAttributes({
																		buttons: [
																			...buttons.slice(0, activeButtonIndex),
																			Object.assign(
																				{},
																				buttons[activeButtonIndex],
																				{
																					buttonRadiusUnit: b,
																					topLeftRadiusUnit: b,
																					topRightRadiusUnit: b,
																					bottomLeftRadiusUnit: b,
																					bottomRightRadiusUnit: b,
																				}
																			),
																			...buttons.slice(activeButtonIndex + 1),
																		],
																	});
																	break;
															}
														}}
													>
														{b}
													</Button>
												))}
											</ButtonGroup>
										</div>
									</>
								)}
							</PanelBody>
							<PanelBody title={__("Icon", "ultimate-blocks")} initialOpen={false}>
								<div className="ub-button-grid">
									<p>{__("Selected icon", "ultimate-blocks")}</p>
									<div className="ub-button-grid-selector">
										<Dropdown
											position="bottom right"
											renderToggle={({ isOpen, onToggle }) => (
												<Button
													className="ub-button-icon-select"
													icon={
														buttons[activeButtonIndex].chosenIcon !== "" &&
														generateIcon(
															allIcons[
																`fa${dashesToCamelcase(
																	buttons[activeButtonIndex].chosenIcon
																)}`
															],
															35
														)
													}
													label={__(
														"Open icon selection dialog",
														"ultimate-blocks"
													)}
													onClick={onToggle}
													aria-expanded={isOpen}
												/>
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
													{iconSearchTerm === "" && (
														<Button
															className="ub-button-available-icon"
															onClick={() => {
																setAttributes({
																	buttons: [
																		...buttons.slice(0, activeButtonIndex),
																		Object.assign(
																			{},
																			buttons[activeButtonIndex],
																			{
																				chosenIcon: "",
																			}
																		),
																		...buttons.slice(activeButtonIndex + 1),
																	],
																});
																setRecentSelection("");
															}}
														>
															{__("No icon", "ultimate-blocks")}
														</Button>
													)}
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
																{iconSearchResultsPage + 1}/
																{iconListPage.length}
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
																className="ub-button-available-icon"
																icon={generateIcon(i, 35)}
																label={i.iconName}
																onClick={() => {
																	setAttributes({
																		buttons: [
																			...buttons.slice(0, activeButtonIndex),
																			Object.assign(
																				{},
																				buttons[activeButtonIndex],
																				{
																					chosenIcon: i.iconName,
																				}
																			),
																			...buttons.slice(activeButtonIndex + 1),
																		],
																	});
																	setRecentSelection(i.iconName);
																	setSelectionTime(~~(Date.now() / 1000));
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
								</div>
								<RadioControl
									className="ub-button-icon-position"
									label={__("Icon position")}
									selected={buttons[activeButtonIndex].iconPosition}
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
											buttons: [
												...buttons.slice(0, activeButtonIndex),
												Object.assign({}, buttons[activeButtonIndex], {
													iconPosition: pos,
												}),
												...buttons.slice(activeButtonIndex + 1),
											],
										})
									}
								/>
								{buttons[activeButtonIndex].chosenIcon !== "" && (
									<>
										<ToggleControl
											label={__("Change icon size", "ultimate-blocks")}
											checked={buttons[activeButtonIndex].iconSize > 0}
											onChange={(isOn) => {
												let newAttributes = { iconUnit: "px" };

												if (isOn) {
													newAttributes = Object.assign({}, newAttributes, {
														iconSize:
															presetIconSize[buttons[activeButtonIndex].size],
													});
												} else {
													newAttributes = Object.assign({}, newAttributes, {
														iconSize: 0,
													});
												}

												setAttributes({
													buttons: [
														...buttons.slice(0, activeButtonIndex),
														Object.assign(
															{},
															buttons[activeButtonIndex],
															newAttributes
														),
														...buttons.slice(activeButtonIndex + 1),
													],
												});
											}}
										/>
										{buttons[activeButtonIndex].iconSize > 0 && (
											<div id="ub-button-radius-panel">
												<RangeControl
													label={__("Icon size")}
													value={buttons[activeButtonIndex].iconSize}
													step={
														buttons[activeButtonIndex].iconUnit === "em"
															? 0.1
															: 1
													}
													onChange={(value) =>
														setAttributes({
															buttons: [
																...buttons.slice(0, activeButtonIndex),
																Object.assign({}, buttons[activeButtonIndex], {
																	iconSize: value,
																}),
																...buttons.slice(activeButtonIndex + 1),
															],
														})
													}
												/>
												<ButtonGroup
													aria-label={__("Button Size Unit", "ultimate-blocks")}
												>
													{["px", "em"].map((b) => (
														<Button
															isLarge
															isPrimary={
																b === buttons[activeButtonIndex].iconUnit
															}
															aria-pressed={
																b === buttons[activeButtonIndex].iconUnit
															}
															onClick={() =>
																setAttributes({
																	buttons: [
																		...buttons.slice(0, activeButtonIndex),
																		Object.assign(
																			{},
																			buttons[activeButtonIndex],
																			{
																				iconUnit: b,
																			}
																		),
																		...buttons.slice(activeButtonIndex + 1),
																	],
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
					)}
				</InspectorControls>
			}
			{
				<div className={`ub-buttons align-button-${align}`}>
					{buttons.map((b, i) => (
						<div
							className={`ub-button-container${
								b.buttonWidth === "full" ? " ub-button-full-container" : ""
							}`}
						>
							{buttons.length > 1 && (
								<div className="ub-button-delete">
									<span
										title={__("Delete This Button")}
										onClick={() => {
											setActiveButtonIndex(
												activeButtonIndex > i
													? activeButtonIndex - 1
													: Math.min(activeButtonIndex, buttons.length - 2)
											);

											setAttributes({
												buttons: [
													...buttons.slice(0, i),
													...buttons.slice(i + 1),
												],
											});
										}}
										class="dashicons dashicons-dismiss"
									/>
								</div>
							)}
							<div
								className={`ub-button-block-main ub-button-${b.size} ${
									b.buttonWidth === "full"
										? "ub-button-full-width"
										: b.buttonWidth === "flex"
										? `ub-button-flex-${b.size}`
										: ""
								}`}
								onMouseEnter={() => setHoveredButton(i)}
								onMouseLeave={() => setHoveredButton(-1)}
								onClick={() => setActiveButtonIndex(i)}
								style={{
									backgroundColor: b.buttonIsTransparent
										? "transparent"
										: hoveredButton === i
										? b.buttonHoverColor
										: b.buttonColor,
									color:
										hoveredButton === i
											? b.buttonIsTransparent
												? b.buttonHoverColor
												: b.buttonTextHoverColor || "inherit"
											: b.buttonIsTransparent
											? b.buttonColor
											: b.buttonTextColor || "inherit",
									borderRadius: b.buttonRounded
										? [
												...new Set([
													b.topLeftRadius,
													b.topRightRadius,
													b.bottomLeftRadius,
													b.bottomRightRadius,
												]),
										  ].length === 1 &&
										  [
												...new Set([
													b.topLeftRadiusUnit,
													b.topRightRadiusUnit,
													b.bottomLeftRadiusUnit,
													b.bottomRightRadiusUnit,
												]),
										  ].length === 1
											? `${b.buttonRadius || 10}${b.buttonRadiusUnit || "px"}`
											: `${b.topLeftRadius}${b.topLeftRadiusUnit} ${b.topRightRadius}${b.topRightRadiusUnit} ${b.bottomRightRadius}${b.bottomRightRadiusUnit} ${b.bottomLeftRadius}${b.bottomLeftRadiusUnit}`
										: "0",
									borderStyle: b.buttonIsTransparent ? "solid" : "none",
									borderColor: b.buttonIsTransparent
										? hoveredButton === i
											? b.buttonHoverColor
											: b.buttonColor
										: null,
									boxShadow:
										isSelected && activeButtonIndex === i
											? "0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 -10px 8px 0 rgba(0, 0, 0, 0.2)"
											: null,
								}}
							>
								<div
									className="ub-button-content-holder"
									style={{
										flexDirection:
											b.iconPosition === "left" ? "row" : "row-reverse",
									}}
								>
									{b.chosenIcon !== "" &&
										allIcons.hasOwnProperty(
											`fa${dashesToCamelcase(b.chosenIcon)}`
										) && (
											<div className="ub-button-icon-holder">
												{generateIcon(
													allIcons[`fa${dashesToCamelcase(b.chosenIcon)}`],
													b.iconSize || presetIconSize[b.size],
													b.iconUnit || "px"
												)}
											</div>
										)}
									<RichText
										className="ub-button-block-btn"
										placeholder={__("Button Text", "ultimate-blocks")}
										onChange={(value) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, i),
													Object.assign({}, buttons[i], {
														buttonText: value,
													}),
													...buttons.slice(i + 1),
												],
											})
										}
										unstableOnFocus={() => setActiveButtonIndex(i)}
										value={b.buttonText}
										allowedFormats={[
											"core/bold",
											"core/italic",
											"core/strikethrough",
										]}
										keepPlaceholderOnFocus={true}
									/>
								</div>
							</div>
							{activeButtonIndex === i && enableLinkInput && (
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
													value={buttons[i].url}
													onChange={(value) =>
														setAttributes({
															buttons: [
																...buttons.slice(0, i),
																Object.assign({}, buttons[i], {
																	url: value,
																}),
																...buttons.slice(i + 1),
															],
														})
													}
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
											checked={buttons[i].openInNewTab}
											onChange={() =>
												setAttributes({
													buttons: [
														...buttons.slice(0, i),
														Object.assign({}, buttons[i], {
															openInNewTab: !buttons[i].openInNewTab,
														}),
														...buttons.slice(i + 1),
													],
												})
											}
										/>
										<CheckboxControl
											label={__("Add Nofollow to Link", "ultimate-blocks")}
											checked={buttons[i].addNofollow}
											onChange={() =>
												setAttributes({
													buttons: [
														...buttons.slice(0, i),
														Object.assign({}, buttons[i], {
															addNofollow: !buttons[i].addNofollow,
														}),
														...buttons.slice(i + 1),
													],
												})
											}
										/>
										<CheckboxControl
											label={__("Mark link as sponsored", "ultimate-blocks")}
											checked={buttons[i].addSponsored}
											onChange={() =>
												setAttributes({
													buttons: [
														...buttons.slice(0, i),
														Object.assign({}, buttons[i], {
															addSponsored: !buttons[i].addSponsored,
														}),
														...buttons.slice(i + 1),
													],
												})
											}
										/>
									</OutsideAlerter>
								</Popover>
							)}
						</div>
					))}
					<button
						onClick={() => {
							setAttributes({
								buttons: [...buttons, defaultButtonProps],
							});
							setActiveButtonIndex(buttons.length);
						}}
					>
						+
					</button>
				</div>
			}
		</>
	);
}
