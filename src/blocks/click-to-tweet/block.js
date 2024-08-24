//Import Icon
import icon from "./icons/icon";
import { useEffect } from "react";
import { SpacingControl } from "../components";
import { getStyles } from "./get-styles";
import metadata from "./block.json";
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
	RichText,
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
} from "@wordpress/block-editor";
import { TextControl, RangeControl, PanelBody } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { getParentBlock } from "../../common";

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
	const { isSelected, setAttributes, attributes } = props;

	const { ubTweet, ubVia, tweetFontSize, tweetColor, borderColor, blockID } =
		attributes;
	const { block, rootBlockClientId } = useSelect((select) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(props.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			rootBlockClientId,
		};
	});
	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId }); //setting attributes via props.attributes is not working here
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
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
						<PanelBody
							title={__("Dimension Settings", "ultimate-blocks")}
							initialOpen={false}
						>
							<SpacingControl
								showByDefault
								attrKey="padding"
								label={__("Padding", "ultimate-blocks")}
							/>
							<SpacingControl
								minimumCustomValue={-Infinity}
								showByDefault
								attrKey="margin"
								label={__("Margin", "ultimate-blocks")}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			)}
			<div className={props.className}>
				<div className="ub_click_to_tweet" style={getStyles(attributes)}>
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
		</div>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	attributes: metadata.attributes,
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
	edit: ClickToTweet,

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
