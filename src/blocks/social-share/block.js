/**
 * BLOCK: my-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS
import './style.scss';
import './editor.scss';

// Import Icons
import { FacebookIcon, TwitterIcon, icon } from './icons/icons';

// Import components
import Inspector from './inspector';

// variables
const iconSizes = {
	normal: 20,
	medium: 30,
	large: 40,
};

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
	registerBlockType,
	BlockControls,
	AlignmentToolbar,
} = wp.blocks; // Import registerBlockType() from wp.blocks

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
registerBlockType( 'ub/social-share', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Social Share' ), // Block title.
	icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'widgets', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'social' ),
		__( 'share' ),
		__( 'widget' ),
	],

	edit: function( props ) {
		const toggleFacebookIcon = () => {
			props.setAttributes( { showFacebookIcon: ! props.attributes.showFacebookIcon } );
		};

		const toggleTwitterIcon = () => {
			props.setAttributes( { showTwitterIcon: ! props.attributes.showTwitterIcon } );
		};

		const onSizeChange = value => {
			props.setAttributes( { iconSize: value } );
		};

		const onShapeChange = value => {
			props.setAttributes( { iconShape: value } );
		};

		const iconSize = iconSizes[ props.attributes.iconSize ];

		const align = props.attributes.align;

		const controls = (
			<BlockControls key="controls">
				<AlignmentToolbar
					value={ align }
					onChange={ ( newAlignment ) => props.setAttributes( { align: newAlignment } ) }
					controls={ [ 'left', 'center', 'right' ] }
				/>
			</BlockControls>
		);

		return [
			!! props.focus && controls,
			!! props.focus && (
				<Inspector { ...{
					onSizeChange,
					onShapeChange,
					toggleFacebookIcon,
					toggleTwitterIcon,
					...props } } key="inspector-control" /> ),
			<div id="ub-social-share-block-editor" className={ props.className } key="block-editor">
				<div className={ 'social-share-icons ' + 'align-icons-' + props.attributes.align }>
					{ props.attributes.showFacebookIcon && <a
						href="#ub-social-share-block-editor"
						className={ 'social-share-icon ' + props.attributes.iconShape }
						style={ { width: ( iconSize * 1.5 ), height: ( iconSize * 1.5 ), backgroundColor: props.attributes.facebookIconBgColor } }>
						<FacebookIcon width={ iconSize } height={ iconSize } fillColor={ props.attributes.facebookIconTextColor } />
					</a> }
					{ props.attributes.showTwitterIcon && <a
						href="#ub-social-share-block-editor"
						className={ 'social-share-icon ' + props.attributes.iconShape }
						style={ { width: ( iconSize * 1.5 ), height: ( iconSize * 1.5 ), backgroundColor: props.attributes.twitterIconBgColor } }>
						<TwitterIcon width={ iconSize } height={ iconSize } fillColor={ props.attributes.twitterIconTextColor } />
					</a> }
				</div>
			</div>,
		];
	},

	save: function() {
		return null;
	},
} );
