import { useEffect, useState } from 'react';
import { isPluginPro } from '$Stores/settings-menu/slices/pluginStatus';
import withStore from '$HOC/withStore';

/**
 * Component to filter its children based on pro version status of current plugin.
 *
 * @param {Object}                    props               component properties
 * @param {boolean}                   props.proStatus     pro version status, will be supplied via HOC
 * @param {Array | Function | string} props.children      component children
 * @param {boolean}                   [props.invert=true] invert filter, if true, children will be rendered only if proStatus is false
 * @class
 */
function ProFilter({ proStatus, children, invert = true }) {
	const [finalStatus, setFinalStatus] = useState(false);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		setFinalStatus(invert ? !proStatus : proStatus);
	}, []);

	return finalStatus && children;
}

// Store selection mapping
const selectMapping = (selector) => ({
	proStatus: selector(isPluginPro),
});

/**
 * @module ProFilter
 */
export default withStore(ProFilter, selectMapping);
