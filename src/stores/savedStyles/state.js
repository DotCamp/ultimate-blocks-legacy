/**
 * Saved styles default state.
 *
 * @type {Object}
 */
const defaultState = {
	saved: {},
	rendered: {},
	renderProps: {
		previewsEnabled: true,
		attributeRenderPreparation: (attr) => attr,
		elementRenderPreparation: (el) => el,
		previewParentBlock: 'ub/preview-provider',
		previewBlockType: null,
		forceActiveBlockForRender: false,
	},
	app: {
		currentBlockTypeOverride: null,
		startupBlockIds: [],
		busy: false,
		advancedControlsVisible: false,
		activeItemId: null,
		pageBackgroundColor: null,
		listing: {
			selectedItemId: null,
			showPreviews: false,
		},
	},
};

/**
 * Create store state.
 *
 * @param {Object} [extraState={}] extra state
 * @return {Object} store state
 */
const createStoreState = (extraState = {}) => {
	return { ...defaultState, ...extraState };
};

/**
 * @module createStoreState
 */
export default createStoreState;
