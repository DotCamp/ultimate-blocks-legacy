import { registerBlockType } from '@wordpress/blocks';

/**
 * Register plugin block.
 *
 * `attributes` key can be omitted from `options` to use block attributes registered on backend with `register_block_type` WordPress function.
 *
 * @param {string} blockTypeId block type
 * @param {Object} options     block options
 */
function registerPluginBlock(blockTypeId, options) {
	let { attributes } = options;

	// attribute checking
	if (!attributes || typeof attributes !== 'object') {
		attributes = {};
	}

	const context = self || global;
	const MainStore = context.ubMainStore;

	if (MainStore && MainStore.isInitialized()) {
		const defaultBlockAttributes =
			MainStore.select().getBlockDefaultAttributes(blockTypeId);

		attributes = { ...defaultBlockAttributes, ...attributes };

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
