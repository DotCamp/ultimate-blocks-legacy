import icon from "../icons/icon";
import icons from "../icons/icons";

import { panel_version_1_1_9 } from "../oldVersions";
import { useState, useEffect } from "react";
import SavedStylesInspector from "$Inc/components/SavedStyles/SavedStylesInspector";
import ProManager from "$Manager/ProManager";
import metadata from "./panel/block.json";
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import {
	RichText,
	InnerBlocks,
	InspectorControls,
	InspectorAdvancedControls,
	PanelColorSettings,
	useBlockProps,
} from "@wordpress/block-editor";

import { compose } from "@wordpress/compose";

import { withDispatch, withSelect } from "@wordpress/data";

import {
	FormToggle,
	PanelBody,
	PanelRow,
	SelectControl,
	ButtonGroup,
	Button,
	ToggleControl,
	Dropdown,
} from "@wordpress/components";

const attributes = {
	index: {
		type: "number",
		default: 0,
	},
	parentID: {
		type: "string",
		default: "",
	},
	theme: {
		type: "text",
		default: "",
	},
	collapsed: {
		type: "boolean",
		default: false,
	},
	collapsedOnMobile: {
		type: "boolean",
		default: false,
	},
	hasFAQSchema: {
		type: "boolean",
		default: false,
	},
	titleColor: {
		type: "string",
		default: "",
	},
	titleLinkColor: {
		type: "string",
		default: "",
	},
	panelTitle: {
		type: "string",
		default: "",
	},
	newBlockPosition: {
		type: "string",
		default: "none", //changes into above/below depending on which button is clicked
	},
	titleTag: {
		type: "string",
		default: "p",
	},
	preventCollapse: {
		type: "boolean",
		default: false,
	},
	toggleLocation: {
		type: "string",
		default: "right",
	},
	toggleColor: {
		type: "string",
		default: "#000000",
	},
	toggleIcon: {
		type: "string",
		default: "chevron", //valid icons: chevron, plus, none
	},
	toggleID: {
		type: "string",
		default: "",
	},
	useToggleInToC: {
		type: "boolean",
		default: false,
	},
	border: {
		type: "boolean",
		default: true,
	},
	showOnlyOne: {
		type: "boolean",
		default: false,
	},
	defaultOpen: {
		type: "boolean",
		default: false,
	},
};

