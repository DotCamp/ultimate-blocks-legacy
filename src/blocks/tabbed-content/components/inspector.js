const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
const { PanelBody, ToggleControl } = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		const { attributes, setAttributes } = this.props;
		const { theme, titleColor, tabVertical } = attributes;
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
				<PanelBody title={__('Tab View')}>
					<ToggleControl
						label={__('Vertical', 'tabbed-content-blocks')}
						checked={tabVertical}
						onChange={tabVertical => setAttributes({ tabVertical })}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
