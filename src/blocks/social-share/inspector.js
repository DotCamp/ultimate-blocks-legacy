/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
} = wp.blocks;
const {
	PanelBody,
	PanelRow,
	RadioControl,
	FormToggle,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		return (
			<InspectorControls>
				<PanelBody title={ __( 'Size' ) } initialOpen={ false }>
					<RadioControl
						label="Select Size"
						selected={ this.props.attributes.iconSize }
						options={ [
							{ label: 'Normal', value: 'normal' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
						] }
						onChange={ this.props.onSizeChange }

					/>
				</PanelBody>
				<PanelBody title={ __( 'Shape' ) } initialOpen={ false }>
					<RadioControl
						label="Select Shape"
						selected={ this.props.attributes.iconShape }
						options={ [
							{ label: 'Circle', value: 'circle' },
							{ label: 'Square', value: 'square' },
						] }
						onChange={ this.props.onShapeChange }

					/>
				</PanelBody>
				<PanelBody title={ __( 'Visibility' ) } initialOpen={ false }>
					<PanelRow>
						<label
							htmlFor="facebook-icon-form-toggle"
						>
							<b>{ __( 'Facebook' ) }</b>
						</label>
						<FormToggle
							id="facebook-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showFacebookIcon }
							onChange={ this.props.toggleFacebookIcon }
						/>
					</PanelRow>
					<PanelRow>
						<label
							htmlFor="twitter-icon-form-toggle"
						>
							<b>{ __( 'Twitter' ) }</b>
						</label>
						<FormToggle
							id="twitter-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showTwitterIcon }
							onChange={ this.props.toggleTwitterIcon }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}
}
