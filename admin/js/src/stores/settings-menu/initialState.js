import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";

/**
 * Initial store state.
 * @type {Object}
 */
const initialState = {
	app: {
		blockFilter: FILTER_TYPES._DEFAULT,
		showBlockInfo: true,
	},
	versionControl: {
		currentVersion: '1.0.0',
		versions: {},
		ajax: {
		},
	},
};

/**
 * @module initialState
 */
export default initialState;
