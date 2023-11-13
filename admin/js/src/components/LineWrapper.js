import React from 'react';

/**
 * Line wrapper component.
 *
 * @param {Object}                       props          component properties
 * @param {JSX.Element | Array | string} props.children component children
 */
function LineWrapper({ children }) {
	return <div className={'line-wrapper'}>{children} </div>;
}

/**
 * @module LineWrapper
 */
export default LineWrapper;
