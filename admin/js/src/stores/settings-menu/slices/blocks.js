import { createSlice } from '@reduxjs/toolkit';

/**
 * Block slice options
 *
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
		 *
		 * @param {Object} state         store state
		 * @param {Object} props         action props
		 * @param {Object} props.payload action payload
		 */
		setBlockActiveStatus( state, { payload } ) {
			const { id, status } = payload;

			const registered = state.registered;
			const uRegistered = [ ...registered ];

			let blockIndex = -1;
			// eslint-disable-next-line array-callback-return
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
 *
 * @param {Object} state store state
 * @return {Array} blocks
 */
export const getBlocks = ( state ) => {
	return state.blocks.registered;
};

/**
 * Get block object by given block type id.
 *
 * @param {Object} state store state
 * @return {Object | undefined} block object or undefined if no target block is found
 */
export const getBlockById = ( state ) => ( blockId ) => {
	return state.blocks.registered.find( ( { name } ) => name === blockId );
};

/**
 * @module blocksSlice
 */
export default blocksSlice.reducer;
