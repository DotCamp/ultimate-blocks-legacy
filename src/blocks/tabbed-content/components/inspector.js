const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;

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
							onChange: value =>
								this.props.setAttributes({ theme: value }),
							label: __('Active Tab Color')
						},
						{
							value: this.props.attributes.titleColor,
							onChange: value =>
								this.props.setAttributes({ titleColor: value }),
							label: __('Active Tab Title Color')
						}
					]}
				/>
			</InspectorControls>
		);
	}
}
