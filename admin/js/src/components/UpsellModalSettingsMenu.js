import React from 'react';
import {
	getModalTargetBlockType,
	getModalVisibilityStatus,
	hideProBlockUpsellModal,
} from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';
import UpsellModalBase from '$EditorComponents/Upsell/UpsellModalBase';

/**
 * Upsell modal window for settings menu.
 *
 * @param {Object}   props                  component properties
 * @param {string}   props.targetBlock      target block id
 * @param {boolean}  props.visibility       modal visibility status, will be supplied via HOC
 * @param {Function} props.closeModalWindow close modal window, will be supplied via HOC
 */
function UpsellModalSettingsMenu( {
	targetBlock,
	visibility,
	closeModalWindow,
} ) {
	const testData = {
		'ub/coupon': {
			name: 'Coupon',
			description: 'test description',
			imageUrl: null,
		},
	};

	return (
		<UpsellModalBase
			upsellData={ testData }
			modalVisibility={ visibility }
			closeModal={ closeModalWindow }
		/>
	);
}

// store select mapping
const selectMapping = ( select ) => {
	return {
		targetBlock: select( getModalTargetBlockType ),
		visibility: select( getModalVisibilityStatus ),
	};
};

// store action mapping
const actionMapping = () => {
	return {
		closeModalWindow: hideProBlockUpsellModal,
	};
};

/**
 * @module UpsellModal
 */
export default withStore(
	UpsellModalSettingsMenu,
	selectMapping,
	actionMapping
);
