import { createReduxStore, register } from '@wordpress/data';
import reducer from '$BlockStores/savedStyles/reducer';
import selectors from '$BlockStores/savedStyles/selectors';
import actions from '$BlockStores/savedStyles/actions';

/**
 * Saved styles store.
 *
 * @param {string} storeName name of store
 * @class
 */
function SavedStylesStore(storeName) {
	/**
	 * Store name.
	 *
	 * @type {string}
	 */
	this.storeName = storeName;

	/**
	 * Store instance.
	 *
	 * @private
	 * @type {null | object}
	 */
	let store = null;

	/**
	 * Create and register store object inside centralized data registry.
	 *
	 * @param {Object} [extraState={}] extra store object
	 */
	this.registerStore = (extraState = {}) => {
		const storeObject = {
			reducer: reducer(extraState),
			selectors,
			actions,
		};

		store = createReduxStore(this.storeName, storeObject);
		register(store);
	};
}

/**
 * @module registerStore
 */
export default SavedStylesStore;
