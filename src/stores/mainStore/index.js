import { createReduxStore, register, dispatch, select } from "@wordpress/data";
import { FrontendDataManager, ManagerBase } from "$Library/ub-common/Inc";
import reducer from "./reducer";
import selectors from "./selectors";
import actions from "./actions";
import deepmerge from "deepmerge";

/**
 * Main store for plugin.
 *
 * Depends on initializations of:
 * - FrontendDataManager
 */
class MainStore extends ManagerBase {
	/**
	 * Name of the store.
	 * Will be used as an id to distinguish plugin store from other ones.
	 *
	 * @type {string|null}
	 */
	storeName = null;

	/**
	 * Register store.
	 *
	 * @param {Object} [extraState={}] extra state to use
	 */
	#registerStore = (extraState = {}) => {
		const innerExtraState = {
			storeName: this.storeName,
		};

		const reducerOptions = {
			reducer: reducer(deepmerge(innerExtraState, extraState)),
			selectors,
			actions: actions(this.storeName),
		};

		const generatedStore = createReduxStore(this.storeName, reducerOptions);

		register(generatedStore);
	};

	/**
	 * Initialization logic for pro store.
	 *
	 * @param {string} storeName store name
	 */
	_initLogic(storeName) {
		// store id for outside use to global context
		const context = self || global;
		context.ub_main_store_id = storeName;

		this.storeName = storeName;

		const blockAttributes =
			FrontendDataManager.getDataProperty("blockAttributes");
		const upsellExtensionData = FrontendDataManager.getDataProperty(
			"upsellExtensionData",
		);

		const proStatus = FrontendDataManager.getDataProperty("proStatus");
		const assets = FrontendDataManager.getDataProperty("assets");

		this.#registerStore({
			upsells: {
				extensionData: upsellExtensionData,
			},
			blockAttributes,
			proStatus: JSON.parse(proStatus),
			assets,
		});

		// attach this instance to global context for outside usage
		context.ubMainStore = this;
	}

	/**
	 * Get main store id.
	 *
	 * @return {string} store id
	 */
	getStoreId() {
		const context = self || global;
		return this.storeName ?? context.ub_main_store_id;
	}

	/**
	 * Store selector
	 *
	 * @return {Object} object containing available store selectors
	 */
	select() {
		return select(this.getStoreId());
	}

	/**
	 * Store action dispatch.
	 *
	 * @return {Object} object containing available store actions
	 */
	dispatch = () => {
		return dispatch(this.getStoreId());
	};
}

/**
 * @module mainStoreObj
 */
export default new MainStore();
