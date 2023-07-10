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
		type: "number",
		default: 30,
	},
};
registerPluginBlock("ub/icon", {
	title: __("Icon", "ultimate-blocks"),
	category: "ultimateblocks",
	icon: blockIcon,
	attributes,
	edit: Edit,
	save: Save,
});
