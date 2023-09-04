import React from 'react';
import {
	getModalTargetBlockType,
	getModalVisibilityStatus,
} from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';

/**
 * For testing purposes only.
 *
 * @param root0
 * @param root0.targetBlock
 * @param root0.visibility
 */
function UpsellModal( { targetBlock, visibility } ) {
	return visibility && <i>{ targetBlock }</i>;
}

const selectMapping = ( select ) => {
	return {
		targetBlock: select( getModalTargetBlockType ),
		visibility: select( getModalVisibilityStatus ),
	};
};

/**
 * @module UpsellModal
 */
export default withStore( UpsellModal, selectMapping );
