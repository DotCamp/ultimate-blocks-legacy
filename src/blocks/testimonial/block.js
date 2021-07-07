import icons from "./icons";
import {
	version_1_1_2,
	version_1_1_5,
	oldAttributes,
	updateFrom,
} from "./oldVersions";

import { blockControls, inspectorControls, editorDisplay } from "./components";
import { mergeRichTextArray, upgradeButtonLabel } from "../../common";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, createBlock } = wp.blocks;

const { withState, compose } = wp.compose;

const { withDispatch, withSelect } = wp.data;

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	ub_testimonial_text: {
		type: "string",
		default: "",
	},
	textAlign: {
		type: "string",
		default: "justify",
	},
	ub_testimonial_author: {
		type: "string",
		default: "",
	},
	authorAlign: {
		type: "string",
		default: "right",
	},
	ub_testimonial_author_role: {
		type: "string",
		default: "",
	},
	authorRoleAlign: {
		type: "string",
		default: "right",
	},
	imgURL: {
		type: "string",
		default: "",
	},
	imgID: {
		type: "number",
	},
	imgAlt: {
		type: "string",
		default: "",
	},
	backgroundColor: {
		type: "string",
		default: "#f4f6f6",
	},
	textColor: {
		type: "string",
		default: "",
	},
	textSize: {
		type: "number",
		default: 17,
	},
};

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
		withState({ editable: "" }),
	])(function (props) {
		const { isSelected, attributes, block, replaceBlock } = props;

		return [
			isSelected && blockControls(props),

			isSelected && inspectorControls(props),

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
									ub_testimonial_text: mergeRichTextArray(ub_testimonial_text),
								})
							)
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				{editorDisplay(props)}
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

registerBlockType("ub/testimonial", {
	title: __("Testimonial"),
	icon: icons.testimonial,
	category: "ultimateblocks",
	keywords: [__("testimonial"), __("quotes"), __("Ultimate Blocks")],
	attributes,

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: compose([
		withState({ editable: "", activeAlignment: false }),
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
	])(function (props) {
		const {
			attributes: { blockID },
			isSelected,
			className,
			block,
			getBlock,
			getClientIdsWithDescendants,
		} = props;

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			props.setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && blockControls(props),

			isSelected && inspectorControls(props),

			<div className={className}>{editorDisplay(props)}</div>,
		];
	}),
	save: () => null,
});
