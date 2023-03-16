import React from 'react';
import { __ } from '@wordpress/i18n';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import VitalizeText from '$Inc/components/Upsell/VitalizeText';

/**
 * Upsell inspector notice for pro features available for current active block.
 *
 * @param {Object} props            component properties
 * @param {string} props.blockTitle block title
 * @param {string} props.logoUrl    logo url, will be supplied via HOC
 * @function Object() { [native code] }
 */
function UpsellInspectorNotice({ blockTitle, logoUrl }) {
	return (
		<div
			className={'ub-upsell-inspector-notice'}
			title={__('click for more info', 'ultimate-blocks')}
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

/**
 * @module UpsellInspectorNotice
 */
export default connectWithMainStore(selectMapping, null)(UpsellInspectorNotice);
