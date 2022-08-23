// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createPortal } from "react-dom";

/**
 * Portal component.
 *
 * @param {Object} props component properties
 * @param {React.ElementType} props.children component children
 * @param {Element} props.target portal parent
 * @constructor
 */
function Portal( { children, target } ) {
	return createPortal( children, target );
}

/**
 * @module Portal
 */
export default Portal;
