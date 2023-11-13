// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import withStore from '$HOC/withStore';
import { getAllAppOptions } from '$Stores/settings-menu/slices/app';

// local storage key
const storageKey = 'ubMenuData';

// local storage data version
const localStorageVersion = '1.1';

/**
 * Property key to check if target key will not be written to local storage
 *
 * @type {string}
 */
export const NO_LOCAL_STORAGE_PROP = '__no_local_storage';

/**
 * Strip keys marked as not to write to local storage.
 *
 * @param {Object} data target data
 *
 * @return {Object} stripped data
 */
const stripNoLocalStorageMarked = (data) => {
	const stripKeys = [];

	/**
	 * Find marked property paths
	 *
	 * @param {any}    targetObject      target object, if no object is supplied to checking will be done
	 * @param {string} currentObjectPath path to current key
	 */
	function findStripPaths(targetObject, currentObjectPath = '') {
		if (typeof targetObject === 'object') {
			if (targetObject[NO_LOCAL_STORAGE_PROP]) {
				stripKeys.push(currentObjectPath);
			} else {
				Object.keys(targetObject)
					.filter((k) =>
						Object.prototype.hasOwnProperty.call(targetObject, k)
					)
					// eslint-disable-next-line array-callback-return
					.map((tKey) => {
						findStripPaths(
							targetObject[tKey],
							`${
								currentObjectPath === ''
									? ''
									: `${currentObjectPath}.`
							}${tKey}`
						);
					});
			}
		}
	}

	findStripPaths(data);

	// eslint-disable-next-line array-callback-return
	stripKeys.map((keyPath) => {
		const pathSegments = keyPath.split('.');
		const lastSegment = pathSegments.pop();

		let lastParentContainer = data;
		// eslint-disable-next-line array-callback-return
		pathSegments.map((pS) => {
			lastParentContainer = lastParentContainer[pS];
		});

		delete lastParentContainer[lastSegment];
	});

	return data;
};

/**
 * Get localStorage data for settings menu
 *
 * @return {Object} menu data
 */
export const getLocalStorage = () => {
	const data = localStorage.getItem(storageKey);

	if (data) {
		const localData = JSON.parse(data);
		// check version of local data against current local storage version
		// if a stale version is found, don't use it
		if (localData.version && localData.version === localStorageVersion) {
			const { version, ...rest } = localData;
			return stripNoLocalStorageMarked(rest);
		}
	}

	return {};
};

const writeToLocalStorage = (callback) => {
	const dataToWrite = callback(getLocalStorage());

	// add local storage data version
	dataToWrite.version = localStorageVersion;

	localStorage.setItem(storageKey, JSON.stringify(dataToWrite));
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
function LocalStorageProvider({ children, appState }) {
	useEffect(() => {
		writeToLocalStorage((currentData) => {
			currentData.app = appState;
			return currentData;
		});
	}, [appState]);

	return children;
}

const selectMapping = (select) => {
	return {
		appState: select(getAllAppOptions),
	};
};

/**
 * @module LocalStorageProvider
 */
export default withStore(LocalStorageProvider, selectMapping);
