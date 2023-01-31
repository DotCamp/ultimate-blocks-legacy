import { __ } from '@wordpress/i18n';
import registerPluginBlock from '$Inc/registerPluginBlock';
import UbIcon from './components/UbIcon';
import UbIconComponent from './components/UbIconComponent';
import { getIconPrefix } from './inc/iconOperations';

registerPluginBlock('ub/icon-innerblock', {
	title: __('Icon', 'ultimate-blocks'),
	category: 'ultimateblocks',
	icon: 'dashicons-admin-tools',
	supports: {
		inserter: false,
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
	save: ({ attributes }) => {
		const { iconName, size } = attributes;

		return (
			<UbIconComponent
				prefix={getIconPrefix(iconName)}
				iconName={iconName}
				size={size}
			/>
		);
	},
});