function ContentTogglePanel(props) {
	const [showPanel, setPanelStatus] = useState(false);
	const blockProps = useBlockProps();
	const {
		attributes: {
			theme,
			titleColor,
			titleLinkColor,
			panelTitle,
			collapsed,
			collapsedOnMobile,
			hasFAQSchema,
			titleTag,
			preventCollapse,
			toggleLocation,
			toggleColor,
			toggleIcon,
			toggleID,
			useToggleInToC,
			border,
			showOnlyOne,
			parentID,
		},
		setAttributes,
		removeBlock,
		block,
		blockParent,
		blockParentId,
		updateBlockAttributes,
		selectBlock,
	} = props;

	const toggleIconPositions = {
		left: __("Left", "ultimate-blocks"),
		right: __("Right", "ultimate-blocks"),
	};

	// @deprecated
	// if (parentID === "" || parentID !== blockParentId) {
	// 	setAttributes({ parentID: blockParentId });
	// }

	useEffect(() => {
		if (blockParent?.attributes?.titleLinkColor === "invalid") {
			setPanelStatus(true);
		}
	}, []);

	useEffect(() => {
		if (showOnlyOne) {
			setPanelStatus(!collapsed);
		}
	}, [collapsed]);

	const panels = blockParent?.innerBlocks ?? [];

	const availablePanels = panels.map((panel, index) => {
		return {
			value: panel.clientId,
			label: `Panel ${index + 1}`,
		};
	});

	const defaultOpenOptions = [
		{ value: "none", label: __("None", "ultimate-blocks") },
		...availablePanels,
	];

	return (
		<div {...blockProps}>
			<InspectorControls group="settings">
				<PanelBody title={__("Panel Title")} initialOpen={false}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "5fr 1fr",
							padding: "0 16px",
						}}
					>
						<p>{__("Select Heading Tag", "ultimate-blocks")}</p>
						<SelectControl
							options={[
								{ value: "h1", label: __("H1", "ultimate-blocks") },
								{ value: "h2", label: __("H2", "ultimate-blocks") },
								{ value: "h3", label: __("H3", "ultimate-blocks") },
								{ value: "h4", label: __("H4", "ultimate-blocks") },
								{ value: "h5", label: __("H5", "ultimate-blocks") },
								{ value: "h6", label: __("H6", "ultimate-blocks") },
								{ value: "p", label: __("P", "ultimate-blocks") },
							]}
							value={titleTag}
							onChange={(titleTag) => {
								setAttributes({ titleTag });
								if (titleTag === "p" && useToggleInToC) {
									setAttributes({ useToggleInToC: false });
								}
							}}
						/>
					</div>
				</PanelBody>
				<PanelBody title={__("Toggle State")} initialOpen={false}>
					{blockParent && //compatibility with v 2.0.0
						!blockParent.attributes.individualCollapse &&
						!collapsedOnMobile && (
							<PanelRow>
								<label htmlFor="ub-content-toggle-amount">
									{__("Show only one panel at a time")}
								</label>
								<FormToggle
									id="ub-content-toggle-amount"
									label={__("Show only one panel at a time")}
									checked={showOnlyOne}
									onChange={() => {
										setAttributes({ showOnlyOne: !showOnlyOne });
										if (!showOnlyOne) {
											setAttributes({
												collapsed: false,
												preventCollapse: false,
												collapsedOnMobile: false,
											});
										}
									}}
								/>
							</PanelRow>
						)}
					{!preventCollapse && (
						<>
							<PanelRow>
								<label htmlFor="ub-content-toggle-state">
									{__("Collapsed")}
								</label>
								<FormToggle
									id="ub-content-toggle-state"
									label={__("Collapsed")}
									checked={collapsed}
									onChange={() => {
										setAttributes({ collapsed: !collapsed });
										if (showOnlyOne) {
											setPanelStatus(collapsed);
										}
										if (!collapsed) {
											setAttributes({ preventCollapse: false });
										}
									}}
								/>
							</PanelRow>
							{collapsed && (
								<SelectControl
									label={__("Default Open", "ultimate-blocks")}
									options={defaultOpenOptions}
									value={
										panels.find((panel) => panel?.attributes?.defaultOpen)
											?.clientId ?? "none"
									}
									onChange={(newId) => {
										panels.forEach((panel) => {
											if (panel.clientId === newId) {
												updateBlockAttributes(panel.clientId, {
													defaultOpen: true,
												});
											} else {
												updateBlockAttributes(panel.clientId, {
													defaultOpen: false,
												});
											}
										});
									}}
								/>
							)}
							{!showOnlyOne && (
								<PanelRow>
									<label htmlFor="ub-content-toggle-mobile-state">
										{__("Collapsed on mobile")}
									</label>
									<FormToggle
										id="ub-content-toggle-mobile-state"
										label={__("Collapsed on mobile")}
										checked={collapsedOnMobile}
										onChange={() => {
											setAttributes({ collapsedOnMobile: !collapsedOnMobile });
											if (!collapsedOnMobile) {
												setAttributes({ showOnlyOne: false });
											}
										}}
									/>
								</PanelRow>
							)}
						</>
					)}
					{blockParent && //compatibility with v 2.0.0
						!blockParent.attributes.individualCollapse &&
						!collapsed &&
						!collapsedOnMobile &&
						!showOnlyOne && (
							<PanelRow>
								<label htmlFor="ub-content-toggle-state">
									{__("Prevent collapse")}
								</label>
								<FormToggle
									id="ub-content-toggle-state"
									label={__("Prevent collapse")}
									checked={preventCollapse}
									onChange={() =>
										setAttributes({ preventCollapse: !preventCollapse })
									}
								/>
							</PanelRow>
						)}
				</PanelBody>
				<PanelBody title={__("FAQ Schema")} initialOpen={false}>
					<PanelRow>
						<label htmlFor="ub-content-toggle-faq-schema">
							{__("Enable FAQ Schema")}
						</label>
						<FormToggle
							id="ub-content-toggle-faq-schema"
							label={__("Enable FAQ Schema")}
							checked={hasFAQSchema}
							onChange={() => setAttributes({ hasFAQSchema: !hasFAQSchema })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<SavedStylesInspector
					attributes={props.attributes}
					setAttribute={(allAttrs) => {
						const { panelTitle, ...attrs } = allAttrs;

						// update block and its innerblock panel attributes
						setAttributes(attrs);
					}}
					attributesToSave={(() => {
						const excludeList = ["index", "parent", "parentID"];

						return Object.keys(props.attributes).filter((key) => {
							return (
								Object.prototype.hasOwnProperty.call(props.attributes, key) &&
								!excludeList.includes(key)
							);
						});
					})()}
					previewAttributeCallback={(attr) => {
						// eslint-disable-next-line no-unused-vars
						const { parent, parentID, ...rest } = attr;
						return rest;
					}}
					previewElementCallback={(el) => el}
					previewBlockType={"ub/content-toggle-panel-block-preview"}
				/>
				<PanelBody title={__("Style")}>
					<PanelColorSettings
						title={__("Color Scheme")}
						initialOpen={false}
						enableAlpha={true}
						colorSettings={[
							{
								value: theme,
								onChange: (value) => setAttributes({ theme: value }),
								label: __("Container Color"),
							},
							{
								value: titleColor,
								onChange: (value) => setAttributes({ titleColor: value }),
								label: __("Title Color"),
							},
							{
								value: titleLinkColor,
								onChange: (value) => setAttributes({ titleLinkColor: value }),
								label: __("Title link Color"),
							},
							{
								value: toggleColor,
								onChange: (value) => setAttributes({ toggleColor: value }),
								label: __("Toggle Icon Color"),
							},
						]}
					/>
					<PanelRow>
						<label htmlFor="ub-content-toggle-border">{__("Border")}</label>
						<FormToggle
							id="ub-content-toggle-border"
							label={__("Enable border")}
							checked={border}
							onChange={() => setAttributes({ border: !border })}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={__("Toggle Status Icon", "ultimate-blocks")}
					initialOpen={false}
				>
					{toggleIcon !== "none" && (
						<PanelRow>
							<label htmlFor="ub-content-toggle-status-location">
								{__("Location", "ultimate-blocks")}
							</label>
							<ButtonGroup
								id="ub-content-toggle-status-location"
								aria-label={__("toggle icon position", "ultimate-blocks")}
							>
								{Object.keys(toggleIconPositions).map((p) => {
									if (
										Object.prototype.hasOwnProperty.call(toggleIconPositions, p)
									) {
										return (
											<Button
												isLarge
												aria-pressed={toggleLocation === p}
												isPrimary={toggleLocation === p}
												onClick={() => setAttributes({ toggleLocation: p })}
											>
												{toggleIconPositions[p]}
											</Button>
										);
									}
								})}
							</ButtonGroup>
						</PanelRow>
					)}
					<PanelRow>
						<label htmlFor="ub-content-toggle-status-icon">
							{__("Icon", "ultimate-blocks")}
						</label>
						<Dropdown
							position="bottom right"
							renderToggle={({ onToggle, isOpen }) => (
								<Button isLarge onClick={onToggle} area-expanded={isOpen}>
									{icons[toggleIcon] === "none" ? (
										<span>{__("None")}</span>
									) : (
										<span className={icons[toggleIcon]} />
									)}
								</Button>
							)}
							renderContent={() => (
								<div className="wp-block-ub-content-toggle-customize-icons-wrap">
									{Object.keys(icons).map((i) => {
										if (Object.prototype.hasOwnProperty.call(icons, i)) {
											return (
												<Button
													isPrimary={toggleIcon === i}
													isLarge
													onClick={() => setAttributes({ toggleIcon: i })}
												>
													{icons[i] === "none" ? (
														__("None")
													) : (
														<span className={icons[i]} />
													)}
												</Button>
											);
										}
									})}
								</div>
							)}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				{!useToggleInToC && (
					<>
						<PanelRow>
							<p>{__("Panel ID")}</p>
							<input
								type="text"
								value={toggleID}
								onChange={(e) => setAttributes({ toggleID: e.target.value })}
							/>
						</PanelRow>
						<p class="ub-custom-id-input">
							{__(
								"Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page."
							)}
							<a
								href="https://wordpress.org/support/article/page-jumps/"
								target="_blank"
								rel="external noreferrer noopener"
							>
								{__("Learn more about anchors")}
								<span class="components-visually-hidden">
									{__(" (opens in a new tab)")}
								</span>
								<span class="dashicons-before dashicons-external" />
							</a>
						</p>
					</>
				)}
				{titleTag !== "p" && (
					<PanelRow>
						<p>{__("Use this panel in the Table of Contents")}</p>
						<ToggleControl
							checked={useToggleInToC}
							onChange={() => {
								setAttributes({ useToggleInToC: !useToggleInToC });
							}}
						/>
					</PanelRow>
				)}
			</InspectorAdvancedControls>
			<div
				className={`wp-block-ub-content-toggle-accordion ${
					border ? "" : "no-border"
				}`}
				style={{ borderColor: theme }}
			>
				<div
					className="wp-block-ub-content-toggle-accordion-title-wrap"
					style={{ backgroundColor: theme }}
				>
					<RichText
						tagName={titleTag}
						style={{ color: titleColor }}
						className={`wp-block-ub-content-toggle-accordion-title ub-accordion-title-${blockParentId}`}
						value={panelTitle}
						allowedFormats={["core/bold", "core/italic", "core/link"]}
						onChange={(value) => setAttributes({ panelTitle: value })}
						placeholder={__("Panel Title")}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => {
							setPanelStatus(true);
						}}
					/>
					{toggleIcon !== "none" && (
						<div
							className={
								"wp-block-ub-content-toggle-accordion-toggle-wrap " +
								toggleLocation
							}
							style={{ color: toggleColor }}
						>
							<span
								onClick={() => setPanelStatus(!showPanel)}
								className={`wp-block-ub-content-toggle-accordion-state-indicator ${
									icons[toggleIcon] ? icons[toggleIcon] : ""
								} ${showPanel ? "open" : ""}`}
							/>
							<div className="wp-block-ub-content-toggle-accordion-toggle-location">
								<span
									title={__("Switch toggle location", "ultimate-blocks")}
									onClick={() =>
										setAttributes({
											toggleLocation:
												toggleLocation === "left" ? "right" : "left",
										})
									}
									className="dashicons dashicons-leftright"
								/>
							</div>
						</div>
					)}
				</div>
				{showPanel && (
					<div className="wp-block-ub-content-toggle-accordion-content-wrap">
						<InnerBlocks
							templateLock={false}
							template={[
								["core/paragraph", { placeholder: __("Panel content") }],
							]}
						/>
					</div>
				)}
				<div className="wp-block-ub-content-toggle-accordion-controls-top">
					<span
						title={__("Insert New Toggle Above")}
						onClick={() => setAttributes({ newBlockPosition: "above" })}
						className="dashicons dashicons-plus-alt"
					/>
					<span
						title={__("Delete This Toggle")}
						onClick={() => removeBlock(block.clientId)}
						class="dashicons dashicons-dismiss"
					/>
				</div>
				<div className="wp-block-ub-content-toggle-accordion-controls-bottom">
					<span
						title={__("Insert New Toggle Below")}
						onClick={() => setAttributes({ newBlockPosition: "below" })}
						className="dashicons dashicons-plus-alt"
					/>
				</div>
			</div>
		</div>
	);
}

