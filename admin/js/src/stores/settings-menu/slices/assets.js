import { createSlice } from "@reduxjs/toolkit";

/**
 * Options for asset store slice
 * @type {Object}
 */
const assetsSliceOptions = {
	name: 'assets',
	initialState: {
		logo: '',
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
 * @module assetsSlice
 */
export default assetsSlice.reducer;
