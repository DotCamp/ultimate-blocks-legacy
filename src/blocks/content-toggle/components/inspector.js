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
				<PanelBody title={ __( 'Theme' ) } initialOpen={ true }>
					<PanelRow>
						<ColorPalette
							value={ this.props.attributes.theme }
							onChange={ this.props.onThemeChange }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __( 'State' ) } initialOpen={ true }>
					<PanelRow>
						<FormToggle
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
