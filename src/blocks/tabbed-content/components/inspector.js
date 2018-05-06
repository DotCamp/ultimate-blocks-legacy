const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
	ColorPalette,
} = wp.blocks;
const {
	PanelColor,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		return (
			<InspectorControls>
				<PanelColor
					title={ __('Color Scheme' ) }
					colorValue={ this.props.attributes.theme }
					initialOpen={ false }
				>
					<ColorPalette
						value={ this.props.attributes.theme }
						onChange={ this.props.onThemeChange }
						allowReset
					/>
				</PanelColor>
			</InspectorControls>
		);
	}
}
