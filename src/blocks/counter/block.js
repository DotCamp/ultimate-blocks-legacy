import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import Edit from "./edit";
import { blockIcon } from "./icon.js";

registerBlockType(metadata, {
	edit: Edit,
	save: () => null,
	icon: blockIcon,
	example: {
		attributes: {
			label: "Counter Label",
			startNumber: "0",
			endNumber: "500",
			counterFontSize: "32px",
		},
	},
});
