import React from 'react';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';

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
		<div className={'ub-upsell-inspector-notice'}>
			<div className={'ub-upsell-notice-icon-container'}>
				<img alt={'ub logo'} src={logoUrl} />
			</div>
			<div className={'ub-upsell-notice'}>
				<span>
					<span>{blockTitle}</span> has <span>PRO</span> enhancements.
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
