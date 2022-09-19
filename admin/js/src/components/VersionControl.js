// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	currentVersion,
	versions,
} from '$Stores/settings-menu/slices/versionControl';
import withStore from '$HOC/withStore';
import VersionControlPopup from '$Components/VersionControlPopup';
import Portal from '$Components/Portal';
import { rollbackToVersion } from '$Stores/settings-menu/actions';
import { __ } from '@wordpress/i18n';

/**
 * Version control component.
 *
 * @param {Object}   props               component properties
 * @param {string}   props.pluginVersion plugin version, will be supplied via HOC
 * @param {Object}   props.allVersions   available versions, will be supplied via HOC
 * @param {Function} props.dispatch      store dispatch function, will be supplied via HOC
 * @function Object() { [native code] }
 */
function VersionControl({ pluginVersion, allVersions, dispatch }) {
	const [versionLevel, setVersionLevel] = useState('none');
	const [selectedVersion, setSelectedVersion] = useState(pluginVersion);
	const [popupVisibility, setPopupVisibility] = useState(false);

	/**
	 * Calculate button disabled status.
	 *
	 * @return {boolean} disabled status
	 */
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
		return dispatch(rollbackToVersion)(selectedVersion);
	};

	useEffect(() => {
		const levelBorder = versionsLength / 2;
		const versionIndex = sortedVersions.indexOf(pluginVersion);

		const calculatedLevel =
			// eslint-disable-next-line no-nested-ternary
			versionIndex === 0
				? 'none'
				: versionIndex > levelBorder || versionIndex < 0
				? 'high'
				: 'medium';

		setVersionLevel(calculatedLevel);
	}, [selectedVersion]);

	return (
		<div className={'version-control-container'}>
			<div
				data-level={versionLevel}
				className={'version-control-status-indicator'}
			></div>
			<div>{__('Version Control: ', 'ultimate-blocks-pro')}</div>
			<div className={'version-control-list'}>
				<select
					value={selectedVersion}
					onChange={(e) => setSelectedVersion(e.target.value)}
				>
					{sortedVersions.map((versionId) => {
						return (
							<option key={versionId} value={versionId}>
								{versionId}
							</option>
						);
					})}
				</select>
			</div>
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
			<div
				onClick={() => setPopupVisibility(true)}
				className={'version-control-button'}
				data-disabled={JSON.stringify(buttonDisabledStatus())}
			>
				<FontAwesomeIcon icon="fa-solid fa-circle-chevron-left" />
			</div>
			{popupVisibility && (
				<Portal target={document.body}>
					<VersionControlPopup
						onCloseHandler={() => setPopupVisibility(false)}
						from={pluginVersion}
						to={selectedVersion}
						onOperationStart={startVersionOperation}
					/>
				</Portal>
			)}
		</div>
	);
}

/**
 * Store select mapping
 *
 * @param {Function} select store selector
 * @return {Object} select mapping
 */
const selectionMapping = (select) => {
	return {
		allVersions: select(versions),
		pluginVersion: select(currentVersion),
	};
};

/**
 * @module VersionControl
 */
export default withStore(VersionControl, selectionMapping);
