import { configureStore } from "@reduxjs/toolkit";
import assetsSlice from "$Stores/settings-menu/slices/assets";
import appSlice from "$Stores/settings-menu/slices/app";
import blocksSlice from "$Stores/settings-menu/slices/blocks";
import versionControlSlice from "$Stores/settings-menu/slices/versionControl";
import deepmerge from "deepmerge";
import initialState from "$Stores/settings-menu/initialState";
import { getLocalStorage } from "$Components/LocalStorageProvider";

/**
 * Create settings menu store.
 *
 * @return {Object} store
 */
function createStore() {
	const appData = { ...ubAdminMenuData };
	ubAdminMenuData = null;

	// add block infos to context data
	const registeredBlocks = wp.data.select( 'core/blocks' ).getBlockTypes();
	const registeredUbBlocks = registeredBlocks.filter( blockData => {
		return blockData.parent === undefined && blockData.supports.inserter === undefined;
	} );

	const { statusData, info } = appData.blocks;
	const allowedKeys = [ 'icon', 'name', 'title' ];
	const reducedBlocks = registeredUbBlocks.reduce( ( carry, current ) => {
		const newBlockObject = {};

		allowedKeys.map( ( key ) => {
			newBlockObject[ key ] = current[ key ];
		} );

		newBlockObject.icon = newBlockObject.icon.src;

		let blockStatus = false;
		statusData.map( ( { name, active } ) => {
			if ( name === newBlockObject.name ) {
				blockStatus = active;
			}
		} );
		newBlockObject.active = blockStatus;

		newBlockObject.info = [];
		const { name } = newBlockObject;
		if ( info[ name ] && Array.isArray( info[ name ] ) ) {
			newBlockObject.info = info[ name ];
		}

		carry.push( newBlockObject );

		return carry;
	}, [] );

	let preloadedState = {
		assets: appData.assets,
		blocks: {
			registered: reducedBlocks,
		},
		versionControl: appData.versionControl,
	};

	// merge with default store state
	preloadedState = deepmerge( initialState, preloadedState, );

	// merge with localStorage data
	preloadedState = deepmerge( preloadedState, getLocalStorage() );

	return configureStore( {
		reducer: {
			assets: assetsSlice,
			app: appSlice,
			blocks: blocksSlice,
			versionControl: versionControlSlice,
		},
		middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {
			serializableCheck: false,
		} ),
		preloadedState,
	} );
}

/**
 * @module createStore
 */
export default createStore;
