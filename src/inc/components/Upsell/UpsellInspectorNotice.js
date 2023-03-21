import React from 'react';
import { __ } from '@wordpress/i18n';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import VitalizeText from '$Inc/components/Upsell/VitalizeText';
import { showExtensionInfo } from '$BlockStores/mainStore/actions';

/**
 * Upsell inspector notice for pro features available for current active block.
 *
 * @param {Object}   props            component properties
 * @param {string}   props.blockTitle block title
 * @param {string}   props.logoUrl    logo url, will be supplied via HOC
 * @param {Function} props.showInfo   show info for block extension features
 * @function Object() { [native code] }
 */
function UpsellInspectorNotice({ blockTitle, logoUrl, showInfo }) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			className={'ub-upsell-inspector-notice'}
			title={__('click for more info', 'ultimate-blocks')}
			onClick={() => {
				// TODO [ErdemBircan] remove for production
				console.log('clicked');
				showInfo();
			}}
		>
			<div className={'ub-upsell-notice-icon-container'}>
				<img alt={'ub logo'} src={logoUrl} />
			</div>
			<div className={'ub-upsell-notice'}>
				<span>
					<VitalizeText>{blockTitle}</VitalizeText> has{' '}
					<VitalizeText>PRO</VitalizeText> enhancements.
				</span>
			</div>
		</div>
	);
}

// main store selector mapping
const selectMapping = (namespacedSelect) => {
	const { getLogoUrl } = namespacedSelect;

	return { logoUrl: getLogoUrl() };
};

// main store action mapping
const actionMapping = (namespacedDispatch) => {
	return {
		showInfo: () => showExtensionInfo(namespacedDispatch)(),
	};
};

/**
 * @module UpsellInspectorNotice
 */
export default connectWithMainStore(
	selectMapping,
	actionMapping
)(UpsellInspectorNotice);
