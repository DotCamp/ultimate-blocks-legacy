import createStore from './state';

/**
 * Store reducer.
 *
 * @param {Object} [extraState={}] extra store state
 * @return {Function} reducer function
 */
const reducer = (extraState) => {
	const DEFAULT_STATE = createStore(extraState);

	return (storeState = DEFAULT_STATE, action) => {
		return storeState;
	};
};

/**
 * @module reducer
 */
export default reducer;
