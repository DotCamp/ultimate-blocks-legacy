/**
 * BLOCK: social-share
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

// Import Icons
import {
	FacebookIcon,
	TwitterIcon,
	LinkedInIcon,
	PinterestIcon,
	RedditIcon,
	GooglePlusIcon,
	TumblrIcon,
	icon
} from "./icons/icons";

// Import components
import Inspector from "./inspector";

// variables
const iconSizes = {
	normal: 20,
	medium: 30,
	large: 40
};

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { BlockControls, AlignmentToolbar } = wp.blockEditor || wp.editor;
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
registerBlockType("ub/social-share", {
	title: __("Social Share"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("social"), __("share"), __("Ultimate Blocks")],
	attributes: {
		blockID: {
			type: "string",
			default: ""
		},
		showFacebookIcon: {
			type: "boolean",
			default: true
		},
		showTwitterIcon: {
			type: "boolean",
			default: true
		},
		showLinkedInIcon: {
			type: "boolean",
			default: true
		},
		showPinterestIcon: {
			type: "boolean",
			default: true
		},
		showRedditIcon: {
			type: "boolean",
			default: true
		},
		showGooglePlusIcon: {
			type: "boolean",
			default: true
		},
		showTumblrIcon: {
			type: "boolean",
			default: true
		},
		iconSize: {
			type: "string",
			default: "normal"
		},
		iconShape: {
			type: "string",
			default: "circle"
		},
		align: {
			type: "string",
			default: "left"
		}
	},

	edit: withSelect((select, ownProps) => ({
		block: (select("core/block-editor") || select("core/editor")).getBlock(
			ownProps.clientId
		)
	}))(function(props) {
		const { attributes, setAttributes, isSelected, className, block } = props;

		const {
			blockID,
			showFacebookIcon,
			showGooglePlusIcon,
			showLinkedInIcon,
			showPinterestIcon,
			showRedditIcon,
			showTumblrIcon,
			showTwitterIcon,
			align,
			iconShape
		} = attributes;

		const iconSize = iconSizes[attributes.iconSize];

		if (blockID !== block.clientId) {
			setAttributes({
				blockID: block.clientId
			});
		}

		return [
			isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={align}
						onChange={newAlignment => setAttributes({ align: newAlignment })}
						controls={["left", "center", "right"]}
					/>
				</BlockControls>
			),
			isSelected && <Inspector {...props} />,
			<div id="ub-social-share-block-editor" className={className}>
				<div className={"social-share-icons align-icons-" + align}>
					{showFacebookIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#365899"
							}}
						>
							<FacebookIcon width={iconSize} height={iconSize} />
						</a>
					)}
					{showTwitterIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#1da1f2"
							}}
						>
							<TwitterIcon width={iconSize} height={iconSize} />
						</a>
					)}
					{showLinkedInIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#0073b1"
							}}
						>
							<LinkedInIcon width={iconSize} height={iconSize} />
						</a>
					)}
					{showPinterestIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#bd081c"
							}}
						>
							<PinterestIcon width={iconSize} height={iconSize} />
						</a>
					)}
					{showRedditIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#cee3f8"
							}}
						>
							<RedditIcon width={iconSize} height={iconSize} />
						</a>
					)}
					{showGooglePlusIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#db4437"
							}}
						>
							<GooglePlusIcon width={iconSize} height={iconSize} />
						</a>
					)}
					{showTumblrIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={"social-share-icon " + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: "#36465d"
							}}
						>
							<TumblrIcon width={iconSize} height={iconSize} />
						</a>
					)}
				</div>
			</div>
		];
	}),

	save: () => null
});
