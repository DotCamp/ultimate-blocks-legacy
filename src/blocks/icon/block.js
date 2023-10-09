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
import metadata from "./block.json";

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
	iconRotation: {
		type: "number",
		default: 0,
	},
};
registerPluginBlock(metadata, {
	icon: blockIcon,
	attributes,
	edit: Edit,
	save: Save,
});
