import icon from "./icons/icon";

import {
	version_1_1_2,
	version_1_1_4,
	version_1_1_5,
	version_2_0_0,
	oldAttributes,
	updateFrom,
} from "./oldVersions";

import { blockControls, inspectorControls, editorDisplay } from "./components";
import { mergeRichTextArray, upgradeButtonLabel } from "../../common";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;

const { withDispatch, withSelect } = wp.data;

const { withState, compose } = wp.compose;

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

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	ub_call_to_action_headline_text: {
		type: "string",
		default: "",
	},
	ub_cta_content_text: {
		type: "string",
		default: "",
	},
	ub_cta_button_text: {
		type: "string",
		default: "",
	},
	headFontSize: {
		type: "number",
		default: 30,
	},
	headColor: {
		type: "string",
		default: "",
	},
	headAlign: {
		type: "string",
		default: "center",
	},
	contentFontSize: {
		type: "number",
		default: 15,
	},
	contentColor: {
		type: "string",
		default: "",
	},
	buttonFontSize: {
		type: "number",
		default: 14,
	},
	buttonColor: {
		type: "string",
		default: "#E27330",
	},
	buttonTextColor: {
		type: "string",
		default: "",
	},
	buttonWidth: {
		type: "number",
		default: 250,
	},
	ctaBackgroundColor: {
		type: "string",
		default: "#f8f8f8",
	},
	ctaBorderColor: {
		type: "string",
		default: "#ECECEC",
	},
	ctaBorderSize: {
		type: "number",
		default: 2,
	},
	url: {
		type: "string",
		default: "",
	},
	contentAlign: {
		type: "string",
		default: "center",
	},
	addNofollow: {
		type: "boolean",
		default: false,
	},
	openInNewTab: {
		type: "boolean",
		default: false,
	},
	linkIsSponsored: {
		type: "boolean",
		default: false,
	},
	useHeadingTag: {
		type: "boolean",
		default: false,
	},
	selectedHeadingTag: {
		type: "string",
		default: "h2",
	},
};

registerBlockType("ub/call-to-action", {
	title: __("Call to Action", "ultimate-blocks"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [
		__("call to action", "ultimate-blocks"),
		__("conversion", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks"),
	],
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
		const { isSelected, block, replaceBlock } = props;

		return [
			isSelected && blockControls(props),

			isSelected && inspectorControls(props),

			<div className={props.className}>
				<button
					onClick={() => {
						const {
							ub_call_to_action_headline_text,
							ub_cta_content_text,
							ub_cta_button_text,
							url,
							...otherAttributes
						} = props.attributes;
						replaceBlock(
							block.clientId,
							createBlock(
								"ub/call-to-action-block",
								Object.assign(otherAttributes, {
									ub_call_to_action_headline_text: mergeRichTextArray(
										ub_call_to_action_headline_text
									),
									ub_cta_content_text: mergeRichTextArray(ub_cta_content_text),

									ub_cta_button_text: mergeRichTextArray(ub_cta_button_text),
									url: url,
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
			ctaBackgroundColor,
			ctaBorderSize,
			ctaBorderColor,
			headFontSize,
			headColor,
			headAlign,
			ub_call_to_action_headline_text,
			contentFontSize,
			contentColor,
			contentAlign,
			ub_cta_content_text,
			buttonColor,
			buttonWidth,
			url,
			buttonTextColor,
			buttonFontSize,
			ub_cta_button_text,
			addNofollow,
			openInNewTab,
		} = props.attributes;
		return (
			<div className={props.className}>
				<div
					className="ub_call_to_action"
					style={{
						backgroundColor: ctaBackgroundColor,
						border: ctaBorderSize + "px solid",
						borderColor: ctaBorderColor,
					}}
				>
					<div className="ub_call_to_action_headline">
						<p
							className="ub_call_to_action_headline_text"
							style={{
								fontSize: headFontSize + "px",
								color: headColor,
								textAlign: headAlign,
							}}
						>
							{ub_call_to_action_headline_text}
						</p>
					</div>
					<div className="ub_call_to_action_content">
						<p
							className="ub_cta_content_text"
							style={{
								fontSize: contentFontSize + "px",
								color: contentColor,
								textAlign: contentAlign,
							}}
						>
							{ub_cta_content_text}
						</p>
					</div>
					<div className="ub_call_to_action_button">
						<a
							href={url}
							target={openInNewTab ? "_blank" : "_self"}
							rel={`${addNofollow ? "nofollow " : ""}noopener noreferrer`}
							className={`wp-block-button ub_cta_button`}
							style={{
								backgroundColor: buttonColor,
								width: buttonWidth + "px",
							}}
						>
							<p
								className="ub_cta_button_text"
								style={{
									color: buttonTextColor,
									fontSize: buttonFontSize + "px",
								}}
							>
								{ub_cta_button_text}
							</p>
						</a>
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		updateFrom(version_1_1_2),
		updateFrom(version_1_1_4),
		updateFrom(version_1_1_5),
		updateFrom(version_2_0_0),
	],
});

registerBlockType("ub/call-to-action-block", {
	title: __("Call to Action", "ultimate-blocks"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [
		__("call to action", "ultimate-blocks"),
		__("conversion", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks"),
	],
	attributes,
	edit: compose([
		withState({ editable: "" }),
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
			block,
			getBlock,
			getClientIdsWithDescendants,
			setAttributes,
		} = props;

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && blockControls(props),

			isSelected && inspectorControls(props),

			<div className={props.className}>{editorDisplay(props)}</div>,
		];
	}),
	save: () => null,
});
