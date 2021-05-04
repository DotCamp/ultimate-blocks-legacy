/**
 * BLOCK: tabbed-content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import icon from "./icons/icon";
import { version_1_1_2 } from "./oldVersions";
import { richTextToHTML } from "../../common";
import { OldTabHolder, TabHolder } from "./components/editorDisplay";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { withState, compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { RichText, InnerBlocks } = wp.blockEditor || wp.editor;

const oldAttributes = {
	id: {
		type: "number",
		default: -1,
	},
	activeControl: {
		type: "string",
	},
	activeTab: {
		type: "number",
		default: 0,
	},
	theme: {
		type: "string",
		default: "#eeeeee",
	},
	titleColor: {
		type: "string",
		default: "#000000",
	},
	tabsContent: {
		source: "query",
		selector: ".wp-block-ub-tabbed-content-tab-content-wrap",
		query: {
			content: {
				type: "array",
				source: "children",
				selector: ".wp-block-ub-tabbed-content-tab-content",
			},
		},
	},
	tabsTitle: {
		source: "query",
		selector: ".wp-block-ub-tabbed-content-tab-title-wrap",
		query: {
			content: {
				type: "array",
				source: "children",
				selector: ".wp-block-ub-tabbed-content-tab-title",
			},
		},
	},
};

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	activeControl: {
		type: "string",
	},
	activeTab: {
		type: "number",
		default: 0,
	},
	theme: {
		type: "string",
		default: "#eeeeee",
	},
	normalColor: {
		type: "string",
		default: "",
	},
	titleColor: {
		type: "string",
		default: "#000000",
	},
	normalTitleColor: {
		type: "string",
		default: "#000000",
	},
	borderColor: {
		type: "string",
		default: "#d3d3d3",
	},
	tabsTitle: {
		type: "array",
		default: [],
	},
	tabsAlignment: {
		type: "string",
		default: "left",
	},
	tabsTitleAlignment: {
		type: "array",
		default: [],
	},
	tabsAnchor: {
		type: "array",
		default: [],
	},
	useAnchors: {
		type: "boolean",
		default: false,
	},
	tabVertical: {
		type: "boolean",
		default: false,
	},
	tabletTabDisplay: {
		type: "string",
		default: "horizontaltab",
	},
	mobileTabDisplay: {
		type: "string",
		default: "horizontaltab",
	},
	tabStyle: {
		type: "string",
		default: "tabs",
	},
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     ub/tabbed-content.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

registerBlockType("ub/tabbed-content", {
	title: __("Tabbed Content"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Tabbed Content"), __("Tabs"), __("Ultimate Blocks")],
	attributes: oldAttributes,
	supports: {
		inserter: false,
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getSelectedBlock } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				selectedBlock: getSelectedBlock(),
			};
		}),
		withDispatch((dispatch) => {
			const {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				moveBlockToPosition,
				selectBlock,
				replaceBlock,
			} = dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				moveBlockToPosition,
				selectBlock,
				replaceBlock,
			};
		}),
		withState({ oldArrangement: "" }),
	])(OldTabHolder),

	save: function (props) {
		const className = "wp-block-ub-tabbed-content";

		const { activeTab, theme, titleColor, tabsTitle, id } = props.attributes;

		return (
			<div data-id={id}>
				<div className={className + "-holder"}>
					<div className={className + "-tabs-title"}>
						{tabsTitle.map((value, i) => (
							<div
								className={
									className +
									"-tab-title-wrap" +
									(activeTab === i ? " active" : "")
								}
								style={{
									backgroundColor: activeTab === i ? theme : "initial",
									borderColor: activeTab === i ? theme : "lightgrey",
									color: activeTab === i ? titleColor : "#000000",
								}}
								key={i}
							>
								<RichText.Content
									tagName="div"
									className={className + "-tab-title"}
									value={value.content}
								/>
							</div>
						))}
					</div>
					<div className={className + "-tabs-content"}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes: oldAttributes,
			migrate: (attributes) => {
				const { tabsContent, ...otherAttributes } = attributes;
				return [
					otherAttributes,
					tabsContent.map((t) => {
						let tabContent = [];
						t.content.forEach((paragraph, i) => {
							if (typeof paragraph === "string") {
								tabContent.push(
									createBlock("core/paragraph", {
										content: paragraph,
									})
								);
							} else if (paragraph.type === "br") {
								if (t.content[i - 1].type === "br") {
									tabContent.push(createBlock("core/paragraph"));
								}
							} else {
								tabContent.push(
									createBlock("core/paragraph", {
										content: richTextToHTML(paragraph),
									})
								);
							}
						});

						return createBlock("ub/tab", {}, tabContent);
					}),
				];
			},
			save: version_1_1_2,
		},
	],
});

registerBlockType("ub/tabbed-content-block", {
	title: __("Tabbed Content"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Tabbed Content"), __("Tabs"), __("Ultimate Blocks")],
	attributes,
	supports: {
		align: ["wide", "full"],
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getSelectedBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				selectedBlock: getSelectedBlock(),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
		withDispatch((dispatch) => {
			const {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				moveBlockToPosition,
				selectBlock,
			} = dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				moveBlockToPosition,
				selectBlock,
			};
		}),
		withState({ oldArrangement: [] }),
	])(TabHolder),

	save: () => <InnerBlocks.Content />,
});
