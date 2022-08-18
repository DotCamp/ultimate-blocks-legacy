import { createSlice } from "@reduxjs/toolkit";
import block from "../../../../../../src/blocks/post-grid/block";

/**
 * Block slice options
 * @type {Object}
 */
const blocksSliceOptions = {
	name: 'blocks',
	initialState: {
		registered: [],
	},
	reducers: {
		/**
		 * Set active status of target block.
		 * @param {Object} state store state
		 * @param {Object} props action props
		 * @param {Object} props.payload action payload
		 */
		setBlockActiveStatus( state, { payload } ) {
			const { id, status } = payload;

			const registered = state.registered;
			const uRegistered = [ ...registered ];

			let blockIndex = -1;
			uRegistered.map( ( bObj, index ) => {
				if ( bObj.name === id ) {
					blockIndex = index;
				}
			} );

			if ( blockIndex >= 0 ) {
				uRegistered[ blockIndex ].active = status;
				state.registered = uRegistered;
			}
		},
	},
};

const blocksSlice = createSlice( blocksSliceOptions );

export const { setBlockActiveStatus } = blocksSlice.actions;

/**
 * Get registered plugin blocks.
 * @param {Object} state store state
 * @return {Array} blocks
 */
export const getBlocks = ( state ) => {
	return state.blocks.registered;
};

/**
 * @module blocksSlice
 */
export default blocksSlice.reducer;
