import initialState from '$Stores/settings-menu/initialState';
import { createSlice } from '@reduxjs/toolkit';

/**
 * Plugin status slice.
 *
 * @type {Object}
 */
const pluginStatusSliceOptions = {
	name: 'pluginStatus',
	initialState: initialState.pluginStatus,
	reducers: {},
};

const pluginStatusSlice = createSlice(pluginStatusSliceOptions);

/**
 * Get plugin pro status.
 *
 * @param {Object} state store state
 * @return {boolean} plugin pro status
 */
export const isPluginPro = (state) => {
	return state.pluginStatus.isPro;
};

/**
 * @module pluginStatusSlice
 */
export default pluginStatusSlice.reducer;
