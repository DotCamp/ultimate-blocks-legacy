import React from 'react';

/**
 * Button link group component.
 *
 * @param {Object}   props          component properties
 * @param {Function} props.children component children
 * @class
 */
function ButtonLinkGroup({ children }) {
	return <div className={'ub-button-link-group'}>{children}</div>;
}

/**
 * @module ButtonLinkGroup
 */
export default ButtonLinkGroup;
