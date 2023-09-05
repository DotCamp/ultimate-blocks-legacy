import React from 'react';
import {
	getModalTargetBlockType,
	getModalVisibilityStatus,
} from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';
import UpsellModalBase from '$EditorComponents/Upsell/UpsellModalBase';

/**
 * For testing purposes only.
 *
 * @param {Object}  props             component properties
 * @param {string}  props.targetBlock target block id
 * @param {boolean} props.visibility  modal visibility status
 */
function UpsellModalSettingsMenu( { targetBlock, visibility } ) {
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

/**
 * @module UpsellModal
 */
export default withStore( UpsellModalSettingsMenu, selectMapping );
