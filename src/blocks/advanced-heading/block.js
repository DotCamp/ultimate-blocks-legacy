//Import Icon
import icon from "./icons/icons";
// Import Components
import edit from "./components";
// Import transforms
import transforms from "./transforms";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText } = wp.blockEditor || wp.editor;

const attributes = {
	content: {
		type: "string"
	},
	level: {
		type: "string",
		default: "h1"
	},
	alignment: {
		type: "string",
		default: "none"
	},
	textColor: {
		type: "string"
	},
	backgroundColor: {
		type: "string"
	},
	fontSize: {
		type: "string"
	},
	letterSpacing: {
		type: "string",
		default: "0"
	},
	textTransform: {
		type: "string",
		default: "None"
	},
	fontFamily: {
		type: "string"
	},
	fontWeight: {
		type: "string",
		default: "Bold"
	},
	lineHeight: {
		type: "string"
	}
};

registerBlockType("ub/advanced-heading", {
	title: __("Advanced Heading", "ultimate-blocks"),
	icon,
	category: "ultimateblocks",
	keywords: [
		__("Heading", "ultimate-blocks"),
		__("Advanced Heading", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks")
	],
	attributes,
	transforms,
	edit,
	save: ({ attributes }) => {
		const {
			content,
			level,
			alignment,
			textColor,
			backgroundColor,
			fontSize,
			letterSpacing,
			textTransform,
			fontFamily,
			fontWeight,
			lineHeight
		} = attributes;

		/* Google Fonts 
		const head = document.head;
		const link = document.createElement("link");

		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = "https://fonts.googleapis.com/css?family=Roboto";
		head.appendChild(link);*/

		return (
			<RichText.Content
				tagName={level}
				value={content}
				style={{
					textAlign: alignment,
					color: textColor,
					backgroundColor,
					fontSize,
					letterSpacing,
					textTransform,
					fontFamily,
					fontWeight,
					lineHeight
				}}
			/>
		);
	}
});
