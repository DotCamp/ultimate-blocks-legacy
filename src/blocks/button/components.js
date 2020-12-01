import { Component } from "react";
import { generateIcon, dashesToCamelcase } from "../../common";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

const {
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
	PanelColorSettings,
	URLInput,
	RichText,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	IconButton,
	Button,
	ButtonGroup,
	ToggleControl,
	Dropdown,
	CheckboxControl,
	SelectControl,
	Popover,
	Toolbar,
} = wp.components;
const { __ } = wp.i18n;

export const allIcons = Object.assign(fas, fab);

export const iconSize = { small: 25, medium: 30, large: 35, larger: 40 };

export const blockControls = (props) => {
	const {
		setAttributes,
		attributes: { buttons, align },
	} = props;

	return (
		buttons.length > 0 && (
			<BlockControls>
				<BlockAlignmentToolbar
					value={align}
					onChange={(newAlignment) => setAttributes({ align: newAlignment })}
					controls={["left", "center", "right"]}
				/>
				<Toolbar>
					<IconButton
						icon="admin-links"
						label={__("Add button link")}
						onClick={() => props.setState({ enableLinkInput: true })}
					/>
				</Toolbar>
			</BlockControls>
		)
	);
};

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
		setState,
		availableIcons,
		iconSearchTerm,
		activeButtonIndex,
	} = props;

	return (
		buttons.length > 0 && (
			<InspectorControls>
				<PanelBody title={__("Button Size", "ultimate-blocks")}>
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
				<PanelBody title={__("Button Width", "ultimate-blocks")}>
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
				<PanelBody title={__("Button Link Settings", "ultimate-blocks")}>
					<CheckboxControl
						label={__("Open Link in New Tab", "ultimate-blocks")}
						checked={buttons[activeButtonIndex].openInNewTab}
						onChange={() =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										openInNewTab: !buttons[activeButtonIndex].openInNewTab,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
					<CheckboxControl
						label={__("Add Nofollow to Link", "ultimate-blocks")}
						checked={buttons[activeButtonIndex].addNofollow}
						onChange={() =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										addNofollow: !buttons[activeButtonIndex].addNofollow,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
					<CheckboxControl
						label={__("Mark link as sponsored", "ultimate-blocks")}
						checked={buttons[activeButtonIndex].addSponsored}
						onChange={() =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										addSponsored: !buttons[activeButtonIndex].addSponsored,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</PanelBody>

				<PanelBody title={__("Button Style", "ultimate-blocks")}>
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
					<ToggleControl
						label={__("Transparent", "ultimate-blocks")}
						checked={buttons[activeButtonIndex].buttonIsTransparent}
						onChange={() =>
							setAttributes({
								buttons: [
									...buttons.slice(0, activeButtonIndex),
									Object.assign({}, buttons[activeButtonIndex], {
										buttonIsTransparent: !buttons[activeButtonIndex]
											.buttonIsTransparent,
									}),
									...buttons.slice(activeButtonIndex + 1),
								],
							})
						}
					/>
				</PanelBody>
				<PanelBody title={__("Button Icon", "ultimate-blocks")}>
					<div className="ub-button-grid">
						<p>{__("Selected icon", "ultimate-blocks")}</p>
						<div className="ub-button-grid-selector">
							<Dropdown
								position="bottom right"
								renderToggle={({ isOpen, onToggle }) => (
									<IconButton
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
											onChange={(e) =>
												setState({
													iconSearchTerm: e.target.value,
												})
											}
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
										{availableIcons.length > 0 &&
											availableIcons
												.filter((i) => i.iconName.includes(iconSearchTerm))
												.map((i) => (
													<IconButton
														className="ub-button-available-icon"
														icon={generateIcon(i, 35)}
														label={i.iconName}
														onClick={() =>
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
															})
														}
													/>
												))}
									</div>
								)}
							/>
						</div>
						<p>{__("Icon position", "ultimate-blocks")}</p>
						<SelectControl
							className="ub-button-grid-selector"
							value={buttons[activeButtonIndex].iconPosition}
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
					</div>
				</PanelBody>
				<PanelColorSettings
					title={__("Button Colors", "ultimate-blocks")}
					initialOpen={true}
					colorSettings={
						buttons[activeButtonIndex].buttonIsTransparent
							? [
									{
										value: buttons[activeButtonIndex].buttonColor,
										onChange: (colorValue) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonColor: colorValue,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											}),
										label: __("Button Color", "ultimate-blocks"),
									},
									{
										value: buttons[activeButtonIndex].buttonHoverColor,
										onChange: (colorValue) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonHoverColor: colorValue,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											}),
										label: __("Button Color on Hover", "ultimate-blocks"),
									},
							  ]
							: [
									{
										value: buttons[activeButtonIndex].buttonColor,
										onChange: (colorValue) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonColor: colorValue,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											}),
										label: __("Button Background", "ultimate-blocks"),
									},
									{
										value: buttons[activeButtonIndex].buttonTextColor,
										onChange: (colorValue) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonTextColor: colorValue,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											}),
										label: __("Button Text Color", "ultimate-blocks"),
									},
									{
										value: buttons[activeButtonIndex].buttonHoverColor,
										onChange: (colorValue) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonHoverColor: colorValue,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											}),
										label: __("Button Background on Hover", "ultimate-blocks"),
									},
									{
										value: buttons[activeButtonIndex].buttonTextHoverColor,
										onChange: (colorValue) =>
											setAttributes({
												buttons: [
													...buttons.slice(0, activeButtonIndex),
													Object.assign({}, buttons[activeButtonIndex], {
														buttonTextHoverColor: colorValue,
													}),
													...buttons.slice(activeButtonIndex + 1),
												],
											}),
										label: __("Button Text Color on Hover", "ultimate-blocks"),
									},
							  ]
					}
				/>
			</InspectorControls>
		)
	);
};

