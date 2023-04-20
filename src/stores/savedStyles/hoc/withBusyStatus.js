import { connectWithStore } from '$Library/ub-common/Inc';
import SavedStylesManager from '$Manager/SavedStylesManager';

// select mappings
const selectMapping = ({ busyState }) => {
	return { busyStatus: busyState() };
};

/**
 * withBusyStatus HOC.
 *
 * Will add `busyStatus` property to component properties.
 *
 * @type {Function}
 */
const withBusyStatus = connectWithStore(
	SavedStylesManager.storeNamespace,
	selectMapping
);

/**
 * @module withBusyStatus
 */
export default withBusyStatus;
