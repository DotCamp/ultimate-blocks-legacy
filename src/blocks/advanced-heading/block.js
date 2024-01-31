import icon from "./icons";
import edit from "./components";
import transforms from "./transforms";
import metadata from "./block.json";
const { registerBlockType } = wp.blocks;

registerBlockType(metadata.name, {
	...metadata,
	icon,
	transforms,
	attributes: metadata.attributes,
	example: {
		attributes: {
			level: "h1",
			content: "Ultimate Blocks Advanced Heading",
			alignment: "center",
			textColor: "red",
			fontFamily: "inherit",
		},
	},
	edit,
	save: () => null,
});
