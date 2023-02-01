import { __ } from '@wordpress/i18n';
import registerPluginBlock from '$Inc/registerPluginBlock';
import UbIcon from './components/UbIcon';
import { UbIconComponent } from '$Library/ub-common/Components';

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

		return <UbIconComponent iconName={iconName} size={size} />;
	},
});
