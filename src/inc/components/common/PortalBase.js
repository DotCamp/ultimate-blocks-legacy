import { createPortal } from 'react-dom';

/**
 * Portal base.
 *
 * @param {Object}              props             component properties
 * @param {string}              props.targetQuery query for target portal container
 * @param {Array | JSX.Element} props.children    component children
 * @function Object() { [native code] }
 */
function PortalBase({ targetQuery, children }) {
	const targetContainer = document.querySelectorAll(targetQuery);

	if (targetContainer) {
		return createPortal(children, targetContainer);
	}

	return null;
}

/**
 * @module PortalBase
 */
export default PortalBase;
