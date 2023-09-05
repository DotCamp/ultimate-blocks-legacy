import React from 'react';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import { hideUpsellModal } from '$BlockStores/mainStore/actions';
import UpsellModalBase from '$Inc/components/Upsell/UpsellModalBase';

/**
 * Upsell modal component.
 *
 * @param {Object}   props                  component properties
 * @param {boolean}  props.modalVisibility  modal visibility status, will be supplied via HOC
 * @param {Function} props.closeModal       close modal window, will be supplied via HOC
 * @param {Object}   props.upsellData       upsell data to show, will be supplied via HOC
 * @param {string}   props.defaultFeatureSs default feature screenshot for empty replacements, will be supplied via HOC
 * @param {string}   props.proUrl           pro url, will be supplied via HOC
 * @param {Object}   props.activeBlockIcon  active block icon object
 * @function Object() { [native code] }
 */
function UpsellModalEditor( {
	modalVisibility,
	closeModal,
	upsellData,
	defaultFeatureSs,
	proUrl,
	activeBlockIcon,
} ) {
	return (
		<UpsellModalBase
			modalVisibility={ modalVisibility }
			closeModal={ closeModal }
			upsellData={ upsellData }
			defaultFeatureSs={ defaultFeatureSs }
			proUrl={ proUrl }
			targetBlockIcon={ activeBlockIcon }
		/>
	);
}

// main store selector mapping
const mainStoreSelectMapping = ( namespacedSelect ) => {
	const {
		upsellModalVisibilityStatus,
		getUpsellTargetExtensionInfoShow,
		getUpsellDataActiveBlock,
		getLogoUrl,
		getAssets,
		getActiveBlockIconObject,
	} = namespacedSelect;

	return {
		modalVisibility: upsellModalVisibilityStatus(),
		upsellData: getUpsellDataActiveBlock(
			getUpsellTargetExtensionInfoShow()
		),
		defaultFeatureSs: getLogoUrl(),
		proUrl: getAssets( 'proUrl' ),
		activeBlockIcon: getActiveBlockIconObject(),
	};
};

// main store action mapping
const mainStoreActionMapping = ( namespacedDispatch ) => {
	return {
		closeModal: hideUpsellModal( namespacedDispatch ),
	};
};

/**
 * @module UpsellModal
 */
export default connectWithMainStore(
	mainStoreSelectMapping,
	mainStoreActionMapping
)( UpsellModalEditor );
