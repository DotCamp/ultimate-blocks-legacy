import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import Edit from "./edit";
import { blockIcon } from "./icon.js";

registerBlockType(metadata, {
	attributes: metadata.attributes,
	edit: Edit,
	save: () => null,
	icon: blockIcon,
});
