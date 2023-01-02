const { __ } = wp.i18n;

const { registerBlockType, createBlock } = wp.blocks;
const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { InnerBlocks } = wp.blockEditor || wp.editor;
import icon, { listItemIcon } from "./icon";
import EditorComponent, { StyledListItem } from "./components";

registerBlockType("ub/styled-list", {
	title: __("Styled List"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		list: {
			type: "text",
			default: "",
		},
		selectedIcon: {
			type: "string",
			default: "check",
		},
		alignment: {
			type: "string",
			default: "left",
		},
		iconColor: {
			type: "string",
			default: "#000000",
		},
		iconSize: {
			type: "number",
			default: 5,
		},
		fontSize: {
			type: "number",
			default: 0, //set to current style's font size when font size customization is enabled
		},
		itemSpacing: {
			type: "number",
			default: 0, //in pixels
		},
		columns: {
			type: "number",
			default: 1,
		},
		maxMobileColumns: {
			type: "number",
			default: 2,
		},
		isRootList: {
			type: "boolean",
			default: false,
		},
		textColor: {
			type: "string",
			default: "",
		},
		backgroundColor: {
			type: "string",
			default: "",
		},
	},
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	transforms: {
		from: [
			{
				type: "block",
				blocks: ["core/list"],
				transform: (attributes, innerBlocks) => {
					if (attributes.ordered) {
						console.log("cannot be used for ordered lists");
						return null;
					} else {
						const convertSubitems = (subitems) =>
							subitems.map((subitem) =>
								createBlock(
									"ub/styled-list-item",
									{
										itemText: subitem.attributes.content,
									},
									subitem.innerBlocks.length > 0
										? [
												createBlock(
													"ub/styled-list",
													attributes,
													convertSubitems(subitem.innerBlocks[0].innerBlocks)
												),
										  ]
										: []
								)
							);

						return createBlock(
							"ub/styled-list",
							attributes,
							convertSubitems(innerBlocks)
						);
					}
				},
			},
		],
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getBlockParentsByBlockName,
				getClientIdsOfDescendants,
				getClientIdsWithDescendants,
			} = select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getBlockParentsByBlockName,
				getClientIdsOfDescendants,
				getClientIdsWithDescendants,
			};
		}),
		withDispatch((dispatch) => {
			const { replaceInnerBlocks, updateBlockAttributes } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return { replaceInnerBlocks, updateBlockAttributes };
		}),
	])(EditorComponent),
	save: () => <InnerBlocks.Content />,
});

registerBlockType("ub/styled-list-item", {
	title: __("Styled List Item"),
	icon: listItemIcon,
	category: "ultimateblocks",
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		itemText: {
			type: "string",
			default: "",
		},
		selectedIcon: {
			type: "string",
			default: "check",
		},
		iconColor: {
			type: "string",
			default: "#000000",
		},
		iconSize: {
			type: "number",
			default: 5,
		},
		fontSize: {
			type: "number",
			default: 0, //set to current style's font size when font size customization is enabled
		},
	},
	supports: { inserter: false },

	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getBlockIndex,
				getBlockParents,
				getBlockParentsByBlockName,
				getClientIdsWithDescendants,
				getNextBlockClientId,
				getPreviousBlockClientId,
			} = select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getBlockIndex,
				currentBlockIndex: getBlockIndex(ownProps.clientId),
				getBlockParents,
				listRootClientId: getBlockParents(ownProps.clientId, true)[0],
				getBlockParentsByBlockName,
				getClientIdsWithDescendants,
				getNextBlockClientId,
				getPreviousBlockClientId,
			};
		}),
		withDispatch((dispatch) => {
			const {
				insertBlock,
				moveBlocksToPosition,
				removeBlock,
				replaceBlocks,
				updateBlockAttributes,
			} = dispatch("core/block-editor") || dispatch("core/editor");

			return {
				insertBlock,
				moveBlocksToPosition,
				removeBlock,
				replaceBlocks,
				updateBlockAttributes,
			};
		}),
	])(StyledListItem),
	save: () => <InnerBlocks.Content />,
});
