import icon from "./icon";

import { ReviewBody } from "./components";
import {
	version_1_1_2,
	version_1_1_4,
	version_1_1_5,
	updateFrom
} from "./oldVersions";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { BlockControls, InspectorControls, PanelColorSettings } =
	wp.blockEditor || wp.editor;

const { Toolbar, IconButton, FormToggle, PanelBody, PanelRow } = wp.components;
const { withState, compose } = wp.compose;
const { withSelect } = wp.data;

const attributes = {
	ID: {
		type: "string",
		default: ""
	},
	blockID: {
		type: "string",
		default: ""
	},
	authorName: {
		type: "string",
		default: ""
	},
	itemName: {
		type: "string",
		default: ""
	},
	items: {
		type: "string",
		default: '[{"label":"","value":0}]'
	},
	description: {
		type: "string",
		default: ""
	},
	descriptionAlign: {
		type: "string",
		default: "left"
	},
	imgURL: {
		type: "string",
		default: ""
	},
	imgID: {
		type: "number"
	},
	imgAlt: {
		type: "string",
		default: ""
	},
	parts: {
		type: "array",
		default: [{ label: "", value: 0 }]
	},
	starCount: {
		type: "number",
		default: 5
	},
	summaryTitle: {
		type: "string",
		default: "Summary"
	},
	summaryDescription: {
		type: "string",
		default: ""
	},
	callToActionText: {
		type: "string",
		default: ""
	},
	callToActionURL: {
		type: "string",
		default: ""
	},
	callToActionBackColor: {
		type: "string",
		default: "#f63d3d"
	},
	callToActionForeColor: {
		type: "string",
		default: "#ffffff"
	},
	inactiveStarColor: {
		type: "string",
		default: "#888888"
	},
	activeStarColor: {
		type: "string",
		default: "#eeee00"
	},
	titleAlign: {
		type: "string",
		default: "left"
	},
	authorAlign: {
		type: "string",
		default: "left"
	},
	enableCTA: {
		type: "boolean",
		default: true
	},
	ctaNoFollow: {
		type: "boolean",
		default: true
	},
	ctaOpenInNewTab: {
		type: "boolean",
		default: true
	},
	enableReviewSchema: {
		type: "boolean",
		default: true
	},
	enableImage: {
		type: "boolean",
		default: false
	},
	enableDescription: {
		type: "boolean",
		default: false
	},
	starOutlineColor: {
		type: "string",
		default: "#000000"
	}
};

