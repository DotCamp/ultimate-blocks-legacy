import { createPortal } from 'react-dom';

/**
 * Portal base component.
 *
 * @param {Object}  props             component properties
 * @param {Element} props.children    children
 * @param {string}  props.targetQuery target query
 * @class
 */
function PortalBase({ children, targetQuery }) {
	const portalTarget = document.querySelector(targetQuery);
	if (portalTarget) {
		return createPortal(children, portalTarget);
	}
	throw Error('invalid portal target');
}

/**
 * @module PortalBase
 */
export default PortalBase;
