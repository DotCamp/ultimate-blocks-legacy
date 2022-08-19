// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import withStore from "$HOC/withStore";
import { getAllAppOptions } from "$Stores/settings-menu/slices/app";

const storageKey = 'ubMenuData';

/**
 * Get localStorage data for settings menu
 * @return {Object} menu data
 */
export const getLocalStorage = () => {
	const data = localStorage.getItem( storageKey );

	if ( data ) {
		return JSON.parse( data );
	}

	return {};
};

const writeToLocalStorage = ( callback ) => {
	const dataToWrite = callback( getLocalStorage() );
	localStorage.setItem( storageKey, JSON.stringify( dataToWrite ) );
};

/**
 * Local storage provider.
 *
 * This component will watch store state changes and write those to localStorage.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {React.ElementType} props.children component children
 * @param {Object} props.appState store application state, will be supplied via HOC
 */
function LocalStorageProvider( { children, appState } ) {
	useEffect( () => {
		writeToLocalStorage( ( currentData ) => {
			currentData.app = appState;
			return currentData;
		} );
	}, [ appState ] );

	return ( children );
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
