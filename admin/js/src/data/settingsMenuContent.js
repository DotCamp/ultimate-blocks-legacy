import { __ } from '@wordpress/i18n';

/**
 * Content text data for settings menu.
 *
 * This object will be used for easy management of content texts.
 *
 * Base data format:
 * 	content-key: {
 * 	    title => content title
 * 	    content => main content
 * 	}
 *
 * @type {Object}
 */
const contentData = {
	welcome: {
		title: __( 'Welcome to Ultimate Blocks', 'ultimate-blocks' ),
		content: __(
			'All the essential Gutenberg blocks you need in one plugin!Ultimate Blocks comes with blocks to take your content to the next level!',
			'ultimate-blocks'
		),
	},
};

/**
 * @module contentData
 */
export default contentData;
