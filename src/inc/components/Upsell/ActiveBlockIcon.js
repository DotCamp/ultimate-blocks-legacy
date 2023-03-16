import { createElement } from 'react';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';

/**
 * Component for displaying active block's icon component.
 *
 * @param {Object} props            component properties
 * @param {Object} props.iconObject icon object, will be supplied via HOC
 * @function Object() { [native code] }
 */
function ActiveBlockIcon({ iconObject }) {
	const { type, props } = iconObject;

	return (
		<div className={'ub-active-block-icon'}>
			{createElement(type, props)}
		</div>
	);
}

// selector mapping for main store
const mainSelectMapping = (namespacedSelect) => {
	const { getActiveBlockIconObject } = namespacedSelect;

	return {
		iconObject: getActiveBlockIconObject(),
	};
};

/**
 * @module ActiveBlockIcon
 */
export default connectWithMainStore(mainSelectMapping, null)(ActiveBlockIcon);
