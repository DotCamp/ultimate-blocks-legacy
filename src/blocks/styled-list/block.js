import { __ } from "@wordpress/i18n";

import { registerBlockType, createBlock } from "@wordpress/blocks";
import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { InnerBlocks } from "@wordpress/blockEditor";
import icon, { listItemIcon } from "./icon";
import EditorComponent, { StyledListItem } from "./components";
import listMetadata from "./block.json";
import listItemMetaData from "./style-list-item/block.json";

registerBlockType(listMetadata.name, {
	...listMetadata,
	icon: icon,
	attributes: listMetadata.attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: ["core/list"],
				transform: (attributes, innerBlocks) => {
					if (attributes.ordered) {
						console.log("cannot be used for ordered lists");
						return null;
					} else {
						const convertSubitems = (subitems) =>
							subitems.map((subitem) =>
								createBlock(
									"ub/styled-list-item",
									{
										itemText: subitem.attributes.content,
									},
									subitem.innerBlocks.length > 0
										? [
												createBlock(
													"ub/styled-list",
													attributes,
													convertSubitems(subitem.innerBlocks[0].innerBlocks),
												),
											]
										: [],
								),
							);

						return createBlock(
							"ub/styled-list",
							attributes,
							convertSubitems(innerBlocks),
						);
					}
				},
			},
		],
	},
	example: {},
	edit: EditorComponent,
	save: () => <InnerBlocks.Content />,
});

registerBlockType(listItemMetaData.name, {
	...listItemMetaData,
	icon: listItemIcon,
	attributes: listItemMetaData.attributes,
	edit: StyledListItem,
	save: () => <InnerBlocks.Content />,
});
