// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Version control component.
 * @constructor
 */
function VersionControl() {
	const [ versionLevel, setVersionLevel ] = useState( 'none' );

	return (
		<div className={ 'version-control-container' }>
			<div data-level={ versionLevel } className={ 'version-control-status-indicator' }></div>
			<div>Version:</div>
			<div className={ 'version-control-list' }>
				<select></select>
			</div>
			<div className={ 'version-control-button' }>
				<FontAwesomeIcon icon="fa-solid fa-circle-chevron-left" />
			</div>
		</div>
	);
}

/**
 * @module VersionControl
 */
export default VersionControl;
