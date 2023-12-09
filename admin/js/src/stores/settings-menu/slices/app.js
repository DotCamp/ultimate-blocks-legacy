import { createSlice, createSelector } from '@reduxjs/toolkit';
import { FILTER_TYPES } from '$Components/BlockStatusFilterControl';
import initialState from '$Stores/settings-menu/initialState';
import { isPluginPro } from '$Stores/settings-menu/slices/pluginStatus';

/**
 * App slice options
 *
 * @type {Object}
 */
const appSliceOptions = {
	name: 'app',
	initialState: initialState.app,
	reducers: {
		/**
		 * Set current route path.
		 *
		 * @param {Object} state         slice state
		 * @param {Object} props         reducer properties
		 * @param {string} props.payload route path
		 */
		setCurrentRoutePath(state, { payload }) {
			state.router.current = payload;
		},
		/**
		 * Set current filter value.
		 *
		 * @param {Object} state         slice state
		 * @param {Object} props         reducer properties
		 * @param {string} props.payload filter value
		 */
		setBlockFilter(state, { payload }) {
			if (Object.values(FILTER_TYPES).includes(payload)) {
				state.blockFilter = payload;
			} else {
				throw new Error('invalid block filter type supplied');
			}
		},
		/**
		 * Toggle showing info section for block controls.
		 *
		 * @param {Object} state slice state
		 */
		toggleShowBlockInfo(state) {
			state.showBlockInfo = !state.showBlockInfo;
		},
		/**
		 * Show upsell modal for target block type.
		 *
		 * @param {Object} state         slice state
		 * @param {Object} props         reducer properties
		 * @param {string} props.payload target block type
		 */
		showProBlockUpsellModal(state, { payload }) {
			state.upsellPopup.show = true;
			state.upsellPopup.targetBlock = payload;
		},
		/**
		 * Hide upsell modal for target block type.
		 *
		 * @param {Object} state slice state
		 */
		hideProBlockUpsellModal(state) {
			state.upsellPopup.show = false;
			state.upsellPopup.targetBlock = null;
		},
	},
};

const appSlice = createSlice(appSliceOptions);

export const {
	setBlockFilter,
	toggleShowBlockInfo,
	showProBlockUpsellModal,
	hideProBlockUpsellModal,
	setCurrentRoutePath,
} = appSlice.actions;

/**
 * Get all application options.
 *
 * @param {Object} state store state
 * @return {Object} options
 */
export const getAllAppOptions = (state) => {
	return state.app;
};

/* eslint-disable-next-line jsdoc/require-param */
/**
 * Get content data.
 */
export const getContentData = createSelector(
	[(state) => state.app.content, (content, id) => id],
	(content, id) => content[id] ?? null
);

/**
 * Get current block filter.
 *
 * @param {Object} state store state
 * @return {string} filter value
 */
export const getBlockFilter = (state) => {
	return state.app.blockFilter;
};

/**
 * Get block extra info show status.
 *
 * @param {Object} state store state
 * @return {boolean} status
 */
export const getBlockInfoShowStatus = (state) => {
	return state.app.showBlockInfo;
};

/**
 * Get plugin pro status.
 *
 * @deprecated
 * use isPluginPro selector in pluginStatus slice for future implementations
 *
 * @param {Object} state store state
 * @return {boolean} status
 */
export const getProStatus = (state) => {
	return isPluginPro(state);
};

/**
 * Get target block type to show in modal.
 *
 * @param {Object} state store state
 * @return {null | string} block type, null for no selected blocks
 */
export const getModalTargetBlockType = (state) => {
	return state.app.upsellPopup.targetBlock;
};

/**
 * Get modal visibility status.
 *
 * @param {Object} state store state
 * @return {boolean} visibility status
 */
export const getModalVisibilityStatus = (state) => {
	return state.app.upsellPopup.show;
};

/**
 * Get current route path.
 *
 * @param {Object} state store state
 * @return {string | null} route path
 */
export const getCurrentRoutePath = (state) => {
	return state.app.router.current;
};

/**
 * @module appSlice
 */
export default appSlice.reducer;
