// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import ExtensionControlCard from '$Components/ExtensionControlCard';
import withStore from '$HOC/withStore';
import {
	getExtensions,
	setExtensionActiveStatus,
} from '$Stores/settings-menu/slices/extension';
import {
	getProStatus,
	showProBlockUpsellModal,
} from '$Stores/settings-menu/slices/app';
import { toggleExtensionStatus } from '$Stores/settings-menu/actions';

/**
 * Block controls container.
 *
 * @class
 *
 * @param {Object}   props                    component properties
 * @param {Object}   props.extensions         menu data, will be supplied via HOC
 * @param {Function} props.dispatch           store action dispatch function, will be supplied via HOC
 * @param {Function} props.showUpsell         set target extension type for modal interface
 * @param {Function} props.setExtensionStatus set a block's active status, will be supplied via HOC
 * @param {boolean}  props.proStatus          plugin pro status, will be supplied via HOC
 */
function ExtensionsControlContainer({
	extensions: ubExtensions,
	setExtensionStatus,
	dispatch,
	showUpsell,
	proStatus,
}) {
	const [extensions, setExtensions] = useState(ubExtensions);
	/**
	 * Handle block status change.
	 *
	 * @param {boolean} proExtension is calling block belongs to pro version of the plugin
	 */
	const handleExtensionStatusChange =
		(proExtension) => (extensionId, status) => {
			if (proExtension && !proStatus) {
				setExtensionStatus({ id: extensionId, status: false });
				return;
			}

			setExtensionStatus({ id: extensionId, status });
			dispatch(toggleExtensionStatus)(extensionId, status);
		};

	// useEffect hook
	useEffect(() => {
		const sortedExtensions = [...ubExtensions].sort((a, b) => {
			const aName = a?.title?.toLowerCase() ?? a?.label?.toLowerCase();
			const bName = b?.title?.toLowerCase() ?? b?.label?.toLowerCase();

			if (aName < bName) {
				return -1;
			}
			if (aName > bName) {
				return 1;
			}

			return 0;
		});

		setExtensions(sortedExtensions);
	}, [ubExtensions]);

	return (
		<div className={'controls-container'}>
			{extensions.map(({ label, name, active, icon, info, pro }) => {
				return (
					<ExtensionControlCard
						key={name}
						proStatus={proStatus}
						title={label}
						extensionId={name}
						status={active}
						onStatusChange={handleExtensionStatusChange(pro)}
						iconElement={icon}
						showUpsell={showUpsell}
						info={info}
						proExtension={pro}
					/>
				);
			})}
		</div>
	);
}

const selectMapping = (selector) => ({
	extensions: selector(getExtensions),
	proStatus: selector(getProStatus),
});

const actionMapping = () => ({
	showUpsell: showProBlockUpsellModal,
	setExtensionStatus: setExtensionActiveStatus,
});

/**
 * @module ExtensionsControlContainer
 */
export default withStore(
	ExtensionsControlContainer,
	selectMapping,
	actionMapping
);
