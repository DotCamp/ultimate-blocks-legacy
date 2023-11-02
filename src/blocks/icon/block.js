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

registerPluginBlock(metadata, {
	icon: blockIcon,
	attributes: metadata.attributes,
	edit: Edit,
	save: Save,
});
