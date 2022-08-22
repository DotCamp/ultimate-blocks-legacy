import initialState from "$Stores/settings-menu/initialState";
import { createSlice } from "@reduxjs/toolkit";

/**
 * Version control slice options.
 *
 * @type {Object}
 */
const versionControlSliceOptions = {
	name: 'versionControl',
	initialState: initialState.versionControl,
};

const versionControlSlice = createSlice( versionControlSliceOptions );

/**
 * Get plugin current version.
 * @param {Object} state store state
 * @return {string} current version
 */
export const currentVersion = ( state ) => {
	return state.versionControl.currentVersion;
};

/**
 * Get plugin current version.
 * @param {Object} state store state
 * @return {string} current version
 */
export const versions = ( state ) => {
	return state.versionControl.versions;
};

/**
 * @module versionControlSlice
 */
export default versionControlSlice.reducer;
