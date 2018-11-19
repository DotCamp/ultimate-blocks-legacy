const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;


/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		return (
			<InspectorControls>
				<PanelColorSettings
					title={__('Tab Colors')}
					initialOpen={true}
					colorSettings={[
						{
							value: this.props.attributes.theme,
							onChange: this.props.onThemeChange,
							label:__('Active Tab Color')
						},
						{
							value: this.props.attributes.titleColor,
							onChange: this.props.onTitleColorChange,
							label:__('Active Tab Title Color')
						},	
					]}
				/>
			</InspectorControls>
		);
	}
}
