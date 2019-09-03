const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		const { attributes, setAttributes } = this.props;
		const { theme, titleColor } = attributes;
		return (
			<InspectorControls>
				<PanelColorSettings
					title={__('Tab Colors')}
					initialOpen={true}
					colorSettings={[
						{
							value: theme,
							onChange: value => setAttributes({ theme: value }),
							label: __('Active Tab Color')
						},
						{
							value: titleColor,
							onChange: value =>
								setAttributes({ titleColor: value }),
							label: __('Active Tab Title Color')
						}
					]}
				/>
			</InspectorControls>
		);
	}
}