registerBlockType("ub/content-toggle-panel", {
	title: __("Content Toggle Panel"),
	parent: ["ub/content-toggle"],
	icon: icon,
	category: "ultimateblocks",
	attributes,
	supports: {
		inserter: false,
		reusable: false,
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");
			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				blockParentId: getBlockRootClientId(clientId),
			};
		}),
		withDispatch((dispatch) => {
			const { updateBlockAttributes, removeBlock, selectBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return { updateBlockAttributes, removeBlock, selectBlock };
		}),
	])(ContentTogglePanel),
	save(props) {
		const { theme, collapsed, titleColor, panelTitle, index, parentID } =
			props.attributes;
		const classNamePrefix = "wp-block-ub-content-toggle";
		return (
			<div
				style={{ borderColor: theme }}
				className={`${classNamePrefix}-accordion`}
			>
				<div
					aria-expanded={collapsed}
					tabIndex={0}
					aria-controls={`ub-content-toggle-panel-${index}-${parentID}`}
					className={`${classNamePrefix}-accordion-title-wrap`}
					style={{ backgroundColor: theme }}
				>
					<RichText.Content
						tagName="span"
						className={`${classNamePrefix}-accordion-title`}
						style={{ color: titleColor || "inherit" }}
						value={panelTitle}
					/>
					<span
						className={
							`${classNamePrefix}-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ` +
							(collapsed ? "" : "open")
						}
					/>
				</div>
				<div
					role="region"
					id={`ub-content-toggle-panel-${index}-${parentID}`}
					style={{
						height: collapsed ? "0" : "",
						paddingTop: collapsed ? "0" : "",
						paddingBottom: collapsed ? "0" : "",
					}}
					className={`${classNamePrefix}-accordion-content-wrap${
						collapsed ? " ub-hide" : ""
					}`}
				>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	deprecated: [
		{
			attributes,
			save: panel_version_1_1_9,
		},
	],
});

const composedEdit = compose([
	withSelect((select, ownProps) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const { clientId } = ownProps;

		return {
			block: getBlock(clientId),
			blockParent: getBlock(getBlockRootClientId(clientId)),
			blockParentId: getBlockRootClientId(clientId),
		};
	}),
	withDispatch((dispatch) => {
		const { updateBlockAttributes, removeBlock, selectBlock } =
			dispatch("core/block-editor") || dispatch("core/editor");

		return { updateBlockAttributes, removeBlock, selectBlock };
	}),
]);

registerBlockType(metadata, {
	icon,
	edit: composedEdit(ContentTogglePanel),
	save: () => <InnerBlocks.Content />,
});

// only register the preview block if the pro version is not active
if (!ProManager.proStatus()) {
	// block for preview purposes
	registerBlockType("ub/content-toggle-panel-block-preview", {
		title: __("Content Toggle Panel Preview - Internal Use", "ultimate-blocks"),
		icon,
		category: "ultimateblocks",
		attributes,
		supports: {
			inserter: false,
			reusable: false,
		},
		edit: composedEdit(ContentTogglePanel),
		save: () => null,
	});
}
