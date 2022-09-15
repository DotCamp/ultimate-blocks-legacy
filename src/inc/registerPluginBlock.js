import { registerBlockType } from '@wordpress/blocks';
import MainStore from '$BlockStores/mainStore/index.js';

/**
 * Register plugin block.
 *
 * @param {string} blockTypeId block type
 * @param {Object} options     block options
 */
function registerPluginBlock(blockTypeId, options) {
	const { attributes } = options;

	// attribute checking
	if (!attributes || typeof attributes !== 'object') {
		throw new Error(
			`invalid attribute is supplied for block type ${blockTypeId}`
		);
	}

	if (MainStore.isInitialized()) {
		// filter block attributes
		MainStore.dispatch().applyPluginFilter(
			`${blockTypeId}-attributes`,
			attributes,
			(finalData) => {
				options.attributes = finalData;
			}
		);
	}

	registerBlockType(blockTypeId, options);
}

/**
 * @module registerPluginBlock
 */
export default registerPluginBlock;
