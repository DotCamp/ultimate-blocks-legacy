//Import Icon
import icon from "./icons/icon";
import { useEffect } from "react";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, PanelColorSettings } =
	wp.blockEditor || wp.editor;

const { TextControl, RangeControl, PanelBody } = wp.components;

const { withSelect } = wp.data;

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

function ClickToTweet(props) {
	const {
		isSelected,
		setAttributes,
		block,
		getBlock,
		getClientIdsWithDescendants,
		attributes,
	} = props;

	const { ubTweet, ubVia, tweetFontSize, tweetColor, borderColor, blockID } =
		attributes;
	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId }); //setting attributes via props.attributes is not working here
		}
	}, []);

	return (
		<>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("General")}>
							<TextControl
								label={__("Twitter Username")}
								placeholder="@"
								value={ubVia}
								onChange={(value) => setAttributes({ ubVia: value })}
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody title={__("General")}>
							<RangeControl
								label={__("Font Size")}
								value={tweetFontSize}
								onChange={(value) => setAttributes({ tweetFontSize: value })}
								min={10}
								max={200}
								beforeIcon="editor-textcolor"
								allowReset
							/>
						</PanelBody>
						<PanelBody title={__("Colors")} initialOpen={false}>
							<PanelColorSettings
								title={__("Color Scheme")}
								initialOpen={false}
								colorSettings={[
									{
										value: tweetColor,
										onChange: (tweetColor) => setAttributes({ tweetColor }),
										label: __("Tweet Color"),
									},
									{
										value: borderColor,
										onChange: (borderColor) => setAttributes({ borderColor }),
										label: __("Border Color"),
									},
								]}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			)}
			<div className={props.className}>
				<div className="ub_click_to_tweet" style={{ borderColor: borderColor }}>
					<RichText
						style={{
							fontSize: tweetFontSize + "px",
							color: tweetColor || "inherit",
						}}
						placeholder={__("Add Tweetable Content Here")}
						className="ub_tweet"
						value={ubTweet}
						onChange={(value) => setAttributes({ ubTweet: value })}
					/>

					<div className="ub_click_tweet">
						<span>
							<i />
							{__("Click to Tweet")}
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

registerBlockType("ub/click-to-tweet", {
	title: __("Click to Tweet"),
	description: __(
		"Add tweetable content with this easy to use block.",
		"ultimate-blocks"
	),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Click to tweet"), __("Twitter"), __("Ultimate Blocks")],
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		ubTweet: {
			type: "string",
			default: "",
		},
		ubVia: {
			source: "meta",
			meta: "ub_ctt_via",
		},
		tweetFontSize: {
			type: "number",
			default: 20,
		},
		tweetColor: {
			type: "string",
			default: "",
		},
		borderColor: {
			type: "string",
			default: "#CCCCCC",
		},
	},
	example: {
		attributes: {
			ubTweet:
				"Ultimate Blocks helps you create better and engaging content with Gutenberg.",
		},
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(ClickToTweet),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save() {
		return null;
	},
});
