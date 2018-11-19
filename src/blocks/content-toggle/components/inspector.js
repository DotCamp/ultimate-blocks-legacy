/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;
const {
	PanelBody,
	PanelRow,
	FormToggle,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		return (
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Scheme' ) }
					initialOpen={ false }
					colorSettings = {[
						{
							value: this.props.attributes.theme,
							onChange: this.props.onThemeChange,
							label: __('Container Color')
						},
						{
							value: this.props.attributes.titleColor,
							onChange: this.props.onTitleColorChange,
							label: __('Title Color')
						}
					]}
				/>
				<PanelBody title={ __( 'Initial State' ) } initialOpen={ true }>
					<PanelRow>
                        <label htmlFor="ub-content-toggle-state">
							{ __( 'Collapsed' ) }
						</label>
						<FormToggle
							id="ub-content-toggle-state"
							label={ __( 'Collapsed' ) }
							checked={ this.props.attributes.collapsed }
							onChange={ this.props.onCollapseChange }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}
}
