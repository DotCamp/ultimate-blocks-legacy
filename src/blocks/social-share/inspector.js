/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	InspectorControls,
} = wp.editor;
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
					<PanelRow>
						<label
							htmlFor="linkedin-icon-form-toggle"
						>
							<b>{ __( 'LinkedIn' ) }</b>
						</label>
						<FormToggle
							id="linkedin-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showLinkedInIcon }
							onChange={ this.props.toggleLinkedInIcon }
						/>
					</PanelRow>
					<PanelRow>
						<label
							htmlFor="pinterest-icon-form-toggle"
						>
							<b>{ __( 'Pinterest' ) }</b>
						</label>
						<FormToggle
							id="pinterest-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showPinterestIcon }
							onChange={ this.props.togglePinterestIcon }
						/>
					</PanelRow>
					<PanelRow>
						<label
							htmlFor="reddit-icon-form-toggle"
						>
							<b>{ __( 'Reddit' ) }</b>
						</label>
						<FormToggle
							id="reddit-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showRedditIcon }
							onChange={ this.props.toggleRedditIcon }
						/>
					</PanelRow>
					<PanelRow>
						<label
							htmlFor="googleplus-icon-form-toggle"
						>
							<b>{ __( 'GooglePlus' ) }</b>
						</label>
						<FormToggle
							id="googleplus-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showGooglePlusIcon }
							onChange={ this.props.toggleGooglePlusIcon }
						/>
					</PanelRow>
					<PanelRow>
						<label
							htmlFor="tumblr-icon-form-toggle"
						>
							<b>{ __( 'Tumblr' ) }</b>
						</label>
						<FormToggle
							id="tumblr-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showTumblrIcon }
							onChange={ this.props.toggleTumblrIcon }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}
}
