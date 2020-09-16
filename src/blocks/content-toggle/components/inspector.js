/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
const { PanelBody, PanelRow, FormToggle } = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		const {
			onThemeChange,
			onTitleColorChange,
			onCollapseChange,
			onLinkColorChange,
		} = this.props;
		const { theme, titleColor, titleLinkColor, collapsed } = this.props.attributes;
		return (
			<InspectorControls>
				<PanelColorSettings
					title={__("Color Scheme")}
					initialOpen={false}
					colorSettings={[
						{
							value: theme,
							onChange: onThemeChange,
							label: __("Container Color"),
						},
						{
							value: titleColor,
							onChange: onTitleColorChange,
							label: __("Title Color"),
						},
						{
							value: titleLinkColor,
							onChange: onLinkColorChange,
							label: __("Title link Color"),
						},
					]}
				/>
				<PanelBody title={__("Initial State")} initialOpen={true}>
					<PanelRow>
						<label htmlFor="ub-content-toggle-state">{__("Collapsed")}</label>
						<FormToggle
							id="ub-content-toggle-state"
							label={__("Collapsed")}
							checked={collapsed}
							onChange={onCollapseChange}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}
}