class URLInputBox extends Component {
	//adapted from Ben Bud, https://stackoverflow.com/a/42234988
	constructor(props) {
		super(props);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
		this.props.showLinkInput();
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	handleClickOutside(event) {
		const clickedElement = event.target;
		if (
			this.wrapperRef &&
			!this.wrapperRef.contains(clickedElement) &&
			!(
				clickedElement.classList.contains(
					"block-editor-url-input__suggestion"
				) ||
				clickedElement.classList.contains("block-editor-url-input__suggestions")
			)
		) {
			this.props.hideLinkInput();
		}
	}

	render() {
		const { attributes, setAttributes, index } = this.props;
		const { buttons } = attributes;

		return (
			<div>
				<Popover className="ub_popover" position="bottom">
					<div
						className="ub_button_popover"
						ref={(node) => (this.wrapperRef = node)}
					>
						<div className="ub_button_url_input">
							<form
								onSubmit={(event) => event.preventDefault()}
								className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
							>
								<URLInput
									autoFocus={false}
									className="button-url"
									value={buttons[index].url}
									onChange={(value) =>
										setAttributes({
											buttons: [
												...buttons.slice(0, index),
												Object.assign({}, buttons[index], {
													url: value,
												}),
												...buttons.slice(index + 1),
											],
										})
									}
								/>
								<IconButton
									icon={"editor-break"}
									label={__("Apply", "ultimate-blocks")}
									type={"submit"}
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
					</div>
				</Popover>
			</div>
		);
	}
}

export const editorDisplay = (props) => {
	const {
		enableLinkInput,
		setState,
		setAttributes,
		attributes: { buttons, align },
		hoveredButton,
		activeButtonIndex,
	} = props;

	const defaultButtonProps = {
		buttonText: "Button Text",
		url: "",
		size: "medium",
		buttonColor: "#313131",
		buttonHoverColor: "#313131",
		buttonTextColor: "#ffffff",
		buttonTextHoverColor: "#ffffff",
		buttonRounded: false,
		chosenIcon: "",
		iconPosition: "left",
		buttonIsTransparent: false,
		addNofollow: true,
		openInNewTab: true,
		addSponsored: false,
		buttonWidth: "fixed",
	};

	return (
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
									setState({
										activeButtonIndex:
											activeButtonIndex > i
												? activeButtonIndex - 1
												: Math.min(activeButtonIndex, buttons.length - 2),
									});
									setAttributes({
										buttons: [...buttons.slice(0, i), ...buttons.slice(i + 1)],
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
						onMouseEnter={() => setState({ hoveredButton: i })}
						onMouseLeave={() => setState({ hoveredButton: -1 })}
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
										: b.buttonTextHoverColor
									: b.buttonIsTransparent
									? b.buttonColor
									: b.buttonTextColor,
							borderRadius: b.buttonRounded ? "60px" : "0px",
							borderStyle: b.buttonIsTransparent ? "solid" : "none",
							borderColor: b.buttonIsTransparent
								? hoveredButton === i
									? b.buttonHoverColor
									: b.buttonColor
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
											iconSize[b.size]
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
								unstableOnFocus={() => setState({ activeButtonIndex: i })}
								value={b.buttonText}
								formattingControls={["bold", "italic", "strikethrough"]}
								keepPlaceholderOnFocus={true}
							/>
						</div>
					</div>
					{activeButtonIndex === i && enableLinkInput && (
						<URLInputBox
							{...props}
							index={i}
							hideLinkInput={() => setState({ enableLinkInput: false })}
							showLinkInput={() => setState({ enableLinkInput: true })}
						/>
					)}
				</div>
			))}
			<button
				onClick={() =>
					setAttributes({ buttons: [...buttons, defaultButtonProps] })
				}
			>
				+
			</button>
		</div>
	);
};
