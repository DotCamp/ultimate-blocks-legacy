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
	const blockUpsellData = state.upsells.extensionData[blockType];
	return featureId
		? { featureId: blockUpsellData[featureId] }
		: blockUpsellData;
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
	/**
	 * Get plugin asset urls.
	 *
	 * @param {Object} state    store state
	 * @param {string} assetKey key value of target asset
	 *
	 * @return {boolean} asset url
	 */
	getAssets(state, assetKey) {
		return state.assets[assetKey];
	},
	/**
	 * Get logo url.
	 *
	 * @param {Object} state store state
	 * @return {string} logo url
	 */
	getLogoUrl(state) {
		return state.assets.logoUrl;
	},
	/**
	 * Get upsell modal visibility status.
	 *
	 * @param {Object} state store state
	 * @return {string} visibility
	 */
	upsellModalVisibilityStatus(state) {
		return state.app.upsell.upsellModalVisibility;
	},
	/**
	 * Get target extension id to show its info.
	 *
	 * @param {Object} state store state
	 * @return {string|null} target extension info show id
	 */
	getUpsellTargetExtensionInfoShow(state) {
		return state.app.upsell.targetExtensionInfoShow;
	},
	/**
	 * Get block icon object of active block
	 *
	 * @return {Object} icon object
	 */
	getActiveBlockIconObject() {
		const { getBlockType } = select('core/blocks');
		const { getSelectedBlock } = select('core/block-editor');

		const blockOptions = getBlockType(getSelectedBlock()?.name);

		return blockOptions?.icon?.src;
	},
};

/**
 * @module selectors
 */
export default selectors;
