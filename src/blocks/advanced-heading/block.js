import icon from "./icons";
import edit from "./components";
import transforms from "./transforms";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { withSelect } = wp.data;

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	anchor: {
		type: "string",
		default: "",
	},
	content: {
		type: "string",
		default: "",
	},
	level: {
		type: "string",
		default: "h1",
	},
	alignment: {
		type: "string",
		default: "none",
	},
	textColor: {
		type: "string",
		default: "",
	},
	backgroundColor: {
		type: "string",
		default: "",
	},
	fontSize: {
		type: "number",
		default: 0,
	},
	letterSpacing: {
		type: "number",
		default: 0,
	},
	textTransform: {
		type: "string",
		default: "None",
	},
	fontFamily: {
		type: "string",
		default: "",
	},
	fontWeight: {
		type: "string",
		default: "Bold",
	},
	lineHeight: {
		type: "number",
		default: 0,
	},
	highlightBgColor: {
		type: "string",
		default: "None",
	},
};

registerBlockType("ub/advanced-heading", {
	title: __("Advanced Heading", "ultimate-blocks"),
	icon,
	category: "ultimateblocks",
	keywords: [
		__("Heading", "ultimate-blocks"),
		__("Advanced Heading", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks"),
	],
	attributes,
	transforms,
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			getBlock,
			block: getBlock(ownProps.clientId),
			getClientIdsWithDescendants,
		};
	})(edit),
	save: () => null,
});
