/**
 * BLOCK: tabbed-content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
    registerBlockType,
    InspectorControls,
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
    PanelBody,
    Toolbar,
    RangeControl,
    Dashicon
} = wp.components;
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
registerBlockType( 'ub/spacer', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Tabbed Content' ), // Block title.
	icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Tabbed' ),
		__( 'Tabs' ),
		__( 'Ultimate Blocks' ),
	],
	attributes: {
	},

	edit: function( props ) {

	},

	save: function( props ) {
	},
} );
