/**
 * Store selectors.
 *
 * @type {Object}
 */
const selectors = {
	/**
	 * Name of store.
	 *
	 * @param {Object} state store state
	 * @return {null | string} store name
	 */
	getStoreName(state) {
		return state.storeName;
	},
};

/**
 * @module selectors
 */
export default selectors;
