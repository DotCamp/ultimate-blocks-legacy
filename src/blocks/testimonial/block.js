import icons from "./icons";
import {
	version_1_1_2,
	version_1_1_5,
	oldAttributes,
	updateFrom,
} from "./oldVersions";
import metadata from "./block.json";
import { blockControls, inspectorControls, editorDisplay } from "./components";
import { mergeRichTextArray, upgradeButtonLabel } from "../../common";
import { useEffect, useState } from "react";

import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";

import { compose } from "@wordpress/compose";

import { withDispatch, withSelect, useSelect } from "@wordpress/data";
import { useBlockProps } from "@wordpress/block-editor";
import { getStyles } from "./get-styles";
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
registerBlockType("ub/testimonial-block", {
	title: __("Testimonial"),
	icon: icons.testimonial,
	category: "ultimateblocks",
	keywords: [__("testimonial"), __("quotes"), __("Ultimate Blocks")],
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
				ownProps.clientId
			),
		})),
		withDispatch((dispatch) => ({
			replaceBlock: (dispatch("core/block-editor") || dispatch("core/editor"))
				.replaceBlock,
		})),
	])(function (props) {
		const { isSelected, attributes, block, replaceBlock } = props;

		const [editable, setEditable] = useState("");
		const [activeAlignment, setActiveAlignment] = useState(false);

		function setState(state) {
			if (state.hasOwnProperty("editable")) {
				setEditable(state.editable);
			}
			if (state.hasOwnProperty("activeAlignment")) {
				setActiveAlignment(state.activeAlignment);
			}
		}

		return (
			<>
				{isSelected &&
					blockControls({
						...props,
						editable,
						activeAlignment,
						setState,
					})}
				{isSelected && inspectorControls(props)}
				<div className={props.className}>
					<button
						onClick={() => {
							const {
								ub_testimonial_author,
								ub_testimonial_author_role,
								ub_testimonial_text,
								...otherAttributes
							} = attributes;
							replaceBlock(
								block.clientId,
								createBlock(
									"ub/testimonial",
									Object.assign(otherAttributes, {
										ub_testimonial_author: mergeRichTextArray(
											ub_testimonial_author
										),
										ub_testimonial_author_role: mergeRichTextArray(
											ub_testimonial_author_role
										),
										ub_testimonial_text:
											mergeRichTextArray(ub_testimonial_text),
									})
								)
							);
						}}
					>
						{upgradeButtonLabel}
					</button>
					{editorDisplay({
						...props,
						editable,
						activeAlignment,
						setState,
					})}
				</div>
			</>
		);
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
			backgroundColor,
			textColor,
			textSize,
			imgURL,
			imgAlt,
			ub_testimonial_author,
			ub_testimonial_author_role,
			ub_testimonial_text,
			textAlign,
			authorAlign,
			authorRoleAlign,
		} = props.attributes;
		return (
			<div className={props.className}>
				<div
					className="ub_testimonial"
					style={{
						backgroundColor: backgroundColor,
						color: textColor || "inherit",
					}}
				>
					<div className="ub_testimonial_img">
						<img src={imgURL} alt={imgAlt} height={100} width={100} />
					</div>
					<div className="ub_testimonial_content">
						<p
							className="ub_testimonial_text"
							style={{
								fontSize: textSize,
								textAlign: textAlign,
							}}
						>
							{ub_testimonial_text}
						</p>
					</div>
					<div className="ub_testimonial_sign">
						<p
							className="ub_testimonial_author"
							style={{ textAlign: authorAlign }}
						>
							{ub_testimonial_author}
						</p>
						<p
							className="ub_testimonial_author_role"
							style={{ textAlign: authorRoleAlign }}
						>
							{ub_testimonial_author_role}
						</p>
					</div>
				</div>
			</div>
		);
	},
	deprecated: [updateFrom(version_1_1_2), updateFrom(version_1_1_5)],
});

registerBlockType(metadata, {
	icon: icons.testimonial,
	attributes: metadata.attributes,
	example: {},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function (props) {
		const {
			attributes: { blockID },
			isSelected,
			className,
		} = props;
		const blockProps = useBlockProps();
		const [editable, setEditable] = useState("");
		const [activeAlignment, setActiveAlignment] = useState(false);
		const {
			block,
			getBlock,
			parentID,
			getClientIdsWithDescendants,
			getBlocks,
		} = useSelect((select) => {
			const {
				getBlock,
				getBlockRootClientId,
				getClientIdsWithDescendants,
				getBlocks,
			} = select("core/block-editor") || select("core/editor");

			return {
				getBlock,
				block: getBlock(props.clientId),
				parentID: getBlockRootClientId(props.clientId),
				getClientIdsWithDescendants,
				getBlocks,
			};
		});
		useEffect(() => {
			if (blockID === "") {
				props.setAttributes({ blockID: block.clientId });
			}
		}, []);
		useEffect(() => {
			props.setAttributes({ blockID: block.clientId });
		}, [block.clientId]);

		function setState(state) {
			if (state.hasOwnProperty("editable")) {
				setEditable(state.editable);
			}
			if (state.hasOwnProperty("activeAlignment")) {
				setActiveAlignment(state.activeAlignment);
			}
		}

		return (
			<div {...blockProps}>
				{isSelected &&
					blockControls({
						...props,
						editable,
						activeAlignment,
						setState,
					})}

				{isSelected && inspectorControls(props)}

				<div className={className}>
					{editorDisplay({
						...props,
						editable,
						activeAlignment,
						setState,
					})}
				</div>
			</div>
		);
	},
	save: () => null,
});
