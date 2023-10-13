import { FILTER_TYPES } from '$Components/BlockStatusFilterControl';
import contentData from '$Data/settingsMenuContent';

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
		},
		content: contentData,
		router: {
			current: 'blocks',
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
