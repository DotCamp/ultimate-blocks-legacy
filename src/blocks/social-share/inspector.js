/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { InspectorControls, ColorPalette } = wp.blockEditor || wp.editor;
const {
	PanelBody,
	PanelRow,
	RadioControl,
	FormToggle,
	ToggleControl,
	TextControl,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	render() {
		const { attributes, setAttributes } = this.props;
		const {
			iconShape,
			iconSize,
			iconOrder,
			buttonColor,
			useCaptions,
			addOutline,
			facebookCaption,
			twitterCaption,
			linkedInCaption,
			pinterestCaption,
			redditCaption,
			tumblrCaption,
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
							{ label: "Large", value: "large" },
						]}
						onChange={(value) => setAttributes({ iconSize: value })}
					/>
				</PanelBody>
				<PanelBody title={__("Shape")} initialOpen={false}>
					<RadioControl
						label="Select Shape"
						selected={iconShape}
						options={[
							{ label: "Circle", value: "circle" },
							{ label: "Square", value: "square" },
							{ label: "None", value: "none" },
						]}
						onChange={(value) => setAttributes({ iconShape: value })}
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
							checked={iconOrder.indexOf("facebook") > -1}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("facebook");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1),
											  ]
											: [...iconOrder, "facebook"],
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
							checked={iconOrder.indexOf("twitter") > -1}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("twitter");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1),
											  ]
											: [...iconOrder, "twitter"],
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
							checked={iconOrder.indexOf("linkedin") > -1}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("linkedin");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1),
											  ]
											: [...iconOrder, "linkedin"],
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
							checked={iconOrder.indexOf("pinterest") > -1}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("pinterest");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1),
											  ]
											: [...iconOrder, "pinterest"],
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
							checked={iconOrder.indexOf("reddit") > -1}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("reddit");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1),
											  ]
											: [...iconOrder, "reddit"],
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
							checked={iconOrder.indexOf("tumblr") > -1}
							onChange={() => {
								let iconLoc = iconOrder.indexOf("tumblr");
								setAttributes({
									iconOrder:
										iconLoc > -1
											? [
													...iconOrder.slice(0, iconLoc),
													...iconOrder.slice(iconLoc + 1),
											  ]
											: [...iconOrder, "tumblr"],
								});
							}}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__("Captions")} initialOpen={false}>
					<ToggleControl
						label={__("Include captions", "ultimate-blocks")}
						checked={useCaptions}
						onChange={() => setAttributes({ useCaptions: !useCaptions })}
					/>
					{useCaptions && (
						<>
							<ToggleControl
								label={__("Include outline", "ultimate-blocks")}
								checked={addOutline}
								onChange={() => setAttributes({ addOutline: !addOutline })}
							/>
							{iconOrder.indexOf("facebook") > -1 && (
								<TextControl
									label={__("Facebook caption")}
									value={facebookCaption}
									onChange={(facebookCaption) =>
										setAttributes({ facebookCaption })
									}
								/>
							)}
							{iconOrder.indexOf("twitter") > -1 && (
								<TextControl
									label={__("Twitter caption")}
									value={twitterCaption}
									onChange={(twitterCaption) =>
										setAttributes({ twitterCaption })
									}
								/>
							)}
							{iconOrder.indexOf("linkedin") > -1 && (
								<TextControl
									label={__("LinkedIn caption")}
									value={linkedInCaption}
									onChange={(linkedInCaption) =>
										setAttributes({ linkedInCaption })
									}
								/>
							)}
							{iconOrder.indexOf("pinterest") > -1 && (
								<TextControl
									label={__("Pinterest caption")}
									value={pinterestCaption}
									onChange={(pinterestCaption) =>
										setAttributes({ pinterestCaption })
									}
								/>
							)}
							{iconOrder.indexOf("reddit") > -1 && (
								<TextControl
									label={__("Reddit caption")}
									value={redditCaption}
									onChange={(redditCaption) => setAttributes({ redditCaption })}
								/>
							)}
							{iconOrder.indexOf("tumblr") > -1 && (
								<TextControl
									label={__("Tumblr caption")}
									value={tumblrCaption}
									onChange={(tumblrCaption) => setAttributes({ tumblrCaption })}
								/>
							)}
						</>
					)}
				</PanelBody>
				<PanelBody title={__("Color")} initialOpen={false}>
					<PanelRow>
						<label htmlFor="ub_social_share_custom_color">
							<b>{__("Customize color")}</b>
						</label>
						<FormToggle
							id="ub_social_share_custom_color"
							label={__("Customize color")}
							checked={buttonColor}
							onChange={() =>
								setAttributes({ buttonColor: buttonColor ? "" : "#cccccc" })
							}
						/>
					</PanelRow>
					{buttonColor && (
						<>
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${buttonColor})`}
								style={{ background: buttonColor }}
							/>
							<ColorPalette
								value={buttonColor}
								onChange={(buttonColor) => setAttributes({ buttonColor })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
		);
	}
}
