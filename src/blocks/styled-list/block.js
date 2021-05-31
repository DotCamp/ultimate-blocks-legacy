const { __ } = wp.i18n;

const { registerBlockType, createBlock } = wp.blocks;
const { withSelect } = wp.data;
import icon from "./icon";
import EditorComponent from "./components";

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
			default: [...Array(3).keys()]
				.map((i) => `<li>${__(`Item ${i + 1}`)}</li>`)
				.join(),
		},
		//retained for reverse compatibility
		listItem: {
			type: "array",
			default: Array(3).fill({
				text: "",
				selectedIcon: "check",
				indent: 0,
			}),
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
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: "core/list",
				transform: (attributes) =>
					createBlock("ub/styled-list", { list: attributes.values }),
			},
		],
	},
	keywords: [__("List"), __("Styled List"), __("Ultimate Blocks")],
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(EditorComponent),

	save: () => null,
});
