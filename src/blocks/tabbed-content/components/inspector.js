import {
	horizontalTabIcon,
	verticalTabIcon,
	accordionIcon,
} from "../icons/icon";
import SavedStylesInspector from "$Inc/components/SavedStyles/SavedStylesInspector";
import { ColorSettings, SpacingControl } from "../../components";
const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const {
	PanelBody,
	PanelRow,
	ToggleControl,
	RadioControl,
	TextControl,
	ButtonGroup,
	Button,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	constructor(props) {
		super(props);
		this.state = { displayMode: "desktop" };
	}
	render() {
		const { displayMode } = this.state;
		const { attributes, setAttributes } = this.props;
		const {
			activeTab,
			tabVertical,
			tabletTabDisplay,
			mobileTabDisplay,
			tabsTitle,
			tabsAnchor,
			useAnchors,
			tabStyle,
		} = attributes;

		return (
			<>
				<InspectorControls group="settings">
					<PanelBody title={__("Tab Type")}>
						<RadioControl
							selected={tabStyle}
							options={["tabs", "pills", "underline"].map((a) => ({
								label: __(a),
								value: a,
							}))}
							onChange={(tabStyle) => setAttributes({ tabStyle })}
						/>
					</PanelBody>

					<PanelBody title={__("Tab Anchors")} initialOpen={false}>
						<ToggleControl
							label={__("Use tab anchors")}
							checked={useAnchors}
							onChange={(useAnchors) => {
								setAttributes({
									useAnchors,
									tabsAnchor: useAnchors
										? Array(tabsTitle.length).fill("")
										: [],
								});
							}}
						/>
						{useAnchors && (
							<TextControl
								label={__("Anchor for current tab")}
								value={tabsAnchor[activeTab]}
								onChange={(newAnchor) =>
									setAttributes({
										tabsAnchor: [
											...tabsAnchor.slice(0, activeTab),
											newAnchor.replace(/\s/g, ""),
											...tabsAnchor.slice(activeTab + 1),
										],
									})
								}
								help={__(
									"Add an anchor text to let the contents of the active tab be accessed directly through a link",
								)}
							/>
						)}
					</PanelBody>
				</InspectorControls>
				<InspectorControls group="styles">
					<SavedStylesInspector
						attributes={(() => {
							/* eslint-disable no-unused-vars */
							const {
								blockID,
								// eslint-disable-next-line no-shadow
								activeTab,
								id,
								activeControl,
								// eslint-disable-next-line no-shadow
								tabsTitle,
								tabsTitleAlignment,
								...rest
							} = attributes;
							/* eslint-enable no-unused-vars */

							return rest;
						})()}
						setAttribute={(val) => {
							// back-compat for any styles generated before fix
							const { tabsTitle, tabsTitleAlignment, ...rest } = val;

							setAttributes(rest);
						}}
						previewAttributeCallback={(attr) => attr}
						previewElementCallback={(el) => {
							const isVertical = el.querySelector(".vertical-holder");

							if (!isVertical) {
								const horizontalTabs = Array.from(
									el.querySelectorAll(
										".wp-block-ub-tabbed-content-tabs-title .wp-block-ub-tabbed-content-tab-title-wrap",
									),
								);

								if (horizontalTabs.length > 0) {
									const tabAddButton = horizontalTabs.pop();
									tabAddButton.parentNode.removeChild(tabAddButton);
								}
							} else {
								const verticalTabs = Array.from(
									el.querySelectorAll(
										".wp-block-ub-tabbed-content-tabs-title-vertical-tab .wp-block-ub-tabbed-content-tab-title-vertical-wrap",
									),
								);

								if (verticalTabs.length > 0) {
									const verticalTabAddButton = verticalTabs.pop();
									verticalTabAddButton.parentNode.removeChild(
										verticalTabAddButton,
									);
								}

								const verticalTabHolder = el.querySelector(
									".vertical-tab-width",
								);

								if (verticalTabHolder) {
									verticalTabHolder.style.width = "fit-content";
								}
							}

							const tabContentContainer = el.querySelector(
								".block-editor-inner-blocks",
							);

							if (tabContentContainer) {
								tabContentContainer.innerHTML = `<p>${__(
									"Tab Content",
									"ultimate-blocks-pro",
								)}</p>`;
							}

							return el;
						}}
					/>
					<PanelBody title={__("Tab Layout")} initialOpen={false}>
						<PanelRow>
							<label>{__("Mode")}</label>
							<ButtonGroup style={{ paddingBottom: "10px" }}>
								<Button
									icon="desktop"
									showTooltip={true}
									label={__("Desktop")}
									isPressed={displayMode === "desktop"}
									onClick={() =>
										this.setState({
											displayMode: "desktop",
										})
									}
								/>
								<Button
									icon="tablet"
									showTooltip={true}
									label={__("Tablet")}
									isPressed={displayMode === "tablet"}
									onClick={() => this.setState({ displayMode: "tablet" })}
								/>
								<Button
									icon="smartphone"
									showTooltip={true}
									label={__("Mobile")}
									isPressed={displayMode === "mobile"}
									onClick={() => this.setState({ displayMode: "mobile" })}
								/>
							</ButtonGroup>
						</PanelRow>
						{displayMode === "desktop" && (
							<PanelRow>
								<label>{__("Tab Display")}</label>
								<ButtonGroup>
									<Button
										icon={horizontalTabIcon}
										showTooltip={true}
										label={__("Horizontal")}
										isPressed={!tabVertical}
										onClick={() =>
											setAttributes({
												tabVertical: false,
											})
										}
									/>
									<Button
										icon={verticalTabIcon}
										showTooltip={true}
										label={__("Vertical")}
										isPressed={tabVertical}
										onClick={() => setAttributes({ tabVertical: true })}
									/>
								</ButtonGroup>
							</PanelRow>
						)}
						{displayMode === "tablet" && (
							<PanelRow>
								<label>{__("Tablet Tab Display")}</label>
								<ButtonGroup>
									<Button
										icon={horizontalTabIcon}
										showTooltip={true}
										label={__("Horizontal")}
										isPressed={tabletTabDisplay === "horizontaltab"}
										onClick={() =>
											setAttributes({
												tabletTabDisplay: "horizontaltab",
											})
										}
									/>
									<Button
										icon={verticalTabIcon}
										showTooltip={true}
										label={__("Vertical")}
										isPressed={tabletTabDisplay === "verticaltab"}
										onClick={() =>
											setAttributes({
												tabletTabDisplay: "verticaltab",
											})
										}
									/>
									<Button
										icon={accordionIcon}
										showTooltip={true}
										label={__("Accordion")}
										isPressed={tabletTabDisplay === "accordion"}
										onClick={() =>
											setAttributes({
												tabletTabDisplay: "accordion",
											})
										}
									/>
								</ButtonGroup>
							</PanelRow>
						)}
						{displayMode === "mobile" && (
							<PanelRow>
								<label>{__("Mobile Tab Display")}</label>
								<ButtonGroup>
									<Button
										icon={horizontalTabIcon}
										showTooltip={true}
										label={__("Horizontal")}
										isPressed={mobileTabDisplay === "horizontaltab"}
										onClick={() =>
											setAttributes({
												mobileTabDisplay: "horizontaltab",
											})
										}
									/>
									<Button
										icon={verticalTabIcon}
										showTooltip={true}
										label={__("Vertical")}
										isPressed={mobileTabDisplay === "verticaltab"}
										onClick={() =>
											setAttributes({
												mobileTabDisplay: "verticaltab",
											})
										}
									/>
									<Button
										icon={accordionIcon}
										showTooltip={true}
										label={__("Accordion")}
										isPressed={mobileTabDisplay === "accordion"}
										onClick={() =>
											setAttributes({
												mobileTabDisplay: "accordion",
											})
										}
									/>
								</ButtonGroup>
							</PanelRow>
						)}
					</PanelBody>
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
					{!(
						tabStyle === "underline" &&
						![tabletTabDisplay, mobileTabDisplay].includes("accordion")
					) && (
						<>
							<ColorSettings
								attrKey="normalColor"
								label={__("Tab Color", "ultimate-blocks")}
							/>
							<ColorSettings
								attrKey="theme"
								label={__("Active Tab Color", "ultimate-blocks")}
							/>
						</>
					)}
					<ColorSettings
						attrKey="normalTitleColor"
						label={__("Tab Title Color", "ultimate-blocks")}
					/>
					<ColorSettings
						attrKey="titleColor"
						label={__("Active Tab Title Color", "ultimate-blocks")}
					/>
					<ColorSettings
						attrKey="contentColor"
						label={__("Content Color", "ultimate-blocks")}
					/>
					<ColorSettings
						attrKey="contentBackground"
						label={__("Content Background", "ultimate-blocks")}
					/>
				</InspectorControls>
			</>
		);
	}
}
