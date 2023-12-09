// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from 'react';
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
function VersionControl({ pluginVersion, allVersions, dispatch }) {
	const [selectedVersion, setSelectedVersion] = useState(pluginVersion);
	const [popupVisibility, setPopupVisibility] = useState(false);

	const sortedVersions = useMemo(
		() => allVersions.sort().reverse(),
		[allVersions]
	);

	/**
	 * Callback for version selection.
	 *
	 * @param {string} targetVersion target version
	 */
	const onVersionSelect = (targetVersion) => {
		setSelectedVersion(targetVersion);
		setPopupVisibility(true);
	};

	/**
	 * Start version operation.
	 *
	 * @return {Promise} operation promise object
	 */
	const startVersionOperation = () => {
		return dispatch(rollbackToVersion)(selectedVersion);
	};

	return (
		<div className={'version-control-container'}>
			<HeaderVersionInfo
				availableVersions={sortedVersions}
				currentVersion={selectedVersion}
				onSelect={onVersionSelect}
			/>
			{popupVisibility && (
				<Portal target={document.body}>
					<VersionControlPopup
						onCloseHandler={() => {
							setSelectedVersion(pluginVersion);
							setPopupVisibility(false);
						}}
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
