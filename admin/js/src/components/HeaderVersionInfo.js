import React from 'react';

/**
 * Header version info.
 *
 * @param {Object} props                component properties
 * @param {string} props.currentVersion current version number
 * @class
 */
function HeaderVersionInfo( { currentVersion } ) {
	return <div className={ 'ub-header-version-info' }>{ currentVersion }</div>;
}

/**
 * @module HeaderVersionInfo
 */
export default HeaderVersionInfo;
