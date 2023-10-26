import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import Edit from "./edit";
import { blockIcon } from "./icon.js";

registerBlockType(metadata, {
	edit: Edit,
	save: () => null,
	icon: blockIcon,
});
