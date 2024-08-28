import { ExpandRoot } from "./components";

import icon from "./icon";

import { useEffect } from "react";

import { __ } from "@wordpress/i18n";

import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import expandPortionMetadata from "./expand-portion/block.json";
import {
	RichText,
	InnerBlocks,
	BlockControls,
	AlignmentToolbar,
	useBlockProps,
} from "@wordpress/block-editor";

import { withSelect, withDispatch } from "@wordpress/data";

import { compose } from "@wordpress/compose";

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	attributes: metadata.attributes,
	example: {
		innerBlocks: [
			{
				name: "ub/expand-portion",
				attributes: {
					clickText: "show more",
					displayType: "partial",
					isVisible: true,
					toggleAlign: "left",
					parentID: "518fc740-808b-42ad-b0a8-20d7bf928215",
				},
				innerBlocks: [
					{
						name: "core/heading",
						attributes: { content: "This part is initially shown" },
					},
					{
						name: "core/paragraph",
						attributes: {
							content:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ornare non magna sit amet dapibus. Vestibulum malesuada commodo nisl, nec consequat lectus molestie quis. Mauris ullamcorper orci fringilla lorem posuere, venenatis finibus felis volutpat. Morbi convallis ipsum id cursus efficitur. Cras tristique accumsan leo, sed venenatis nulla venenatis eget. Quisque et pretium dolor, vitae imperdiet tortor. Vestibulum quis elit id orci consequat tempor. Quisque nibh felis, pellentesque non dapibus eget, congue at urna.",
						},
					},
				],
			},
			{
				name: "ub/expand-portion",
				attributes: {
					clickText: "show less",
					displayType: "full",
					isVisible: false,
					toggleAlign: "left",
					parentID: "518fc740-808b-42ad-b0a8-20d7bf928215",
				},
				innerBlocks: [
					{
						name: "core/heading",
						attributes: { content: "This part is not shown initially" },
					},
					{
						name: "core/paragraph",
						attributes: {
							content:
								"Nunc nec turpis posuere, pharetra erat ut, pretium lorem. Aliquam sagittis diam eget magna vehicula dictum nec eget diam. Sed vel lectus aliquam, convallis ligula at, elementum risus. Aliquam egestas aliquam efficitur. Integer pellentesque ipsum et sapien tempus tempor. Nullam auctor dictum ligula, vel gravida sem vulputate quis. In egestas nisl et lorem tristique egestas. Ut id magna laoreet, placerat urna ac, ultricies sapien. Praesent molestie ornare urna, sit amet volutpat quam. Proin fringilla nisi vel elit ultricies posuere. Pellentesque commodo vel nulla in aliquet.",
						},
					},
				],
			},
		],
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getSelectedBlockClientId,
				getClientIdsWithDescendants,
				getBlockRootClientId,
			} = select("core/block-editor") || select("core/editor");

			const { clientId } = ownProps;
			const block = getBlock(clientId);
			const rootBlockClientId = getBlockRootClientId(block.clientId);
			return {
				block,
				getBlock,
				getClientIdsWithDescendants,
				getSelectedBlockClientId,
				rootBlockClientId,
			};
		}),
		withDispatch((dispatch) => {
			const { updateBlockAttributes, insertBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
			};
		}),
	])(ExpandRoot),

	save: () => <InnerBlocks.Content />,
});

function ExpandPortion(props) {
	const {
		attributes,
		setAttributes,
		isSelected,
		block,
		updateBlockAttributes,
		getBlock,
		getBlockRootClientId,
	} = props;
	const { clickText, displayType, isVisible, toggleAlign } = attributes;
	const blockProps = useBlockProps();
	const parentBlockID = getBlockRootClientId(block.clientId);

	useEffect(() => {
		if (
			props.attributes.parentID === "" ||
			props.attributes.parentID !== getBlock(parentBlockID).attributes.blockID
		) {
			props.attributes.parentID = getBlock(parentBlockID).attributes.blockID;
		}
	}, []);

	return (
		<div {...blockProps}>
			{isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={toggleAlign} //attribute from parent can't be directly used
						onChange={(newAlignment) => {
							updateBlockAttributes(parentBlockID, {
								toggleAlign: newAlignment,
							});

							getBlock(parentBlockID).innerBlocks.forEach((innerBlock) =>
								updateBlockAttributes(innerBlock.clientId, {
									toggleAlign: newAlignment,
								}),
							);
						}}
						controls={["left", "center", "right"]}
					></AlignmentToolbar>
				</BlockControls>
			)}
			<div
				className={`ub-expand-portion ub-expand-${displayType}${
					displayType === "full" && !isVisible ? " ub-hide" : ""
				}`}
			>
				<InnerBlocks
					templateLock={false}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
				/>
				<RichText
					style={{ textAlign: toggleAlign }} //attribute from parent can't be directly used
					value={clickText}
					onChange={(value) => setAttributes({ clickText: value })}
					placeholder={__(
						`Text for show ${displayType === "full" ? "less" : "more"} button`,
					)}
				/>
			</div>
		</div>
	);
}

registerBlockType(expandPortionMetadata.name, {
	...expandPortionMetadata,
	icon: icon,
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");

			const { clientId } = ownProps;
			const block = getBlock(clientId);
			const rootBlockClientId = getBlockRootClientId(block.clientId);
			return {
				block,
				getBlock,
				getBlockRootClientId,
				rootBlockClientId,
			};
		}),
		withDispatch((dispatch) => ({
			updateBlockAttributes: (
				dispatch("core/block-editor") || dispatch("core/editor")
			).updateBlockAttributes,
		})),
	])(ExpandPortion),
	save: () => <InnerBlocks.Content />,
});
