import { select } from "@wordpress/data";

/**
 * Get block upsell data
 *
 * @param {Object} state     store state
 * @param {string} blockType block type
 *
 * @return {Object | Array} block upsell data
 */
const getBlockUpsellData = (state, blockType) => {
	return state.upsells.extensionData[blockType];
};

/**
 * Get block upsell data
 *
 * @param {Object} state     store state
 * @param {string} blockType block type
 *
 * @return {Object | Array} block upsell data
 */
const getProExtensionsUpsellData = (state, blockType) => {
	const extensionsUpsellData = state.upsells.extensionData;
	let result = [];

	// Iterate through the keys of the object
	for (let key in extensionsUpsellData) {
		// Check if the key starts with the specified prefix
		if (key.startsWith("ub-extension/")) {
			// If the key matches, add the object to the result array
			result.push(extensionsUpsellData[key]);
		}
	}

	return result;
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
		// should check for the availability of blockAttributes property since that property might not be available in some cases (e.g., being used in plugin settings page)
		return state.blockAttributes?.[blockType];
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
			select("core/block-editor").getSelectedBlock()?.name;

		if (currentBlockType && currentBlockType.startsWith("ub/")) {
			const blockUpsellData = getBlockUpsellData(state, currentBlockType);
			const extensionsUpsellData = getProExtensionsUpsellData(state);

			if (
				blockUpsellData &&
				blockUpsellData?.featureData &&
				!extensionsUpsellData
			) {
				const { featureData } = blockUpsellData;
				return featureId ? { featureId: featureData[featureId] } : featureData;
			} else {
				const featureData = blockUpsellData?.featureData ?? [];

				const extensionsFeaturedData = {};
				extensionsUpsellData.forEach((obj) => {
					if (obj?.featureData) {
						for (const key in obj?.featureData) {
							if (key !== "savedStylesMain") {
								extensionsFeaturedData[key] = obj?.featureData[key];
							}
						}
					}
				});
				return { ...featureData, ...extensionsFeaturedData };
			}
		}

		return null;
	},
	/**
	 * Get upsell data for currently active block.
	 *
	 * @param {Object} state store state
	 *
	 * @return {Array|null} active block upsell data
	 */
	getUpsellDummyControlDataActiveBlock(state) {
		const currentBlockType =
			select("core/block-editor").getSelectedBlock()?.name;

		if (currentBlockType && currentBlockType.startsWith("ub/")) {
			const blockUpsellData = getBlockUpsellData(state, currentBlockType);
			const extensionsUpsellData = getProExtensionsUpsellData(state);
			if (blockUpsellData && !extensionsUpsellData) {
				return blockUpsellData?.dummyControlsData;
			} else {
				const dummyControlsData = blockUpsellData?.dummyControlsData ?? [];
				const extensionsDummyData = [];
				extensionsUpsellData.forEach((data) => {
					const updatedData = data?.dummyControlsData?.map((dummyData) => {
						const updatedDummyData = dummyData;
						updatedDummyData["isExtension"] = true;
						return dummyData;
					});

					extensionsDummyData.push(...(updatedData ?? []));
				});
				return [...dummyControlsData, ...extensionsDummyData];
			}
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
		const { getBlockType } = select("core/blocks");
		const { getSelectedBlock } = select("core/block-editor");

		const blockOptions = getBlockType(getSelectedBlock()?.name);

		return blockOptions?.icon?.src;
	},
	/**
	 * Are we in production mode?
	 *
	 * @param {Object} state store state
	 * @return {boolean} production mode status
	 */
	inProduction(state) {
		return state.mode === "production";
	},
};

/**
 * @module selectors
 */
export default selectors;
