const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
const { PanelBody, ToggleControl, RadioControl } = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		const { attributes, setAttributes } = this.props;
		const {
			theme,
			titleColor,
			tabVertical,
			tabletTabDisplay,
			mobileTabDisplay,
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
					<ToggleControl
						label={__("Vertical", "tabbed-content-blocks")}
						checked={tabVertical}
						onChange={(tabVertical) => setAttributes({ tabVertical })}
					/>
					<RadioControl
						label={__("Tablet Tab Display")}
						selected={tabletTabDisplay}
						options={["Horizontal tab", "Vertical tab", "Accordion"].map(
							(a) => ({
								label: __(a),
								value: a.toLowerCase().replace(/ /g, ""),
							})
						)}
						onChange={(tabletTabDisplay) => setAttributes({ tabletTabDisplay })}
					/>
					<RadioControl
						label={__("Mobile Tab Display")}
						selected={mobileTabDisplay}
						options={["Horizontal tab", "Vertical tab", "Accordion"].map(
							(a) => ({
								label: __(a),
								value: a.toLowerCase().replace(/ /g, ""),
							})
						)}
						onChange={(mobileTabDisplay) => setAttributes({ mobileTabDisplay })}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
