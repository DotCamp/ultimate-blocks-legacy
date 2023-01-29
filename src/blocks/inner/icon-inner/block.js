import { __ } from '@wordpress/i18n';
import registerPluginBlock from '$Inc/registerPluginBlock';

registerPluginBlock('ub/icon-innerblock', {
	title: __('Icon', 'ultimate-blocks'),
	category: 'ultimateblocks',
	icon: 'tools',
	supports: {
		inserter: true,
	},
	edit: () => {
		return <i>icon inner block</i>;
	},
	save: () => {
		// TODO [ErdemBircan] to be implemented
	},
});
