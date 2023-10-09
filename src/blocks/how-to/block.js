import icon from "./icon";
import { EditorComponent } from "./components";

import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
registerBlockType(metadata, {
	icon: icon,
	example: {},
	edit: EditorComponent,
	save: () => null,
});
