import React from 'react';

/**
 * Box content title component.
 *
 * @param {Object}            props          component properties
 * @param {Function | string} props.children component children
 * @class
 */
function BoxContentTitle({ children }) {
	return <div className={'ub-box-content-title'}>{children}</div>;
}

/**
 * @module BoxContentTitle
 */
export default BoxContentTitle;
