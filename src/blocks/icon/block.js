/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import registerPluginBlock from "$Inc/registerPluginBlock";

/**
 * Custom Imports
 */
import { blockIcon } from "./icons/block-icon";
import Edit from "./edit";
import Save from "./save";

const attributes = {
	icon: {
		type: "object",
		default: {},
	},
	svgIcon: {
		type: "string",
		default: "",
	},
	size: {
		type: "string",
		default: "40px",
	},
	iconColor: {
		type: "string",
		default: null,
	},
	iconHoverColor: {
		type: "string",
		default: null,
	},
	iconBackground: {
		type: "string",
		default: null,
	},
	iconHoverBackground: {
		type: "string",
		default: null,
	},
	iconGradientBackground: {
		type: "string",
		default: null,
	},
	iconHoverGradientBackground: {
		type: "string",
		default: null,
	},
	justification: {
		type: "string",
		default: "center",
	},
	linkUrl: {
		type: "string",
	},
	linkRel: {
		type: "string",
	},
	linkTarget: {
		type: "string",
	},
};
registerPluginBlock("ub/icon", {
	title: __("Icon", "ultimate-blocks"),
	category: "ultimateblocks",
	icon: blockIcon,
	attributes,
	supports: {
		html: false,
		align: ["wide", "full"],
		anchor: true,
	},
	edit: Edit,
	save: Save,
});
