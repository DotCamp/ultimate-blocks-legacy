import deepmerge from 'deepmerge';

/**
 * Default store state.
 *
 * @type {Object}
 */
const defaultState = {
	storeName: null,
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
