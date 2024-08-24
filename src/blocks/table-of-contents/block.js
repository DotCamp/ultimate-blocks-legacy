import icon from "./icon";
import TableOfContents, {
	inspectorControls,
	blockControls,
	editorDisplay,
} from "./components";
import { getStyles } from "./get-style";

import {
	version_1_0_8,
	version_1_0_9,
	version_1_1_3,
	version_1_1_5,
	version_1_1_6,
	version_1_1_8,
	version_2_0_0,
	oldAttributes,
	updateFrom,
} from "./oldVersions";
import { useState } from "react";

import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";
import { ToggleControl, PanelRow, PanelBody } from "@wordpress/components";

import {
	InspectorControls,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";

import { withDispatch, withSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

import { compose } from "@wordpress/compose";
import metadata from "./block.json";
import {
	upgradeButtonLabel,
	mergeRichTextArray,
	getParentBlock,
} from "../../common";

registerBlockType("ub/table-of-contents", {
	title: __("Table of Contents"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Table of Contents"), __("Ultimate Blocks")],

	attributes: oldAttributes,
	supports: {
		inserter: false,
	},

	edit: compose([
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId,
			),
		})),
		withDispatch((dispatch) => ({
			replaceBlock: (dispatch("core/block-editor") || dispatch("core/editor"))
				.replaceBlock,
		})),
	])(function (props) {
		const { block, replaceBlock, isSelected, attributes, setAttributes } =
			props;
		const { allowedHeaders, showList, allowToCHiding } = attributes;
		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__("Allowed Headers")} initialOpen={true}>
						{allowedHeaders.map((a, i) => (
							<PanelRow>
								<label htmlFor={`ub_toggle_h${i + 1}`}>{`H${i + 1}`}</label>
								<ToggleControl
									id={`ub_toggle_h${i + 1}`}
									checked={a}
									onChange={() =>
										setAttributes({
											allowedHeaders: [
												...allowedHeaders.slice(0, i),
												!allowedHeaders[i],
												...allowedHeaders.slice(i + 1),
											],
										})
									}
								/>
							</PanelRow>
						))}
					</PanelBody>
					<PanelBody title={__("Additional Settings")} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub_toc_toggle_display">
								{__(
									"Allow users to toggle the visibility of the table of contents",
								)}
							</label>
							<ToggleControl
								id="ub_toc_toggle_display"
								checked={allowToCHiding}
								onChange={(allowToCHiding) =>
									setAttributes({
										allowToCHiding,
										showList: allowToCHiding ? showList : true,
									})
								}
							/>
						</PanelRow>
						{allowToCHiding && (
							<PanelRow>
								<label htmlFor="ub_show_toc">
									{__("Initially Show Table of Contents")}
								</label>
								<ToggleControl
									id="ub_show_toc"
									checked={showList}
									onChange={() => setAttributes({ showList: !showList })}
								/>
							</PanelRow>
						)}
					</PanelBody>
				</InspectorControls>
			),
			isSelected && blockControls(props),
			<div className="ub_table-of-contents">
				<button
					onClick={() => {
						const { title, ...otherAttributes } = props.attributes;
						replaceBlock(
							block.clientId,
							createBlock(
								"ub/table-of-contents-block",
								Object.assign(otherAttributes, {
									title: mergeRichTextArray(title),
								}),
							),
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				{editorDisplay(props)}
			</div>,
		];
	}),

	save(props) {
		const {
			links,
			title,
			allowedHeaders,
			showList,
			numColumns,
			allowToCHiding,
			listStyle,
		} = props.attributes;
		return (
			<div
				className="ub_table-of-contents"
				data-showText={__("show")}
				data-hideText={__("hide")}
			>
				{(title.length > 1 || (title.length === 1 && title[0] !== "")) && (
					<div className="ub_table-of-contents-header">
						<RichText.Content
							tagName="div"
							className="ub_table-of-contents-title"
							value={title}
						/>
						{allowToCHiding && (
							<div id="ub_table-of-contents-header-toggle">
								<div id="ub_table-of-contents-toggle">
									[
									<a className="ub_table-of-contents-toggle-link" href="#">
										{showList ? __("hide") : __("show")}
									</a>
									]
								</div>
							</div>
						)}
					</div>
				)}

				<TableOfContents
					listStyle={listStyle}
					numColumns={numColumns}
					style={{
						display:
							showList ||
							title.length === 0 ||
							(title.length === 1 && title[0] === "")
								? "block"
								: "none",
					}}
					allowedHeaders={allowedHeaders}
					headers={links && JSON.parse(links)}
				/>
			</div>
		);
	},
	deprecated: [
		updateFrom(version_1_0_8),
		updateFrom(version_1_0_9),
		updateFrom(version_1_1_3),
		updateFrom(version_1_1_5),
		updateFrom(version_1_1_6),
		updateFrom(version_1_1_8),
		updateFrom(version_2_0_0),
	],
});

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	attributes: metadata.attributes,
	example: {},
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select("core/block-editor") || select("core/editor");
			const block = getBlock(ownProps.clientId);
			const rootBlockClientId = getBlockRootClientId(block.clientId);

			return {
				block,
				rootBlockClientId,
			};
		}),
	])(function (props) {
		const {
			isSelected,
			block,
			attributes: { blockID, showList },
			rootBlockClientId,
		} = props;

		const [canRemoveItemFocus, toggleCanRemoveItemFocus] = useState(false);

		if (blockID === "") {
			props.setAttributes({ blockID: block.clientId });
		}
		useEffect(() => {
			const rootBlock = getParentBlock(rootBlockClientId, "core/block");
			if (!rootBlock) {
				props.setAttributes({ blockID: block.clientId });
			}
		}, [block?.clientId]);
		const blockProps = useBlockProps({
			className: `ub_table-of-contents${
				showList ? "" : " ub_table-of-contents-collapsed"
			}`,
			style: getStyles(props.attributes),
			id: `ub_table-of-contents-${blockID}`,
		});
		return [
			isSelected && inspectorControls(props),
			isSelected && blockControls(props),
			<div {...blockProps}>
				{editorDisplay({
					...props,
					canRemoveItemFocus,
					toggleCanRemoveItemFocus,
				})}
			</div>,
		];
	}),
	save: () => null,
});
