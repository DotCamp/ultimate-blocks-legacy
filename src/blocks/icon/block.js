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
import "./blocks-styles";

registerPluginBlock(metadata.name, {
	...metadata,
	icon: blockIcon,
	attributes: metadata.attributes,
	edit: Edit,
	save: Save,
	example: {
		attributes: {
			icon: {
				iconName: "wordpress",
				type: "wordpress",
			},
			size: "84px",
			iconColor: "#ffffff",
			iconBackground: "#e11b4c",
			justification: "center",
		},
	},
});
