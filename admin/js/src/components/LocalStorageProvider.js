// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import withStore from '$HOC/withStore';
import { getAllAppOptions } from '$Stores/settings-menu/slices/app';

// local storage key
const storageKey = 'ubMenuData';

// local storage data version
const localStorageVersion = '1.0';

/**
 * Get localStorage data for settings menu
 *
 * @return {Object} menu data
 */
export const getLocalStorage = () => {
	const data = localStorage.getItem( storageKey );

	if ( data ) {
		const localData = JSON.parse( data );
		// check version of local data against current local storage version
		// if a stale version is found, don't use it
		if ( localData.version && localData.version === localStorageVersion ) {
			const { version, ...rest } = localData;
			return rest;
		}
	}

	return {};
};

const writeToLocalStorage = ( callback ) => {
	const dataToWrite = callback( getLocalStorage() );

	// add local storage data version
	dataToWrite.version = localStorageVersion;

	localStorage.setItem( storageKey, JSON.stringify( dataToWrite ) );
};

/**
 * Local storage provider.
 *
 * This component will watch store state changes and write those to localStorage.
 *
 * @class
 *
 * @param {Object}            props          component properties
 * @param {React.ElementType} props.children component children
 * @param {Object}            props.appState store application state, will be supplied via HOC
 */
function LocalStorageProvider( { children, appState } ) {
	useEffect( () => {
		writeToLocalStorage( ( currentData ) => {
			currentData.app = appState;
			return currentData;
		} );
	}, [ appState ] );

	return children;
}

const selectMapping = ( select ) => {
	return {
		appState: select( getAllAppOptions ),
	};
};

/**
 * @module LocalStorageProvider
 */
export default withStore( LocalStorageProvider, selectMapping );
