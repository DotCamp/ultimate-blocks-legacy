import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';

/**
 * Conditional renderer for plugin pro status.
 *
 * @param {Object}                         props          component properties
 * @param {Array | JSX.Element | Function} props.children component children
 *
 * @param {boolean}                        props.isPro    plugin pro status, will be supplied via HOC
 * @function Object() { [native code] }
 */
function ProPass({ children, isPro }) {
	return !isPro && children;
}

// select mapping for main store
const selectMapping = (namespacedSelect) => {
	const { getProStatus } = namespacedSelect;

	return {
		isPro: getProStatus(),
	};
};

/**
 * @module ProPass
 */
export default connectWithMainStore(selectMapping, null)(ProPass);
