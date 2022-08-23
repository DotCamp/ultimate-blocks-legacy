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
 * Get ajax operations info.
 * @param {Object} state store state
 * @return {Object} ajax info
 */
export const ajaxInfo = ( state ) => {
	return state.versionControl.ajax;
};

/**
 * @module versionControlSlice
 */
export default versionControlSlice.reducer;
