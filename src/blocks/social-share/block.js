/**
 * BLOCK: social-share
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS
import './style.scss';
import './editor.scss';

// Import Icons
import {
	FacebookIcon,
	TwitterIcon,
	LinkedInIcon,
	PinterestIcon,
	RedditIcon,
	GooglePlusIcon,
	TumblrIcon,
	icon,
} from './icons/icons';

// Import components
import Inspector from './inspector';

// variables
const iconSizes = {
	normal: 20,
	medium: 30,
	large: 40,
};

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const {
	BlockControls,
	AlignmentToolbar,
} = wp.editor;

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
registerBlockType('ub/social-share', {

	title: __('Social Share'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [
		__('social'),
		__('share'),
		__('Ultimate Blocks'),
	],

	edit: function (props) {
		const toggleFacebookIcon = () => {
			props.setAttributes({ showFacebookIcon: !props.attributes.showFacebookIcon });
		};

		const toggleTwitterIcon = () => {
			props.setAttributes({ showTwitterIcon: !props.attributes.showTwitterIcon });
		};

		const toggleLinkedInIcon = () => {
			props.setAttributes({ showLinkedInIcon: !props.attributes.showLinkedInIcon });
		};

		const togglePinterestIcon = () => {
			props.setAttributes({ showPinterestIcon: !props.attributes.showPinterestIcon });
		};

		const toggleRedditIcon = () => {
			props.setAttributes({ showRedditIcon: !props.attributes.showRedditIcon });
		};

		const toggleGooglePlusIcon = () => {
			props.setAttributes({ showGooglePlusIcon: !props.attributes.showGooglePlusIcon });
		};

		const toggleTumblrIcon = () => {
			props.setAttributes({ showTumblrIcon: !props.attributes.showTumblrIcon });
		};

		const onSizeChange = value => {
			props.setAttributes({ iconSize: value });
		};

		const onShapeChange = value => {
			props.setAttributes({ iconShape: value });
		};

		const iconSize = iconSizes[props.attributes.iconSize];

		const align = props.attributes.align;

		const controls = (
			<BlockControls key="controls">
				<AlignmentToolbar
					value={align}
					onChange={(newAlignment) => props.setAttributes({ align: newAlignment })}
					controls={['left', 'center', 'right']}
				/>
			</BlockControls>
		);

		return [
			props.isSelected && controls,
			props.isSelected && (
				<Inspector {...{
					onSizeChange,
					onShapeChange,
					toggleFacebookIcon,
					toggleTwitterIcon,
					toggleLinkedInIcon,
					togglePinterestIcon,
					toggleRedditIcon,
					toggleGooglePlusIcon,
					toggleTumblrIcon,
					...props
				}} key="inspector-control" />),
			<div id="ub-social-share-block-editor" className={props.className} key="block-editor">
				<div className={'social-share-icons ' + 'align-icons-' + props.attributes.align}>
					{props.attributes.showFacebookIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.facebookIconBgColor }}>
						<FacebookIcon width={iconSize} height={iconSize} fillColor={props.attributes.facebookIconTextColor} />
					</a>}
					{props.attributes.showTwitterIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.twitterIconBgColor }}>
						<TwitterIcon width={iconSize} height={iconSize} fillColor={props.attributes.twitterIconTextColor} />
					</a>}
					{props.attributes.showLinkedInIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.linkedInIconBgColor }}>
						<LinkedInIcon width={iconSize} height={iconSize} fillColor={props.attributes.linkedInIconTextColor} />
					</a>}
					{props.attributes.showPinterestIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.pinterestIconBgColor }}>
						<PinterestIcon width={iconSize} height={iconSize} fillColor={props.attributes.pinterestIconTextColor} />
					</a>}
					{props.attributes.showRedditIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.redditIconBgColor }}>
						<RedditIcon width={iconSize} height={iconSize} fillColor={props.attributes.redditIconTextColor} />
					</a>}
					{props.attributes.showGooglePlusIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.googlePlusIconBgColor }}>
						<GooglePlusIcon width={iconSize} height={iconSize} fillColor={props.attributes.googlePlusIconTextColor} />
					</a>}
					{props.attributes.showTumblrIcon && <a
						href="#ub-social-share-block-editor"
						className={'social-share-icon ' + props.attributes.iconShape}
						style={{ width: (iconSize * 1.5), height: (iconSize * 1.5), backgroundColor: props.attributes.tumblrIconBgColor }}>
						<TumblrIcon width={iconSize} height={iconSize} fillColor={props.attributes.tumblrIconTextColor} />
					</a>}
				</div>
			</div>,
		];
	},

	save: function () {
		return null;
	},
});
