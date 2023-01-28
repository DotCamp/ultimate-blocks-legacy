import { __ } from '@wordpress/i18n';
import registerPluginBlock from '$Inc/registerPluginBlock';

/**
 * Block attributes.
 *
 * @type {Object}
 */
const attributes = {
	iconName: {
		type: 'string',
		default: '',
	},
};

registerPluginBlock('ub-innerblock/icon', {
	title: __('Icon', 'ultimate-blocks'),
	category: 'ultimateblocks',
	icon: 'tools',
	attributes: {},
	supports: {
		inserter: false,
	},
	edit: () => {
		return <i>icon inner block</i>;
	},
	save: () => {
		// TODO [ErdemBircan] to be implemented
	},
});
