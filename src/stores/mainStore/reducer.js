import createStore from './state';
import ACTION_TYPES from '$BlockStores/mainStore/types';

/**
 * Store reducer.
 *
 * @param {Object} [extraState={}] extra store state
 * @return {Function} reducer function
 */
const reducer = (extraState) => {
	const DEFAULT_STATE = createStore(extraState);

	return (storeState = DEFAULT_STATE, { type, payload }) => {
		switch (type) {
			case ACTION_TYPES.UPSELL_MODAL_VISIBILITY:
				return {
					...storeState,
					app: {
						...storeState.app,
						upsell: {
							...storeState.app.upsell,
							upsellModalVisibility: payload,
						},
					},
				};
			case ACTION_TYPES.UPSELL_EXTENSION_INFO_SHOW:
				return {
					...storeState,
					app: {
						...storeState.app,
						upsell: {
							...storeState.app.upsell,
							targetExtensionInfoShow: payload,
						},
					},
				};
			case ACTION_TYPES.TARGET_BLOCK_INFO_SHOW:
				return {
					...storeState,
					app: {
						...storeState.app,
						upsell: {
							...storeState.app.upsell,
							targetBlockInfoShow: payload,
						},
					},
				};
			case ACTION_TYPES.UN_AFFECTIVE:
				return storeState;
			default:
				return storeState;
		}
	};
};

/**
 * @module reducer
 */
export default reducer;
