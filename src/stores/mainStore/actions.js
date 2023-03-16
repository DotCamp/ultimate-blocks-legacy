import ACTION_TYPES from './types';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { select } from '@wordpress/data';

/**
 * Store actions.
 *
 * @param {string} storeName store name
 * @return {Object} action object
 */
const actions = (storeName) => {
	/**
	 * Prepare hook name.
	 *
	 * @param {string} hookName name of hook
	 * @param {string} hookType type of hook, available values 'action', 'filter'
	 * @return {string} generated hook name
	 */
	const preparePluginHookName = (hookName, hookType) => {
		const availableHookTypes = ['action', 'filter'];

		let finalHookType = availableHookTypes[0];
		if (availableHookTypes.includes(hookType)) {
			finalHookType = hookType;
		}

		return `${storeName.toLowerCase()}_${finalHookType}-${hookName.replaceAll(
			'/',
			'_'
		)}`;
	};

	return {
		/**
		 * Apply plugin filters.
		 *
		 * @param {string}   filterName name of filter
		 * @param {any}      filterData data to be filtered
		 * @param {Function} callback   callback function which will be called with filtered final data as argument
		 * @return {Object} action object
		 */
		applyPluginFilter(filterName, filterData, callback) {
			const finalFilterName = preparePluginHookName(filterName, 'filter');

			const finalData = applyFilters(finalFilterName, filterData);

			if (typeof callback === 'function') {
				callback(finalData);
			}

			return {
				type: ACTION_TYPES.UN_AFFECTIVE,
			};
		},
		/**
		 * Add plugin filter.
		 *
		 * @param {string}   filterName filter name
		 * @param {Function} callback   callback function, will be called with current filtered data as first argument
		 * @return {Object} action object
		 */
		addPluginFilter(filterName, callback) {
			const finalFilterName = preparePluginHookName(filterName, 'filter');

			if (typeof callback !== 'function') {
				throw new Error(
					`invalid callback type supplied for filter ${filterName}`
				);
			}

			addFilter(finalFilterName, storeName, callback);

			return {
				type: ACTION_TYPES.UN_AFFECTIVE,
			};
		},
		/**
		 * Set visibility status of upsell modal window.
		 *
		 * @param {boolean} visibilityStatus visibility status
		 */
		setUpsellModalVisibility(visibilityStatus) {
			return {
				type: ACTION_TYPES.UPSELL_MODAL_VISIBILITY,
				payload: visibilityStatus,
			};
		},
		/**
		 * Set extension id for info summary.
		 *
		 * @param {string|null} extensionId extension feature id
		 */
		setTargetExtensionForInfoShow(extensionId = null) {
			return {
				type: ACTION_TYPES.UPSELL_EXTENSION_INFO_SHOW,
				payload: extensionId,
			};
		},
		/**
		 * Set target block for info summary.
		 *
		 * @param {string|null} blockId block id
		 */
		setTargetBlockForInfoShow(blockId = null) {
			return {
				type: ACTION_TYPES.TARGET_BLOCK_INFO_SHOW,
				payload: blockId,
			};
		},
	};
};

/**
 * Hide upsell modal window.
 *
 * @param {Function} namespacedDispatch store namespaced dispatch
 */
export const hideUpsellModal = (namespacedDispatch) => () => {
	const { setUpsellModalVisibility } = namespacedDispatch;
	const { setTargetExtensionForInfoShow, setTargetBlockForInfoShow } =
		namespacedDispatch;

	setUpsellModalVisibility(false);

	// reset extension feature/target block
	setTargetExtensionForInfoShow(null);
	setTargetBlockForInfoShow(null);
};

/**
 * Show upsell modal window.
 *
 * @param {Function} namespacedDispatch store namespaced dispatch
 */
export const showUpsellModal = (namespacedDispatch) => () => {
	const { setUpsellModalVisibility } = namespacedDispatch;

	setUpsellModalVisibility(true);
};

/**
 * Show target extension info in a modal window.
 *
 * @param {Function} namespacedDispatch store namespaced dispatch
 * @return {(function())|*} action function
 */
export const showExtensionInfo =
	(namespacedDispatch) =>
	(extensionFeatureId = null, targetBlockType = null) => {
		const { setTargetExtensionForInfoShow, setTargetBlockForInfoShow } =
			namespacedDispatch;

		// if no target block is supplied, current active block will be used
		if (!targetBlockType) {
			targetBlockType =
				select('core/block-editor').getSelectedBlock()?.name;
		}

		setTargetExtensionForInfoShow(extensionFeatureId);
		setTargetBlockForInfoShow(targetBlockType);

		showUpsellModal(namespacedDispatch)();
	};

/**
 * @module actions
 */
export default actions;
