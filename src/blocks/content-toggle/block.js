/**
 * BLOCK: Content Toggle
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from "./icons/icon";

import { richTextToHTML, mergeRichTextArray } from "../../common";
import { OldPanelContent, PanelContent } from "./components/editorDisplay";

import { version_1_1_2 } from "./oldVersions";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { withState, compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { InnerBlocks } = wp.blockEditor || wp.editor;

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	theme: {
		type: "string",
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
	individualCollapse: {
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
	hasFAQSchema: {
		type: "boolean",
		default: false,
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
		default: "chevron",
	},
	border: {
		type: "boolean",
		default: true,
	},
	showOnlyOne: {
		type: "boolean",
		default: false,
	},
};

const oldAttributes = Object.assign(Object.assign({}, attributes), {
	accordions: {
		source: "query",
		selector: ".wp-block-ub-content-toggle-accordion",
		query: {
			title: {
				type: "array",
				source: "children",
				selector: ".wp-block-ub-content-toggle-accordion-title",
			},
			content: {
				type: "array",
				source: "children",
				selector: ".wp-block-ub-content-toggle-accordion-content",
			},
		},
	},
});

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

registerBlockType("ub/content-toggle", {
	title: __("Content Toggle"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [
		__("Content Accordion"),
		__("Toggle Collapse"),
		__("Ultimate Blocks"),
	],

	supports: {
		inserter: false,
	},
	attributes,

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getSelectedBlockClientId, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				selectedBlock: getSelectedBlockClientId(),
				parentOfSelectedBlock: getBlockRootClientId(getSelectedBlockClientId()),
			};
		}),
		withDispatch((dispatch) => {
			const {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				selectBlock,
				replaceBlock,
			} = dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				selectBlock,
				replaceBlock,
			};
		}),
		withState({ oldArrangement: "", mainBlockSelected: true }),
	])(OldPanelContent),

	save() {
		return (
			<div>
				<InnerBlocks.Content />
			</div>
		);
	},
	deprecated: [
		{
			attributes: oldAttributes,
			migrate: (attributes) => {
				const { accordions, ...otherProps } = attributes;
				return [
					otherProps,
					accordions.map((a) => {
						let panelContent = [];
						a.content.forEach((paragraph, i) => {
							if (typeof paragraph === "string") {
								panelContent.push(
									createBlock("core/paragraph", {
										content: paragraph,
									})
								);
							} else if (paragraph.type === "br") {
								if (a.content[i - 1].type === "br") {
									panelContent.push(createBlock("core/paragraph"));
								}
							} else {
								panelContent.push(
									createBlock("core/paragraph", {
										content: richTextToHTML(paragraph),
									})
								);
							}
						});

						return createBlock(
							"ub/content-toggle-panel",
							{
								theme: attributes.theme,
								titleColor: attributes.titleColor,
								collapsed: attributes.collapsed,
								panelTitle: mergeRichTextArray(a.title),
							},
							panelContent
						);
					}),
				];
			},
			save: version_1_1_2,
		},
	],
});

registerBlockType("ub/content-toggle-block", {
	title: __("Content Toggle"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [
		__("Content Accordion"),
		__("Toggle Collapse"),
		__("Ultimate Blocks"),
		__("FAQ"),
	],

	attributes,

	transforms: {
		to: [
			{
				type: "block",
				blocks: "core/group",
				transform: (_, innerBlocks) =>
					createBlock(
						"core/group",
						{},
						innerBlocks.map((i) => createBlock("core/group", {}, i.innerBlocks))
					),
			},
		],
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getSelectedBlockClientId,
				getClientIdsWithDescendants,
			} = select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				selectedBlock: getSelectedBlockClientId(),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
		withDispatch((dispatch) => {
			const { updateBlockAttributes, insertBlock, removeBlock, selectBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				selectBlock,
			};
		}),
		withState({
			oldArrangement: [],
			oldAttributeValues: [],
			mainBlockSelected: true,
		}),
	])(PanelContent),

	save: () => <InnerBlocks.Content />,
});
