/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
	ColorPalette,
} = wp.blocks;
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
				<PanelBody title={ __( 'Color Scheme' ) } initialOpen={ true }>
					<PanelRow>
						<ColorPalette
							value={ this.props.attributes.theme }
							onChange={ this.props.onThemeChange }
						/>
					</PanelRow>
				</PanelBody>
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
