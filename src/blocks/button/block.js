/**
 * BLOCK: Button Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from "./icons/icons";

import {
	version_1_1_2,
	version_1_1_4,
	version_1_1_5,
	version_2_0_0,
	oldAttributes,
	updateFrom,
} from "./oldVersions";

import {
	generateIcon,
	dashesToCamelcase,
	mergeRichTextArray,
	upgradeButtonLabel,
} from "../../common";
import {
	blockControls,
	inspectorControls,
	editorDisplay,
	iconSize,
	allIcons,
	EditorComponent,
} from "./components";

const { withDispatch, withSelect } = wp.data;

const { withState, compose } = wp.compose;
const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;

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
	buttonText: {
		type: "string",
		default: "Button Text",
	},
	align: {
		type: "string",
		default: "",
	},
	url: {
		type: "string",
		default: "",
	},
	size: {
		type: "string",
		default: "medium",
	},
	buttonColor: {
		type: "string",
		default: "#313131",
	},
	buttonHoverColor: {
		type: "string",
		default: "#313131",
	},
	buttonTextColor: {
		type: "string",
		default: "#ffffff",
	},
	buttonTextHoverColor: {
		type: "string",
		default: "#ffffff",
	},
	buttonRounded: {
		type: "boolean",
		default: false,
	},
	chosenIcon: {
		type: "string",
		default: "",
	},
	iconPosition: {
		type: "string",
		default: "left",
	},
	buttonIsTransparent: {
		type: "boolean",
		default: false,
	},
	addNofollow: {
		type: "boolean",
		default: true,
	},
	openInNewTab: {
		type: "boolean",
		default: true,
	},
	buttonWidth: {
		type: "string",
		default: "fixed",
	},
	buttons: {
		type: "array",
		default: [],
	},
};

registerBlockType("ub/button-block", {
	title: __("Button (Improved)", "ultimate-blocks"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [
		__("Button", "ultimate-blocks"),
		__("Buttons", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks"),
	],
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	attributes: oldAttributes,
	supports: {
		inserter: false, //this block is being phased out in favor of the PHP-rendered version
	},
	edit: compose([
		withState({
			isMouseHovered: false,
			availableIcons: [],
			iconSearchTerm: "",
		}),
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
		const {
			isSelected,
			setState,
			availableIcons,
			block,
			replaceBlock,
			attributes,
		} = props;

		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map((name) => allIcons[name]) });
		}

		return [
			//isSelected && blockControls(props), might no longer work

			//isSelected && inspectorControls(props), //might no longer work

			<div className={props.className}>
				<button
					onClick={() => {
						const { buttonText, ...otherAttributes } = attributes;
						replaceBlock(
							block.clientId,
							createBlock(
								"ub/button",
								Object.assign(otherAttributes, {
									buttonText: mergeRichTextArray(attributes.buttonText),
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
			buttonText,
			align,
			url,
			size,
			buttonColor,
			buttonTextColor,
			buttonHoverColor,
			buttonTextHoverColor,
			buttonRounded,
			chosenIcon,
			iconPosition,
			buttonIsTransparent,
			addNofollow,
			openInNewTab,
		} = props.attributes;

		return (
			<div
				className={`${props.className} ub-button-container align-button-${align}`}
			>
				<a
					href={url}
					target={openInNewTab ? "_blank" : "_self"}
					rel={`noopener noreferrer${addNofollow ? " nofollow" : ""}`}
					className={`ub-button-block-main ub-button-${size}`}
					data-defaultColor={buttonColor}
					data-defaultTextColor={buttonTextColor}
					data-hoverColor={buttonHoverColor}
					data-hoverTextColor={buttonTextHoverColor}
					data-buttonIsTransparent={buttonIsTransparent}
					style={{
						backgroundColor: buttonIsTransparent ? "transparent" : buttonColor,
						color: buttonIsTransparent ? buttonColor : buttonTextColor,
						borderRadius: buttonRounded ? "60px" : "0px",
						border: buttonIsTransparent ? `3px solid ${buttonColor}` : "none",
					}}
				>
					<div
						className="ub-button-content-holder"
						style={{
							flexDirection: iconPosition === "left" ? "row" : "row-reverse",
						}}
					>
						{chosenIcon !== "" &&
							allIcons.hasOwnProperty(`fa${dashesToCamelcase(chosenIcon)}`) && (
								<span className="ub-button-icon-holder">
									{generateIcon(
										allIcons[`fa${dashesToCamelcase(chosenIcon)}`],
										iconSize[size]
									)}
								</span>
							)}
						<span className={"ub-button-block-btn"}>{buttonText}</span>
					</div>
				</a>
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

registerBlockType("ub/button", {
	title: __("Button (Improved)", "ultimate-blocks"),
	icon: icon,
	category: "ultimateblocks",
	attributes,
	keywords: [
		__("Button", "ultimate-blocks"),
		__("Buttons", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks"),
	],
	edit: withSelect((select, ownProps) => {
		const { getBlock, getBlockRootClientId, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			getBlock,
			block: getBlock(ownProps.clientId),
			parentID: getBlockRootClientId(ownProps.clientId),
			getClientIdsWithDescendants,
		};
	})(EditorComponent),
	save: () => null,
});
