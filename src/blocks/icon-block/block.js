import { __ } from "@wordpress/i18n";
import registerPluginBlock from "$Inc/registerPluginBlock";
import Edit from "./edit";
import Save from "./save";

const attributes = {
	iconName: {
		type: "string",
		default: "",
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
	icon: "smiley",
	attributes,
	edit: Edit,
	save: Save,
});
