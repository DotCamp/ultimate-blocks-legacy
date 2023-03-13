import { connectWithStore } from '$BlockStores/StoreHelpers';

/**
 * Connect with main editor store.
 *
 * @param {Function} selectMapping selector mapping
 * @param {Function} actionMapping action mapping
 * @return {Function} hoc function
 */
function connectWithMainStore(selectMapping, actionMapping) {
	return connectWithStore('ub/main', selectMapping, actionMapping);
}

/**
 * @module connectWithMainStore
 */
export default connectWithMainStore;
