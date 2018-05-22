const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
	ColorPalette,
} = wp.editor;
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
					title={ __('Active Tab Color' ) }
					colorValue={ this.props.attributes.theme }
					initialOpen={ true }
				>
					<ColorPalette
						value={ this.props.attributes.theme }
						onChange={ this.props.onThemeChange }
						allowReset
					/>
				</PanelColor>
				<PanelColor
					title={ __('Active Tab Title Color' ) }
					colorValue={ this.props.attributes.titleColor }
					initialOpen={ true }
				>
					<ColorPalette
						value={ this.props.attributes.titleColor }
						onChange={ this.props.onTitleColorChange }
						allowReset
					/>
				</PanelColor>
			</InspectorControls>
		);
	}
}
