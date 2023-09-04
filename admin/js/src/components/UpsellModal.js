import React from 'react';
import { getModalTargetBlockType } from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';

/**
 * For testing purposes only.
 *
 * @param root0
 * @param root0.targetBlock
 */
function UpsellModal( { targetBlock } ) {
	return <i>{ targetBlock }</i>;
}

const selectMapping = ( select ) => {
	return {
		targetBlock: select( getModalTargetBlockType ),
	};
};

/**
 * @module UpsellModal
 */
export default withStore( UpsellModal, selectMapping );
