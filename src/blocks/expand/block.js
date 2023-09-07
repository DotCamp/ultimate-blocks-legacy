import { ExpandRoot } from "./components";

import icon from "./icon";

import { useEffect } from "react";

const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const { RichText, InnerBlocks, BlockControls, AlignmentToolbar } =
	wp.blockEditor || wp.editor;

const { withSelect, withDispatch } = wp.data;

const { compose } = wp.compose;

registerBlockType("ub/expand", {
	title: __("Expand"),
	description: __(
		"Expand Block lets you add expandable content. You can hide some part of your content initially. Upon clicking on ‘Show More’ it will show.",
		"ultimate-blocks"
	),
	icon: icon,
	category: "ultimateblocks",
	keywords: [
		__("Preview"),
		__("Hidden Content"),
		__("Ultimate Blocks"),
		__("Show"),
		__("Hide"),
		__("Toggle"),
	],
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		initialShow: {
			type: "boolean",
			default: false,
		},
		toggleAlign: {
			type: "string",
			default: "left",
		},
		allowScroll: {
			type: "boolean",
			default: false,
		},
		scrollOption: {
			type: "string",
			default: "auto", //other options: namedelement, fixedamount, off
		},
		scrollOffset: {
			type: "number",
			default: 0,
		},
		scrollTarget: {
			type: "string",
			default: "",
		},
		scrollTargetType: {
			type: "string",
			default: "id", //other types: class, element
		},
	},
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
			} = select("core/block-editor") || select("core/editor");

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				getBlock,
				getClientIdsWithDescendants,
				getSelectedBlockClientId,
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
		<>
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
								})
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
						`Text for show ${displayType === "full" ? "less" : "more"} button`
					)}
				/>
			</div>
		</>
	);
}

registerBlockType("ub/expand-portion", {
	title: __("Expand Portion"),
	parent: "ub/expand",
	icon: icon,
	category: "ultimateblocks",
	supports: {
		inserter: false,
		reusable: false,
		lock: false,
	},
	attributes: {
		clickText: {
			type: "string",
			default: "",
		},
		displayType: {
			type: "string",
			default: "",
		},
		isVisible: {
			type: "boolean",
			default: true,
		},
		toggleAlign: {
			type: "string",
			default: "left",
		},
		parentID: {
			type: "string",
			default: "",
		},
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				getBlock,
				getBlockRootClientId,
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
