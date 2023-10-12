import { __ } from '@wordpress/i18n';

const defaultContent = __(
	'All the essential Gutenberg blocks you need in one plugin! Ultimate Blocks comes with blocks to take your content to the next level!',
	'ultimate-blocks'
);

/**
 * Content text data for settings menu.
 *
 * This object will be used for easy management of content texts.
 *
 * Base data format:
 *    content-key: {
 *        title => content title
 *        content => main content
 *    }
 *
 * @type {Object}
 */
const contentData = {
	welcome: {
		title: __( 'Welcome to Ultimate Blocks', 'ultimate-blocks' ),
		content: defaultContent,
	},
	upgrade: {
		title: __( 'Upgrade to Ultimate Blocks PRO!', 'ultimate-blocks' ),
		content: defaultContent,
	},
	documentation: {
		title: __( 'Documentation', 'ultimate-blocks' ),
		content: defaultContent,
	},
	support: {
		title: __( 'Support', 'ultimate-blocks' ),
		content: defaultContent,
	},
	community: {
		title: __( 'Community', 'ultimate-blocks' ),
		content: defaultContent,
	},
};

/**
 * @module contentData
 */
export default contentData;
