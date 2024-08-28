import icon from "../icons/icon";
import { useEffect } from "react";
import metadata from "./block.json";
import { getParentBlock } from "../../../common";
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { InnerBlocks, useBlockProps } = wp.blockEditor || wp.editor;
const { withSelect } = wp.data;

registerBlockType("ub/tab", {
	title: __("Tab"),
	parent: __("ub/tabbed-content"),
	description: __("content of tab"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		index: {
			type: "number",
			default: 0,
		},
		isActive: {
			type: "boolean",
			default: true,
		},
	},
	supports: {
		inserter: false,
		reusable: false,
		lock: false,
	},
	edit(props) {
		return (
			<div style={{ display: props.attributes.isActive ? "block" : "none" }}>
				<InnerBlocks templateLock={false} />
			</div>
		);
	},
	save(props) {
		return (
			<div
				className={`wp-block-ub-tabbed-content-tab-content-wrap ${
					props.attributes.isActive ? "active" : "ub-hide"
				}`}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
});

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	edit: withSelect((select, ownProps) => ({
		blockParentId: (
			select("core/block-editor") || select("core/editor")
		).getBlockRootClientId(ownProps.clientId),
		block: select("core/block-editor").getBlock(ownProps.clientId),
	}))(function (props) {
		const { blockParentId, setAttributes, block } = props;
		const { parentID, isActive } = props.attributes;
		const blockProps = useBlockProps({
			style: { display: isActive ? "block" : "none" },
		});
		const rootBlock = getParentBlock(props.clientId, "core/block");

		useEffect(() => {
			if (!rootBlock && (parentID === "" || parentID !== blockParentId)) {
				setAttributes({ parentID: blockParentId });
			}
		}, [parentID, blockParentId]);
		const hasInnerBlocks = block?.innerBlocks?.length > 0;
		return (
			<div {...blockProps}>
				<InnerBlocks
					templateLock={false}
					template={[["core/paragraph"]]}
					renderAppender={() =>
						hasInnerBlocks ? false : <InnerBlocks.ButtonBlockAppender />
					}
				/>
			</div>
		);
	}),
	save: () => <InnerBlocks.Content />,
});
