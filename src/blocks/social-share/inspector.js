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
			showTumblrIcon,
			iconOrder
		} = attributes;
		return (
			<InspectorControls>
				<PanelBody title={__("Size")} initialOpen={false}>
					<RadioControl
						label="Select Size"
						selected={iconSize}
						options={[
							{ label: "Normal", value: "normal" },
							{ label: "Medium", value: "medium" },
							{ label: "Large", value: "large" }
						]}
						onChange={value => setAttributes({ iconSize: value })}
					/>
				</PanelBody>
				<PanelBody title={__("Shape")} initialOpen={false}>
					<RadioControl
						label="Select Shape"
						selected={iconShape}
						options={[
							{ label: "Circle", value: "circle" },
							{ label: "Square", value: "square" }
						]}
						onChange={value => setAttributes({ iconShape: value })}
					/>
				</PanelBody>
				<PanelBody title={__("Visibility")} initialOpen={false}>
					<PanelRow>
						<label htmlFor="facebook-icon-form-toggle">
							<b>{__("Facebook")}</b>
						</label>
						<FormToggle
							id="facebook-icon-form-toggle"
							label={__("Visible")}
							checked={showFacebookIcon}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("facebook");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1)
											  ]
											: [...iconOrder, "facebook"],
									showFacebookIcon: !showFacebookIcon
								});
							}}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="twitter-icon-form-toggle">
							<b>{__("Twitter")}</b>
						</label>
						<FormToggle
							id="twitter-icon-form-toggle"
							label={__("Visible")}
							checked={showTwitterIcon}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("twitter");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1)
											  ]
											: [...iconOrder, "twitter"],
									showTwitterIcon: !showTwitterIcon
								});
							}}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="linkedin-icon-form-toggle">
							<b>{__("LinkedIn")}</b>
						</label>
						<FormToggle
							id="linkedin-icon-form-toggle"
							label={__("Visible")}
							checked={showLinkedInIcon}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("linkedin");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1)
											  ]
											: [...iconOrder, "linkedin"],
									showLinkedInIcon: !showLinkedInIcon
								});
							}}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="pinterest-icon-form-toggle">
							<b>{__("Pinterest")}</b>
						</label>
						<FormToggle
							id="pinterest-icon-form-toggle"
							label={__("Visible")}
							checked={showPinterestIcon}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("pinterest");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1)
											  ]
											: [...iconOrder, "pinterest"],
									showPinterestIcon: !showPinterestIcon
								});
							}}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="reddit-icon-form-toggle">
							<b>{__("Reddit")}</b>
						</label>
						<FormToggle
							id="reddit-icon-form-toggle"
							label={__("Visible")}
							checked={showRedditIcon}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("reddit");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1)
											  ]
											: [...iconOrder, "reddit"],
									showRedditIcon: !showRedditIcon
								});
							}}
						/>
					</PanelRow>
					<PanelRow>
						<label htmlFor="tumblr-icon-form-toggle">
							<b>{__("Tumblr")}</b>
						</label>
						<FormToggle
							id="tumblr-icon-form-toggle"
							label={__("Visible")}
							checked={showTumblrIcon}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("tumblr");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1)
											  ]
											: [...iconOrder, "tumblr"],
									showTumblrIcon: !showTumblrIcon
								});
							}}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		);
	}
}
