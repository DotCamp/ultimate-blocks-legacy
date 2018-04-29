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
    PanelColor,
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
                <PanelColor
                    title={ __( 'Color Scheme' ) }
                    colorValue={ this.props.attributes.theme }
                    initialOpen={ false }
                >
                    <ColorPalette
                        value={ this.props.attributes.theme }
                        onChange={ this.props.onThemeChange }
                        allowReset
                    />
				</PanelColor>
				<PanelColor
                    title={ __( 'Title Color' ) }
                    colorValue={ this.props.attributes.titleColor }
                    initialOpen={ false }
                >
                    <ColorPalette
                        value={ this.props.attributes.titleColor }
                        onChange={ this.props.onTitleColorChange }
                        allowReset
                    />
                </PanelColor>
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
