import icon from "./icon";
import { EditorComponent } from "./components";

import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
registerBlockType(metadata.name, {
	...metadata,
	attributes: metadata.attributes,
	icon: icon,
	example: {},
	edit: EditorComponent,
	save: () => null,
});
