import { createSelector, createSlice } from '@reduxjs/toolkit';

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

const assetsSlice = createSlice(assetsSliceOptions);

/**
 * Get logo url.
 *
 * @param {Object} state store state
 * @return {string} logo url
 */
export const getLogo = (state) => {
	return state.assets.logo;
};

/**
 * Get ajax information.
 *
 * @param {Object} state store state
 * @return {Object} ajax information
 */
export const getAjaxInfo = (state) => {
	return state.assets.ajax;
};

/* eslint-disable-next-line jsdoc/require-param */
/**
 * Get asset with given id.
 */
export const getAsset = createSelector(
	[(state) => state.assets, (assets, assetId) => assetId],
	(assets, assetId) => assets?.[assetId]
);

/**
 * @module assetsSlice
 */
export default assetsSlice.reducer;
