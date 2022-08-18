import { createSlice } from "@reduxjs/toolkit";
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";

/**
 * App slice options
 * @type {Object}
 */
const appSliceOptions = {
	name: 'app',
	initialState: {
		blockFilter: FILTER_TYPES._DEFAULT,
	},
	reducers: {
		setBlockFilter( state, { payload } ) {
			if ( Object.values( FILTER_TYPES ).includes( payload ) ) {
				state.blockFilter = payload;
			} else {
				throw new Error( 'invalid block filter type supplied' );
			}
		},
	},
};

const appSlice = createSlice( appSliceOptions );

export const { setBlockFilter } = appSlice.actions;

/**
 * Get current block filter.
 * @param {Object} state store state
 * @returns {String} filter value
 */
export const getBlockFilter = ( state ) => {
	return state.app.blockFilter;
};

/**
 * @module appSlice
 */
export default appSlice.reducer;
