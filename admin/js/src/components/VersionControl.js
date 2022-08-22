// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currentVersion, versions } from "$Stores/settings-menu/slices/versionControl";
import withStore from "$HOC/withStore";

/**
 * Version control component.
 *
 * @param {Object} props component properties
 * @param {String} props.pluginVersion plugin version
 * @param {Object} props.allVersions available versions
 * @constructor
 */
function VersionControl( { pluginVersion, allVersions } ) {
	const [ versionLevel, setVersionLevel ] = useState( 'none' );
	const [ selectedVersion, setSelectedVersion ] = useState( pluginVersion );

	/**
	 * Calculate button disabled status.
	 * @return {boolean} disabled status
	 */
	const buttonDisabledStatus = () => {
		return pluginVersion === selectedVersion;
	};

	const sortedVersions = Object.keys( allVersions ).sort().reverse();
	const versionsLength = sortedVersions.length;

	useEffect( () => {
		const levelBorder = versionsLength / 2;
		const versionIndex = sortedVersions.indexOf( pluginVersion );

		// eslint-disable-next-line no-nested-ternary
		const calculatedLevel = versionIndex === 0 ? 'none' : ( versionIndex > levelBorder || versionIndex < 0 ? 'high' : 'medium' );

		setVersionLevel( calculatedLevel );
	}, [ selectedVersion ] );

	return (
		<div className={ 'version-control-container' }>
			<div data-level={ versionLevel } className={ 'version-control-status-indicator' }></div>
			<div className={ 'version-control-text' }>Version:</div>
			<div className={ 'version-control-list' }>
				<select value={ selectedVersion } onChange={ ( e ) => setSelectedVersion( e.target.value ) }>
					{
						sortedVersions.map( versionId => {
							return (
								<option key={ versionId } value={ versionId }>{ versionId }</option>
							);
						} )
					}
				</select>
			</div>
			<div className={ 'version-control-button' } data-disabled={ JSON.stringify( buttonDisabledStatus() ) }>
				<FontAwesomeIcon icon="fa-solid fa-circle-chevron-left" />
			</div>
		</div>
	);
}

/**
 * Store select mapping
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
