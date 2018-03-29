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
	PanelColor,
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
						label="Icon Sizes"
						selected={ this.props.attributes.iconSize }
						options={ [
							{ label: 'Normal', value: 'normal' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
						] }
						onChange={ this.props.onSizeChange }

					/>
				</PanelBody>
				<PanelBody title={ __( 'Facebook' ) } initialOpen={ false }>
					<PanelColor
						title={ __( 'Background Color' ) }
						colorValue={ this.props.attributes.facebookIconBgColor }
						initialOpen={ false }
					>
						<ColorPalette
							colors={ [ '#0000ff' ] }
							value={ this.props.attributes.facebookIconBgColor }
							onChange={ this.props.onChangeFacebookIconBgColor }
						/>
					</PanelColor>
					<PanelColor
						title={ __( 'Text Color' ) }
						colorValue={ this.props.attributes.facebookIconTextColor }
						initialOpen={ false }
					>
						<ColorPalette
							colors={ [ '#ffffff' ] }
							value={ this.props.attributes.facebookIconTextColor }
							onChange={ this.props.onChangeFacebookIconTextColor }
						/>
					</PanelColor>
					<PanelRow>
						<label
							htmlFor="facebook-icon-form-toggle"
						>
							<b>{ __( 'Visibility' ) }</b>
						</label>
						<FormToggle
							id="facebook-icon-form-toggle"
							label={ __( 'Visible' ) }
							checked={ !! this.props.attributes.showFacebookIcon }
							onChange={ this.props.toggleFacebookIcon }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __( 'Twitter' ) } initialOpen={ false }>
					<PanelColor
						title={ __( 'Background Color' ) }
						colorValue={ this.props.attributes.twitterIconBgColor }
						initialOpen={ false }
					>
						<ColorPalette
							colors={ [ '#0000ff' ] }
							value={ this.props.attributes.twitterIconBgColor }
							onChange={ this.props.onChangeTwitterIconBgColor }
						/>
					</PanelColor>
					<PanelColor
						title={ __( 'Text Color' ) }
						colorValue={ this.props.attributes.twitterIconTextColor }
						initialOpen={ false }
					>
						<ColorPalette
							colors={ [ '#0000ff' ] }
							value={ this.props.attributes.twitterIconTextColor }
							onChange={ this.props.onChangeTwitterIconTextColor }
						/>
					</PanelColor>
					<PanelRow>
						<label
							htmlFor="twitter-icon-form-toggle"
						>
							<b>{ __( 'Visibility' ) }</b>
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
