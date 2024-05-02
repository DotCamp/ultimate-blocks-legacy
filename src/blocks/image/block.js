import { registerBlockType } from "@wordpress/blocks";

import { image } from "@wordpress/icons";

import "./style.scss";
import "./block-styles";
import edit from "./edit";

import metadata from "./block.json";

registerBlockType(metadata, {
	icon: image,
	edit,
	save: () => null,
});
