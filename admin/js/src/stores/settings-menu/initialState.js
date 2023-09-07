import { FILTER_TYPES } from '$Components/BlockStatusFilterControl';
import { NO_LOCAL_STORAGE_PROP } from '$Components/LocalStorageProvider';

/**
 * Initial store state.
 *
 * @type {Object}
 */
const initialState = {
	app: {
		blockFilter: FILTER_TYPES._DEFAULT,
		showBlockInfo: false,
		upsellPopup: {
			show: false,
			targetBlock: null,
			[ NO_LOCAL_STORAGE_PROP ]: true,
		},
	},
	versionControl: {
		currentVersion: '1.0.0',
		versions: {},
		ajax: {},
	},
	pluginStatus: {
		isPro: false,
	},
};

/**
 * @module initialState
 */
export default initialState;
