import React from 'react';

/**
 * Box content inc component.
 *
 * @param {Object}            props          component properties
 * @param {Function | string} props.children component children
 */
function BoxContentInc({ children }) {
	return <div className={'ub-box-content-inc'}>{children}</div>;
}

/**
 * @module BoxContentInc
 */
export default BoxContentInc;
