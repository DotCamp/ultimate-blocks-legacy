const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
const {
	PanelBody,
	ToggleControl,
	RadioControl,
	TextControl,
	Icon,
	ButtonGroup,
	Button,
	Tooltip,
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
			theme,
			titleColor,
			tabVertical,
			tabletTabDisplay,
			mobileTabDisplay,
			tabsTitle,
			tabsAnchor,
			useAnchors,
		} = attributes;
		return (
			<InspectorControls>
				<PanelColorSettings
					title={__("Tab Colors")}
					initialOpen={true}
					colorSettings={[
						{
							value: theme,
							onChange: (value) => setAttributes({ theme: value }),
							label: __("Active Tab Color"),
						},
						{
							value: titleColor,
							onChange: (value) => setAttributes({ titleColor: value }),
							label: __("Active Tab Title Color"),
						},
					]}
				/>
				<PanelBody title={__("Tab Layout")}>
					<ButtonGroup style={{ paddingBottom: "10px" }}>
						<Tooltip text={__("Desktop")}>
							<Button
								isPrimary={displayMode === "desktop"}
								onClick={(_) => this.setState({ displayMode: "desktop" })}
							>
								<Icon icon="desktop" />
							</Button>
						</Tooltip>
						<Tooltip text={__("Tablet")}>
							<Button
								isPrimary={displayMode === "tablet"}
								onClick={(_) => this.setState({ displayMode: "tablet" })}
							>
								<Icon icon="tablet" />
							</Button>
						</Tooltip>
						<Tooltip text={__("Mobile")}>
							<Button
								isPrimary={displayMode === "mobile"}
								onClick={(_) => this.setState({ displayMode: "mobile" })}
							>
								<Icon icon="smartphone" />
							</Button>
						</Tooltip>
					</ButtonGroup>

					{displayMode === "desktop" && (
						<ToggleControl
							label={__("Vertical", "tabbed-content-blocks")}
							checked={tabVertical}
							onChange={(tabVertical) => setAttributes({ tabVertical })}
						/>
					)}
					{displayMode === "tablet" && (
						<RadioControl
							label={__("Tablet Tab Display")}
							selected={tabletTabDisplay}
							options={["Horizontal tab", "Vertical tab", "Accordion"].map(
								(a) => ({
									label: __(a),
									value: a.toLowerCase().replace(/ /g, ""),
								})
							)}
							onChange={(tabletTabDisplay) =>
								setAttributes({ tabletTabDisplay })
							}
						/>
					)}
					{displayMode === "mobile" && (
						<RadioControl
							label={__("Mobile Tab Display")}
							selected={mobileTabDisplay}
							options={["Horizontal tab", "Vertical tab", "Accordion"].map(
								(a) => ({
									label: __(a),
									value: a.toLowerCase().replace(/ /g, ""),
								})
							)}
							onChange={(mobileTabDisplay) =>
								setAttributes({ mobileTabDisplay })
							}
						/>
					)}
				</PanelBody>
				<PanelBody title={__("Tab Anchors")}>
					<ToggleControl
						label={__("Use tab anchors")}
						checked={useAnchors}
						onChange={(useAnchors) => {
							setAttributes({
								useAnchors,
								tabsAnchor: useAnchors ? Array(tabsTitle.length).fill("") : [],
							});
						}}
					/>
					{useAnchors && (
						<React.Fragment>
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
									"Add an anchor text to let the contents of the active tab be accessed directly through a link"
								)}
							/>
						</React.Fragment>
					)}
				</PanelBody>
			</InspectorControls>
		);
	}
}
