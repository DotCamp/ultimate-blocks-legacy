import React from 'react';

/**
 * Vitalize text.
 *
 * @param {Object}                        props          component properties
 * @param {Array | JSX.Element | string } props.children component children
 * @function Object() { [native code] }
 */
function VitalizeText({ children }) {
	return <span className={'ub-upsell-vitalize-text'}>{children}</span>;
}

/**
 * @module VitalizeText
 */
export default VitalizeText;
