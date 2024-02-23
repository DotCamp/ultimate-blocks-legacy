const { registerBlockType } = wp.blocks;
const { createBlock } = wp.blocks;

import metadata from "./block.json";

import icon from "./icon";
import { AdvancedVideoBlock } from "./components";

registerBlockType(metadata.name, {
	...metadata,
	icon,
	example: {
		attributes: {
			videoEmbedCode:
				'<iframe width="560" height="315" src="https://www.youtube.com/embed/I1LEsUvxGDc?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
		},
	},
	edit: AdvancedVideoBlock,
	transforms: {
		from: [
			{
				type: "block",
				blocks: ["core/embed"],
				transform: (attributes) =>
					createBlock("ub/advanced-video", {
						url: attributes.url,
						autofit: true,
						videoSource: attributes.providerNameSlug,
						isTransformed: true,
					}),
			},
		],
	},
	save: () => null,
});
