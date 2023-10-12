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
	documentation: {
		title: __( 'Documentation', 'ultimate-blocks' ),
		content: __(
			'Find detailed documentation and usage instructions for all Ultimate Blocks features.',
			'ultimate-blocks'
		),
	},
	support: {
		title: __( 'Support', 'ultimate-blocks' ),
		content: __(
			'Need help or have questions? Our support team is here to assist you.',
			'ultimate-blocks'
		),
	},
	community: {
		title: __( 'Community', 'ultimate-blocks' ),
		content: __(
			'Join our community forums to connect with other users and share your experiences.',
			'ultimate-blocks'
		),
	},
	upgrade: {
		title: __( 'Upgrade to Ultimate Blocks PRO!', 'ultimate-blocks' ),
		content: __(
			'Unlock a world of enhanced capabilities and premium functionalities with Ultimate Blocks Pro. Upgrading allows you to access advanced tools and take your content to new heights. Experience the full potential of Ultimate Blocks Pro by upgrading now!',
			'ultimate-blocks'
		),
	},
};

/**
 * @module contentData
 */
export default contentData;
