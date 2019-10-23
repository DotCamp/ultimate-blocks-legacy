/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, PanelRow, RadioControl, FormToggle } = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		const { attributes, setAttributes } = this.props;
		const {
			iconShape,
			iconSize,
			showFacebookIcon,
			showTwitterIcon,
			showLinkedInIcon,
			showPinterestIcon,
			showRedditIcon,
			showGooglePlusIcon,
			showTumblrIcon
		} = attributes;
		return (
			<InspectorControls>
				<PanelBody title={__('Size')} initialOpen={false}>
					<RadioControl
						label="Select Size"
						selected={iconSize}
						options={[
							{ label: 'Normal', value: 'normal' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' }
						]}
						onChange={value => setAttributes({ iconSize: value })}
					/>
				</PanelBody>
				<PanelBody title={__('Shape')} initialOpen={false}>
					<RadioControl
						label="Select Shape"
						selected={iconShape}
						options={[
							{ label: 'Circle', value: 'circle' },
							{ label: 'Square', value: 'square' }
						]}
						onChange={value => setAttributes({ iconShape: value })}
					/>
				</PanelBody>
				<PanelBody title={__('Visibility')} initialOpen={false}>
					<PanelRow>
						<label htmlFor="facebook-icon-form-toggle">
							<b>{__('Facebook')}</b>
						</label>
						<FormToggle
							id="facebook-icon-form-toggle"
							label={__('Visible')}
							checked={showFacebookIcon}
							onChange={() =>
								setAttributes({
									showFacebookIcon: !showFacebookIcon
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="twitter-icon-form-toggle">
							<b>{__('Twitter')}</b>
						</label>
						<FormToggle
							id="twitter-icon-form-toggle"
							label={__('Visible')}
							checked={showTwitterIcon}
							onChange={() =>
								setAttributes({
									showTwitterIcon: !showTwitterIcon
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="linkedin-icon-form-toggle">
							<b>{__('LinkedIn')}</b>
						</label>
						<FormToggle
							id="linkedin-icon-form-toggle"
							label={__('Visible')}
							checked={showLinkedInIcon}
							onChange={() =>
								setAttributes({
									showLinkedInIcon: !showLinkedInIcon
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="pinterest-icon-form-toggle">
							<b>{__('Pinterest')}</b>
						</label>
						<FormToggle
							id="pinterest-icon-form-toggle"
							label={__('Visible')}
							checked={showPinterestIcon}
							onChange={() =>
								setAttributes({
									showPinterestIcon: !showPinterestIcon
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="reddit-icon-form-toggle">
							<b>{__('Reddit')}</b>
						</label>
						<FormToggle
							id="reddit-icon-form-toggle"
							label={__('Visible')}
							checked={showRedditIcon}
							onChange={() =>
								setAttributes({
									showRedditIcon: !showRedditIcon
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="googleplus-icon-form-toggle">
							<b>{__('GooglePlus')}</b>
						</label>
						<FormToggle
							id="googleplus-icon-form-toggle"
							label={__('Visible')}
							checked={showGooglePlusIcon}
							onChange={() =>
								setAttributes({
									showGooglePlusIcon: !showGooglePlusIcon
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="tumblr-icon-form-toggle">
							<b>{__('Tumblr')}</b>
						</label>
						<FormToggle
							id="tumblr-icon-form-toggle"
							label={__('Visible')}
							checked={showTumblrIcon}
							onChange={() =>
								setAttributes({
									showTumblrIcon: !showTumblrIcon
								})
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}
}
