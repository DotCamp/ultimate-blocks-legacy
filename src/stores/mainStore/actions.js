import ACTION_TYPES from './types';
import { addFilter, applyFilters } from '@wordpress/hooks';

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
	};
};

/**
 * @module actions
 */
export default actions;
