import { select } from '@wordpress/data';

/**
 * Get block upsell data
 *
 * @param {Object}      state            store state
 * @param {string}      blockType        block type
 * @param {string|null} [featureId=null] feature id, if null is supplied, all upsell data associated with the block will be returned
 *
 * @return {Object | Array} block upsell data
 */
const getBlockUpsellData = (state, blockType, featureId = null) => {
	const blockUpsellData = state.upsellExtensionData[blockType];
	return featureId ? blockUpsellData[featureId] : blockUpsellData;
};

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
	 *
	 * @return {Array | null} block default attributes
	 */
	getBlockDefaultAttributes(state, blockType) {
		return state.blockAttributes[blockType];
	},
	getBlockUpsellData,
	/**
	 * Get upsell data for currently active block.
	 *
	 * @param {Object}      state            store state
	 * @param {string|null} [featureId=null] feature id, if null is supplied, all upsell data associated with the block will be returned
	 *
	 * @return {Array|null} active block upsell data
	 */
	getUpsellDataActiveBlock(state, featureId = null) {
		const currentBlockType =
			select('core/block-editor').getSelectedBlock()?.name;

		if (currentBlockType) {
			return getBlockUpsellData(state, currentBlockType, featureId);
		}

		return null;
	},
	/**
	 * Get plugin pro status.
	 *
	 * @param {Object} state store state
	 *
	 * @return {boolean} pro status
	 */
	getProStatus(state) {
		return state.proStatus;
	},
};

/**
 * @module selectors
 */
export default selectors;
