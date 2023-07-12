import deepmerge from 'deepmerge';
import { currentMode } from '$Inc/helpers/modeCheck';

/**
 * Default store state.
 *
 * @type {Object}
 */
const defaultState = {
	storeName: null,
	mode: currentMode(),
	app: {
		upsell: {
			upsellModalVisibility: false,
			targetExtensionInfoShow: null,
			targetBlockInfoShow: null,
		},
	},
};

/**
 * Create state.
 *
 * @param {Object} [extraState={}] extra state to use
 */
const createStore = (extraState = {}) => {
	return deepmerge(defaultState, extraState);
};

/**
 * @module createStore
 */
export default createStore;
