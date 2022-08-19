/**
 * Initial store.
 * @type {Object}
 */
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";

const initialState = {
	app: {
		blockFilter: FILTER_TYPES._DEFAULT,
		showBlockInfo: true,
	},
};

/**
 * @module initialState
 */
export default initialState;
