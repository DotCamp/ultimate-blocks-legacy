import { __ } from '@wordpress/i18n';
import registerPluginBlock from '$Inc/registerPluginBlock';
import UbIcon from './components/UbIcon';

registerPluginBlock('ub/icon-innerblock', {
	title: __('Icon', 'ultimate-blocks'),
	category: 'ultimateblocks',
	icon: 'dashicons-admin-tools',
	supports: {
		inserter: true,
	},
	edit: (props) => {
		const { attributes, setAttributes } = props;
		const { iconName, size } = attributes;

		return (
			<UbIcon
				size={size}
				iconName={iconName}
				setAttributes={setAttributes}
			/>
		);
	},
	save: () => {
		return <i>icon inner block</i>;
	},
});
