import { createReduxStore, register } from '@wordpress/data';
import reducer from './reducer';
import selectors from './selectors';

/**
 * Main store for plugin.
 *
 * @param {string} storeName store name
 * @function Object() { [native code] }
 */
function MainStore(storeName) {
	/**
	 * Name of the store.
	 * Will be used as an id to distinguish plugin store from other ones.
	 *
	 * @type {string}
	 */
	this.storeName = storeName;

	this.store = null;

	/**
	 * Register store.
	 *
	 * @param {Object} [extraState={}] extra state to use
	 */
	this.registerStore = (extraState = {}) => {
		const reducerOptions = {
			reducer: reducer(extraState),
			selectors,
		};

		this.store = createReduxStore(this.storeName, reducerOptions);

		register(this.store);
	};
}

// create and register plugin store
const mainStoreObj = new MainStore('UltimateBlocks');
mainStoreObj.registerStore();
