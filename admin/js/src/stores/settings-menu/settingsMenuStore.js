import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import assetsSlice from '$Stores/settings-menu/slices/assets';
import appSlice from '$Stores/settings-menu/slices/app';
import blocksSlice from '$Stores/settings-menu/slices/blocks';
import versionControlSlice from '$Stores/settings-menu/slices/versionControl';
import deepmerge from 'deepmerge';
import initialState from '$Stores/settings-menu/initialState';
import { getLocalStorage } from '$Components/LocalStorageProvider';

/**
 * Prepare data for pro only block upsells.
 *
 * @param {Object} proOnlyBlockList pro only block list
 *
 * @return {Array} pro block upsell data
 */
function prepareProOnlyBlockUpsellData( proOnlyBlockList ) {
	return Object.keys( proOnlyBlockList )
		.filter( ( key ) =>
			Object.prototype.hasOwnProperty.call( proOnlyBlockList, key )
		)
		.reduce( ( carry, blockName ) => {
			const {
				desc: info,
				label: title,
				icon,
			} = proOnlyBlockList[ blockName ];

			carry.push(
				generateBlockInfoObject(
					blockName,
					title,
					info,
					'<i>here</i>',
					false,
					true
				)
			);

			return carry;
		}, [] );
}

/**
 * Generate block info object compatible with settings menu store.
 *
 * @param {string}            name        block registry name
 * @param {string}            title       block title
 * @param {string}            info        block info
 * @param {React.ElementType} icon        icon element
 * @param {boolean}           active      active status
 * @param {boolean}           [pro=false] block pro status
 * @return {Object} block info object
 */
function generateBlockInfoObject(
	name,
	title,
	info,
	icon,
	active,
	pro = false
) {
	return {
		name,
		title,
		info,
		icon,
		active,
		pro,
	};
}

/**
 * Create settings menu store.
 *
 * @return {Object} store
 */
function createStore() {
	// eslint-disable-next-line no-undef
	const appData = { ...ubAdminMenuData };
	// eslint-disable-next-line no-undef
	ubAdminMenuData = null;

	// add block infos to context data
	const registeredBlocks = wp.data.select( 'core/blocks' ).getBlockTypes();
	const registeredUbBlocks = registeredBlocks.filter( ( blockData ) => {
		return (
			blockData.parent === undefined &&
			blockData.supports.inserter === undefined
		);
	} );

	const { statusData, info } = appData.blocks;
	const reducedBlocks = registeredUbBlocks.reduce( ( carry, current ) => {
		const { icon, name: currentName, title } = current;

		let blockStatus = false;
		// eslint-disable-next-line array-callback-return,no-shadow
		statusData.map( ( { name, active } ) => {
			if ( name === currentName ) {
				blockStatus = active;
			}
		} );

		let blockInfo = [];
		if ( info[ currentName ] && Array.isArray( info[ currentName ] ) ) {
			blockInfo = info[ currentName ];
		}

		const newBlockObject = generateBlockInfoObject(
			currentName,
			title,
			blockInfo,
			icon.src,
			blockStatus
		);

		carry.push( newBlockObject );

		return carry;
	}, [] );

	const { blocks: proBlocks } = appData.upsells;
	const proBlockUpsell = prepareProOnlyBlockUpsellData( proBlocks );

	let preloadedState = {
		assets: appData.assets,
		blocks: {
			registered: [ ...reducedBlocks, ...proBlockUpsell ],
		},
		versionControl: appData.versionControl,
	};

	// merge with default store state
	preloadedState = deepmerge( initialState, preloadedState );

	// merge with localStorage data
	preloadedState = deepmerge( preloadedState, getLocalStorage() );

	return configureStore( {
		reducer: {
			assets: assetsSlice,
			app: appSlice,
			blocks: blocksSlice,
			versionControl: versionControlSlice,
		},
		middleware: ( getDefaultMiddleware ) =>
			getDefaultMiddleware( {
				serializableCheck: false,
			} ),
		preloadedState,
	} );
}

/**
 * @module createStore
 */
export default createStore;
