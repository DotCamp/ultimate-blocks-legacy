/**
 * BLOCK: number-box
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from "./icons/icon";

import { mergeRichTextArray, upgradeButtonLabel } from "../../common";
import { version_1_1_2, version_1_1_5, oldAttributes } from "./oldVersions";
import {
	blockControls,
	inspectorControls,
	editorDisplay,
	upgradeToStyledBox,
} from "./components";
import { useState } from "react";
import metadata from "./block.json";
import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";

import {
	useSelect,
	withDispatch,
	withSelect,
	useDispatch,
} from "@wordpress/data";

import { compose } from "@wordpress/compose";
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("ub/number-box", {
	title: __("Number Box"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Number box"), __("Feature"), __("Ultimate Blocks")],
	attributes: oldAttributes,

	supports: {
		inserter: false,
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
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
		const { isSelected, block, replaceBlock, attributes } = props;

		const [editable, setEditable] = useState("");

		return [
			isSelected && blockControls(props),

			isSelected && inspectorControls(props),

			<div className={props.className}>
				<button
					onClick={() => {
						const { column, columnOneBody } = attributes;

						let currentNumbers = [
							mergeRichTextArray(attributes.columnOneNumber),
						];
						let currentTitles = [mergeRichTextArray(attributes.columnOneTitle)];
						let currentTitleAligns = [attributes.title1Align];
						let currentTexts = [mergeRichTextArray(columnOneBody)];
						let currentTextAligns = [attributes.body1Align];

						if (parseInt(column) >= 2) {
							currentNumbers.push(
								mergeRichTextArray(attributes.columnTwoNumber),
							);
							currentTitles.push(mergeRichTextArray(attributes.columnTwoTitle));
							currentTitleAligns.push(attributes.title2Align);
							currentTexts.push(mergeRichTextArray(attributes.columnTwoBody));
							currentTextAligns.push(attributes.body2Align);
						}
						if (parseInt(column) === 3) {
							currentNumbers.push(
								mergeRichTextArray(attributes.columnThreeNumber),
							);
							currentTitles.push(
								mergeRichTextArray(attributes.columnThreeTitle),
							);
							currentTitleAligns.push(attributes.title3Align);
							currentTexts.push(mergeRichTextArray(attributes.columnThreeBody));
							currentTextAligns.push(attributes.body3Align);
						}

						replaceBlock(
							block.clientId,
							createBlock("ub/styled-box", {
								mode: "number",
								number: currentNumbers,
								title: currentTitles,
								titleAlign: currentTitleAligns,
								text: currentTexts,
								textAlign: currentTextAligns,
								backColor: attributes.numberBackground,
								foreColor: attributes.numberColor,
								outlineColor: attributes.borderColor,
							}),
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				{editorDisplay({ ...props, editable, setEditable })}
			</div>,
		];
	}),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function (props) {
		const {
			column,
			columnOneNumber,
			columnTwoNumber,
			columnThreeNumber,
			columnOneTitle,
			columnTwoTitle,
			columnThreeTitle,
			columnOneBody,
			columnTwoBody,
			columnThreeBody,
			numberBackground,
			numberColor,
			borderColor,
			title1Align,
			title2Align,
			title3Align,
			body1Align,
			body2Align,
			body3Align,
		} = props.attributes;

		return (
			<div className={props.className}>
				<div className={`ub_number_box column_${column}`}>
					<div
						className="ub_number_1"
						style={{
							borderColor: borderColor,
						}}
					>
						<div
							className="ub_number_box_number"
							style={{
								backgroundColor: numberBackground,
							}}
						>
							<p
								className="ub_number_one_number"
								style={{
									color: numberColor,
								}}
							>
								{columnOneNumber}
							</p>
						</div>
						<p
							className="ub_number_one_title"
							style={{ textAlign: title1Align }}
						>
							{columnOneTitle}
						</p>
						<p className="ub_number_one_body" style={{ textAlign: body1Align }}>
							{columnOneBody}
						</p>
					</div>
					<div
						className="ub_number_2"
						style={{
							borderColor: borderColor,
						}}
					>
						<div
							className="ub_number_box_number"
							style={{
								backgroundColor: numberBackground,
							}}
						>
							<p
								className="ub_number_two_number"
								style={{
									color: numberColor,
								}}
							>
								{columnTwoNumber}
							</p>
						</div>
						<p
							className="ub_number_two_title"
							style={{ textAlign: title2Align }}
						>
							{columnTwoTitle}
						</p>
						<p className="ub_number_two_body" style={{ textAlign: body2Align }}>
							{columnTwoBody}
						</p>
					</div>
					<div
						className="ub_number_3"
						style={{
							borderColor: borderColor,
						}}
					>
						<div
							className="ub_number_box_number"
							style={{
								backgroundColor: numberBackground,
							}}
						>
							<p
								className="ub_number_three_number"
								style={{
									color: numberColor,
								}}
							>
								{columnThreeNumber}
							</p>
						</div>
						<p
							className="ub_number_three_title"
							style={{ textAlign: title3Align }}
						>
							{columnThreeTitle}
						</p>
						<p
							className="ub_number_three_body"
							style={{ textAlign: body3Align }}
						>
							{columnThreeBody}
						</p>
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes: oldAttributes,
			save: version_1_1_2,
		},
		{
			attributes: oldAttributes,
			save: version_1_1_5,
		},
	],
});

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	transforms: {
		to: [
			{
				type: "block",
				blocks: "ub/styled-box",
				transform: (attributes) => upgradeToStyledBox(attributes),
			},
		],
	},

	edit: function (props) {
		const { isSelected, attributes } = props;
		const [editable, setEditable] = useState("");
		const blockProps = useBlockProps();

		const block = useSelect((select) =>
			select("core/block-editor").getBlock(props.clientId),
		);
		const { replaceBlock } = useDispatch("core/bock-editor");

		if (attributes.blockID === "") {
			props.setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && blockControls({ ...props, editable }),

			isSelected && inspectorControls(props),

			<div {...blockProps} className={props.className}>
				<button
					onClick={() =>
						replaceBlock(block.clientId, upgradeToStyledBox(attributes))
					}
				>
					{upgradeButtonLabel}
				</button>
				{editorDisplay({ ...props, setEditable })}
			</div>,
		];
	},
	save: () => null,
});
