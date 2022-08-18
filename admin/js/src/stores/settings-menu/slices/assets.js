import { createSlice } from "@reduxjs/toolkit";

/**
 * Options for asset store slice
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
 * @param {Object} state store state
 * @returns {string} logo url
 */
export const getLogo = ( state ) => {
	return state.assets.logo;
};

/**
 * Get ajax information.
 * @param {Object} state store state
 * @returns {Object} ajax information
 */
export const getAjaxInfo = ( state ) => {
	return state.assets.ajax;
};

/**
 * @module assetsSlice
 */
export default assetsSlice.reducer;
