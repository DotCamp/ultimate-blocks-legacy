import { createSlice } from '@reduxjs/toolkit';

/**
 * Options for asset store slice
 *
 * @type {Object}
 */
const assetsSliceOptions = {
	name: 'assets',
	initialState: {
		logo: '',
		ajax: {},
	},
};

const assetsSlice = createSlice( assetsSliceOptions );

/**
 * Get logo url.
 *
 * @param {Object} state store state
 * @return {string} logo url
 */
export const getLogo = ( state ) => {
	return state.assets.logo;
};

/**
 * Get ajax information.
 *
 * @param {Object} state store state
 * @return {Object} ajax information
 */
export const getAjaxInfo = ( state ) => {
	return state.assets.ajax;
};

/**
 * Get asset with given id.
 *
 * @param {Object} state store state
 * @return {function(string): string|number} function to get asset
 */
export const getAsset = ( state ) => ( assetId ) => {
	return state.assets?.[ assetId ];
};

/**
 * @module assetsSlice
 */
export default assetsSlice.reducer;
