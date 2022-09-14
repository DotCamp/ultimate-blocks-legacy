import deepmerge from 'deepmerge';

/**
 * Default store state.
 *
 * @type {Object}
 */
const defaultState = {
	storeName: null,
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
