import React, { useMemo } from 'react';

/**
 * Header version info.
 *
 * @param {Object}        props                   component properties
 * @param {string}        props.currentVersion    current version number
 * @param {Array<string>} props.availableVersions available versions
 * @param {Function}      props.onSelect          callback for version select event
 * @class
 */
function HeaderVersionInfo({ currentVersion, availableVersions, onSelect }) {
	const availableVersionsMinusCurrent = useMemo(
		() => availableVersions.filter((version) => version !== currentVersion),
		[availableVersions]
	);

	return (
		<div className={'ub-header-version-info'}>
			<select
				value={currentVersion}
				onChange={(e) => onSelect(e.target.value)}
			>
				<option disabled={true} value={currentVersion}>
					{currentVersion}
				</option>
				{availableVersionsMinusCurrent.map((version) => (
					<option key={version} value={version}>
						{version}
					</option>
				))}
			</select>
		</div>
	);
}

/**
 * @module HeaderVersionInfo
 */
export default HeaderVersionInfo;
