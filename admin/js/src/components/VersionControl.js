// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import {
	currentVersion,
	versions,
} from '$Stores/settings-menu/slices/versionControl';
import withStore from '$HOC/withStore';
import VersionControlPopup from '$Components/VersionControlPopup';
import Portal from '$Components/Portal';
import { rollbackToVersion } from '$Stores/settings-menu/actions';
import HeaderVersionInfo from '$Components/HeaderVersionInfo';

/**
 * Version control component.
 *
 * @param {Object}   props               component properties
 * @param {string}   props.pluginVersion plugin version, will be supplied via HOC
 * @param {Object}   props.allVersions   available versions, will be supplied via HOC
 * @param {Function} props.dispatch      store dispatch function, will be supplied via HOC
 * @function Object() { [native code] }
 */
function VersionControl( { pluginVersion, allVersions, dispatch } ) {
	// eslint-disable-next-line no-unused-vars
	const [ versionLevel, setVersionLevel ] = useState( 'none' );
	// eslint-disable-next-line no-unused-vars
	const [ selectedVersion, setSelectedVersion ] = useState( pluginVersion );
	const [ popupVisibility, setPopupVisibility ] = useState( false );

	/**
	 * Calculate button disabled status.
	 *
	 * @return {boolean} disabled status
	 */
	// eslint-disable-next-line no-unused-vars
	const buttonDisabledStatus = () => {
		return pluginVersion === selectedVersion;
	};

	const sortedVersions = allVersions.sort().reverse();
	const versionsLength = sortedVersions.length;

	/**
	 * Start version operation.
	 *
	 * @return {Promise} operation promise object
	 */
	const startVersionOperation = () => {
		return dispatch( rollbackToVersion )( selectedVersion );
	};

	useEffect( () => {
		const levelBorder = versionsLength / 2;
		const versionIndex = sortedVersions.indexOf( pluginVersion );

		const calculatedLevel =
			// eslint-disable-next-line no-nested-ternary
			versionIndex === 0
				? 'none'
				: versionIndex > levelBorder || versionIndex < 0
				? 'high'
				: 'medium';

		setVersionLevel( calculatedLevel );
	}, [ selectedVersion ] );

	return (
		<div className={ 'version-control-container' }>
			<HeaderVersionInfo currentVersion={ pluginVersion } />
			{ popupVisibility && (
				<Portal target={ document.body }>
					<VersionControlPopup
						onCloseHandler={ () => setPopupVisibility( false ) }
						from={ pluginVersion }
						to={ selectedVersion }
						onOperationStart={ startVersionOperation }
					/>
				</Portal>
			) }
		</div>
	);
}

/**
 * Store select mapping
 *
 * @param {Function} select store selector
 * @return {Object} select mapping
 */
const selectionMapping = ( select ) => {
	return {
		allVersions: select( versions ),
		pluginVersion: select( currentVersion ),
	};
};

/**
 * @module VersionControl
 */
export default withStore( VersionControl, selectionMapping );