registerBlockType("ub/review", {
	title: __("Review"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Review"), __("Ultimate Blocks")],
	attributes,
	edit: compose([
		withState({ editable: "" }),
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId
			)
		}))
	])(function(props) {
		const { setAttributes, isSelected, editable, setState, block } = props;
		const {
			blockID,
			authorName,
			itemName,
			description,
			imgID,
			imgAlt,
			imgURL,
			items,
			parts,
			starCount,
			summaryTitle,
			summaryDescription,
			callToActionText,
			callToActionURL,
			callToActionBackColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor,
			starOutlineColor,
			titleAlign,
			authorAlign,
			descriptionAlign,
			enableCTA,
			ctaNoFollow,
			ctaOpenInNewTab,
			enableReviewSchema,
			enableImage,
			enableDescription
		} = props.attributes;

		if (blockID !== block.clientId) {
			setAttributes({
				blockID: block.clientId
			});
		}

		const setAlignment = (target, value) => {
			switch (target) {
				case "reviewTitle":
					setAttributes({ titleAlign: value });
					break;
				case "reviewAuthor":
					setAttributes({ authorAlign: value });
					break;
				case "reviewItemDescription":
					setAttributes({ descriptionAlign: value });
					break;
			}
		};

		const getCurrentAlignment = target => {
			switch (target) {
				case "reviewTitle":
					return titleAlign;
				case "reviewAuthor":
					return authorAlign;
				case "reviewItemDescription":
					return descriptionAlign;
			}
		};

		if (
			items &&
			items !== JSON.stringify(parts) &&
			parts.length === 1 &&
			parts[0].label === "" &&
			parts[0].value === 0
		) {
			setAttributes({
				parts: JSON.parse(items),
				items: '[{"label":"","value":0}]'
			});
		}

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__("Star Colors")}
						initialOpen={true}
						colorSettings={[
							{
								value: activeStarColor,
								onChange: colorValue =>
									setAttributes({
										activeStarColor: colorValue
									}),
								label: __("Active Star Color")
							},
							{
								value: inactiveStarColor,
								onChange: colorValue =>
									setAttributes({
										inactiveStarColor: colorValue
									}),
								label: __("Inactive Star Color")
							},
							{
								value: starOutlineColor,
								onChange: colorValue =>
									setAttributes({
										starOutlineColor: colorValue
									}),
								label: __("Star Outline Color")
							}
						]}
					/>
					<PanelColorSettings
						title={__("Button Colors")}
						initialOpen={false}
						colorSettings={[
							{
								value: callToActionBackColor,
								onChange: colorValue =>
									setAttributes({
										callToActionBackColor: colorValue
									}),
								label: __("Button Background")
							},
							{
								value: callToActionForeColor,
								onChange: colorValue =>
									setAttributes({
										callToActionForeColor: colorValue
									}),
								label: __("Button Text Color")
							}
						]}
					/>
					<PanelBody title={__("Call to Action button")} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub-review-cta-enable">{__("Enable")}</label>
							<FormToggle
								id="ub-review-cta-enable"
								label={__("Enable")}
								checked={enableCTA}
								onChange={_ => setAttributes({ enableCTA: !enableCTA })}
							/>
						</PanelRow>
						{enableCTA && (
							<React.Fragment>
								<PanelRow>
									<label htmlFor="ub-review-cta-nofollow">
										{__("Add nofollow")}
									</label>
									<FormToggle
										id="ub-review-cta-nofollow"
										label={__("Add nofollow")}
										checked={ctaNoFollow}
										onChange={_ =>
											setAttributes({
												ctaNoFollow: !ctaNoFollow
											})
										}
									/>
								</PanelRow>
								<PanelRow>
									<label htmlFor="ub-review-cta-openinnewtab">
										{__("Open link in new tab")}
									</label>
									<FormToggle
										id="ub-review-cta-openinnewtab"
										label={__("Open link in new tab")}
										checked={ctaOpenInNewTab}
										onChange={_ =>
											setAttributes({
												ctaOpenInNewTab: !ctaOpenInNewTab
											})
										}
									/>
								</PanelRow>
							</React.Fragment>
						)}
					</PanelBody>
					<PanelBody title={__("Review schema")} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub-review-schema-toggle">
								{__("Enable review schema")}
							</label>
							<FormToggle
								id="ub-review-schema-toggle"
								label={__("Enable review schema")}
								checked={enableReviewSchema}
								onChange={_ => {
									let newAttributes = {
										enableReviewSchema: !enableReviewSchema
									};
									if (enableReviewSchema) {
										newAttributes = Object.assign(newAttributes, {
											enableImage: false,
											enableDescription: false
										});
									}
									setAttributes(newAttributes);
								}}
							/>
						</PanelRow>
						{enableReviewSchema && [
							<PanelRow>
								<label htmlFor="ub-review-image-toggle">
									{__("Enable review image")}
								</label>
								<FormToggle
									id="ub-review-image-toggle"
									label={__("Enable review image")}
									checked={enableImage}
									onChange={_ =>
										setAttributes({
											enableImage: !enableImage
										})
									}
								/>
							</PanelRow>,
							<PanelRow>
								<label htmlFor="ub-review-description-toggle">
									{__("Enable review description")}
								</label>
								<FormToggle
									id="ub-review-description-toggle"
									label={__("Enable review description")}
									checked={enableDescription}
									onChange={_ =>
										setAttributes({
											enableDescription: !enableDescription
										})
									}
								/>
							</PanelRow>
						]}
					</PanelBody>
				</InspectorControls>
			),
			isSelected && (
				<BlockControls>
					{editable !== "" && (
						<Toolbar>
							{["left", "center", "right", "justify"].map(a => (
								<IconButton
									icon={`editor-${a === "justify" ? a : "align" + a}`}
									label={__(
										(a !== "justify" ? "Align " : "") +
											a[0].toUpperCase() +
											a.slice(1)
									)}
									isActive={getCurrentAlignment(editable) === a}
									onClick={() => setAlignment(editable, a)}
								/>
							))}
						</Toolbar>
					)}
				</BlockControls>
			),
			<ReviewBody
				isSelected={isSelected}
				authorName={authorName}
				itemName={itemName}
				description={description}
				descriptionEnabled={enableDescription}
				ID={blockID}
				imgID={imgID}
				imgAlt={imgAlt}
				imgURL={imgURL}
				imageEnabled={enableImage}
				items={parts}
				starCount={starCount}
				summaryTitle={summaryTitle}
				summaryDescription={summaryDescription}
				callToActionText={callToActionText}
				callToActionURL={callToActionURL}
				callToActionBackColor={callToActionBackColor}
				callToActionForeColor={callToActionForeColor}
				inactiveStarColor={inactiveStarColor}
				activeStarColor={activeStarColor}
				selectedStarColor={activeStarColor}
				starOutlineColor={starOutlineColor}
				setAuthorName={newValue => setAttributes({ authorName: newValue })}
				setItemName={newValue => setAttributes({ itemName: newValue })}
				setDescription={newValue => setAttributes({ description: newValue })}
				setImage={img =>
					setAttributes({
						imgID: img.id,
						imgURL: img.url,
						imgAlt: img.alt
					})
				}
				setItems={newValue => setAttributes({ parts: newValue })}
				setSummaryTitle={newValue => setAttributes({ summaryTitle: newValue })}
				setSummaryDescription={newValue =>
					setAttributes({ summaryDescription: newValue })
				}
				setCallToActionText={newValue =>
					setAttributes({ callToActionText: newValue })
				}
				setCallToActionURL={newValue =>
					setAttributes({ callToActionURL: newValue })
				}
				hasFocus={isSelected}
				setEditable={newValue => setState({ editable: newValue })}
				alignments={{ titleAlign, authorAlign, descriptionAlign }}
				enableCTA={enableCTA}
				ctaNoFollow={ctaNoFollow}
			/>
		];
	}),
	save: () => null,
	deprecated: [
		updateFrom(version_1_1_2),
		updateFrom(version_1_1_4),
		updateFrom(version_1_1_5)
	]
});
