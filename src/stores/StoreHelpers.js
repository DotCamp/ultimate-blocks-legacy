import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Create namespaced store helpers.
 *
 * @param {string} storeNamespace store namespace
 * @return {Object} namespaced helpers
 */
export const createNamespacedHelpers = (storeNamespace) => {
	const namespacedWithDispatch = (callback) => {
		return withDispatch((dispatch, ownProps, { select }) => {
			const namespacedDispatch = dispatch(storeNamespace);
			const namespacedSelect = select(storeNamespace);
			return callback(namespacedDispatch, namespacedSelect);
		});
	};

	const namespacedWithSelect = (callback) => {
		return withSelect((select, ownProps, registry) => {
			const namespacedSelect = select(storeNamespace);
			return callback(namespacedSelect, ownProps, registry);
		});
	};

	return { namespacedWithDispatch, namespacedWithSelect };
};

/**
 * HOC for connecting components with data stores.
 *
 * @param {string}   storeNamespace store namespace
 * @param {Function} selectMapping  select mapping
 * @param {Function} actionMapping  action mapping
 * @return {Function} composed HOC function
 */
export const connectWithStore = (
	storeNamespace,
	selectMapping,
	actionMapping
) => {
	// generate namespaced helpers for related store
	const { namespacedWithDispatch, namespacedWithSelect } =
		createNamespacedHelpers(storeNamespace);

	let applySelect = (props) => props;
	if (selectMapping) {
		applySelect = namespacedWithSelect(selectMapping);
	}

	let applyAction = (props) => props;
	if (actionMapping) {
		applyAction = namespacedWithDispatch(actionMapping);
	}

	return compose(applySelect, applyAction);
};
