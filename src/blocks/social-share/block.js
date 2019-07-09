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
	icon
} from './icons/icons';

// Import components
import Inspector from './inspector';

// variables
const iconSizes = {
	normal: 20,
	medium: 30,
	large: 40
};

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { BlockControls, AlignmentToolbar } = wp.editor;

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
	keywords: [__('social'), __('share'), __('Ultimate Blocks')],

	edit: function(props) {
		const { attributes, setAttributes, isSelected, className } = props;

		const {
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

		const toggleFacebookIcon = () => {
			setAttributes({ showFacebookIcon: !showFacebookIcon });
		};

		const toggleTwitterIcon = () => {
			setAttributes({ showTwitterIcon: !showTwitterIcon });
		};

		const toggleLinkedInIcon = () => {
			setAttributes({ showLinkedInIcon: !showLinkedInIcon });
		};

		const togglePinterestIcon = () => {
			setAttributes({ showPinterestIcon: !showPinterestIcon });
		};

		const toggleRedditIcon = () => {
			setAttributes({ showRedditIcon: !showRedditIcon });
		};

		const toggleGooglePlusIcon = () => {
			setAttributes({ showGooglePlusIcon: !showGooglePlusIcon });
		};

		const toggleTumblrIcon = () => {
			setAttributes({ showTumblrIcon: !showTumblrIcon });
		};

		const onSizeChange = value => {
			setAttributes({ iconSize: value });
		};

		const onShapeChange = value => {
			setAttributes({ iconShape: value });
		};

		const iconSize = iconSizes[attributes.iconSize];

		const controls = (
			<BlockControls key="controls">
				<AlignmentToolbar
					value={align}
					onChange={newAlignment =>
						setAttributes({ align: newAlignment })
					}
					controls={['left', 'center', 'right']}
				/>
			</BlockControls>
		);

		return [
			isSelected && controls,
			isSelected && (
				<Inspector
					{...{
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
					}}
				/>
			),
			<div id="ub-social-share-block-editor" className={className}>
				<div className={'social-share-icons align-icons-' + align}>
					{showFacebookIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: attributes.facebookIconBgColor
							}}
						>
							<FacebookIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.facebookIconTextColor}
							/>
						</a>
					)}
					{showTwitterIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: attributes.twitterIconBgColor
							}}
						>
							<TwitterIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.twitterIconTextColor}
							/>
						</a>
					)}
					{showLinkedInIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: attributes.linkedInIconBgColor
							}}
						>
							<LinkedInIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.linkedInIconTextColor}
							/>
						</a>
					)}
					{showPinterestIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: attributes.pinterestIconBgColor
							}}
						>
							<PinterestIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.pinterestIconTextColor}
							/>
						</a>
					)}
					{showRedditIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: attributes.redditIconBgColor
							}}
						>
							<RedditIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.redditIconTextColor}
							/>
						</a>
					)}
					{showGooglePlusIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor:
									attributes.googlePlusIconBgColor
							}}
						>
							<GooglePlusIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.googlePlusIconTextColor}
							/>
						</a>
					)}
					{showTumblrIcon && (
						<a
							href="#ub-social-share-block-editor"
							className={'social-share-icon ' + iconShape}
							style={{
								width: iconSize * 1.5,
								height: iconSize * 1.5,
								backgroundColor: attributes.tumblrIconBgColor
							}}
						>
							<TumblrIcon
								width={iconSize}
								height={iconSize}
								fillColor={attributes.tumblrIconTextColor}
							/>
						</a>
					)}
				</div>
			</div>
		];
	},

	save: function() {
		return null;
	}
});
