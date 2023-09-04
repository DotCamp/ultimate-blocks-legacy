import { createSlice } from '@reduxjs/toolkit';
import { FILTER_TYPES } from '$Components/BlockStatusFilterControl';
import initialState from '$Stores/settings-menu/initialState';
import { isPluginPro } from '$Stores/settings-menu/slices/pluginStatus';

/**
 * App slice options
 *
 * @type {Object}
 */
const appSliceOptions = {
	name: 'app',
	initialState: initialState.app,
	reducers: {
		/**
		 * Set current filter value.
		 *
		 * @param {Object} state         slice state
		 * @param {Object} props         reducer properties
		 * @param {string} props.payload filter value
		 */
		setBlockFilter( state, { payload } ) {
			if ( Object.values( FILTER_TYPES ).includes( payload ) ) {
				state.blockFilter = payload;
			} else {
				throw new Error( 'invalid block filter type supplied' );
			}
		},
		/**
		 * Toggle showing info section for block controls.
		 *
		 * @param {Object} state slice state
		 */
		toggleShowBlockInfo( state ) {
			state.showBlockInfo = ! state.showBlockInfo;
		},
		showBlockModal( state, { payload } ) {
			state.upsellPopup.targetBlock = payload.blockType;
		},
	},
};

const appSlice = createSlice( appSliceOptions );

export const { setBlockFilter, toggleShowBlockInfo } = appSlice.actions;

/**
 * Get all application options.
 *
 * @param {Object} state store state
 * @return {Object} options
 */
export const getAllAppOptions = ( state ) => {
	return state.app;
};

/**
 * Get current block filter.
 *
 * @param {Object} state store state
 * @return {string} filter value
 */
export const getBlockFilter = ( state ) => {
	return state.app.blockFilter;
};

/**
 * Get block extra info show status.
 *
 * @param {Object} state store state
 * @return {boolean} status
 */
export const getBlockInfoShowStatus = ( state ) => {
	return state.app.showBlockInfo;
};

/**
 * Get plugin pro status.
 *
 * @param {Object} state store state
 * @return {boolean} status
 */
export const getProStatus = ( state ) => {
	// backward compatibility update
	// use isPluginPro selector in pluginStatus slice for future implementations
	return isPluginPro( state );
};

/**
 * Get target block type to show in modal.
 *
 * @param {Object} state store state
 * @return {null | string} block type, null for no selected blocks
 */
export const getModalTargetBlockType = ( state ) => {
	return state.app.upsellPopup.targetBlock;
};

/**
 * @module appSlice
 */
export default appSlice.reducer;
