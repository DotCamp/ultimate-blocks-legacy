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

	/**
	 * Get default attributes for target block type.
	 *
	 * @param {Object} state     store state
	 * @param {string} blockType block type
	 * @return {Array | null} block default attributes
	 */
	getBlockDefaultAttributes(state, blockType) {
		return state.blockAttributes[blockType];
	},
};

/**
 * @module selectors
 */
export default selectors;
