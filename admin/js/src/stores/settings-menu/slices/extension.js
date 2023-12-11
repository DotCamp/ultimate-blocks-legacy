import { createSelector, createSlice } from '@reduxjs/toolkit';

/**
 * Extension slice options
 *
 * @type {Object}
 */
const extensionsSliceOptions = {
	name: 'extensions',
	initialState: {
		registered: [],
	},
	reducers: {
		/**
		 * Set active status of target extension.
		 *
		 * @param {Object} state         store state
		 * @param {Object} props         action props
		 * @param {Object} props.payload action payload
		 */
		setExtensionActiveStatus(state, { payload }) {
			const { id, status } = payload;

			const registered = state.registered;
			const uRegistered = [...registered];

			let extensionIndex = -1;
			// eslint-disable-next-line array-callback-return
			uRegistered.map((bObj, index) => {
				if (bObj.name === id) {
					extensionIndex = index;
				}
			});

			if (extensionIndex >= 0) {
				uRegistered[extensionIndex].active = status;
				state.registered = uRegistered;
			}
		},
	},
};

const extensionsSlice = createSlice(extensionsSliceOptions);

export const { setExtensionActiveStatus } = extensionsSlice.actions;

/**
 * Get registered plugin extensions.
 *
 * @param {Object} state store state
 * @return {Array} extensions
 */
export const getExtensions = (state) => {
	return state.extensions.registered;
};

/* eslint-disable-next-line jsdoc/require-param */
/**
 * Get extension object by given extension type id.
 */
export const getExtensionById = createSelector(
	[
		(state) => state.extensions.registered,
		(registered, extensionId) => extensionId,
	],
	(registered, extensionId) =>
		registered.find(({ name }) => name === extensionId)
);

/**
 * @module extensionsSlice
 */
export default extensionsSlice.reducer;
