import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Navigation types.
 *
 * @type {{LEFT: string, RIGHT: string}}
 */
export const navigationType = {
	LEFT: 'fa-solid fa-caret-left',
	RIGHT: 'fa-solid fa-caret-right',
};

/**
 * Modal navigation component.
 *
 * @param {Object}   props                 component properties
 * @param {string}   props.type            navigation type, use `navigationType` object for available type
 * @param {boolean}  [props.disable=false] disabled status
 * @param {Function} props.clickHandler    click handler
 * @function Object() { [native code] }
 */
function ModalNavigation({ type, disable = false, clickHandler }) {
	const [finalType, setType] = useState(type);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const navigationKeys = Object.values(navigationType);

		// don't let unsupported navigation types to be selected
		if (!navigationKeys.includes(type)) {
			setType(navigationType.LEFT);
		}
	}, [type]);

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			className={'ub-upsells-modal-navigation'}
			data-ub-nav-disabled={disable}
			onClick={clickHandler}
		>
			<FontAwesomeIcon icon={finalType} />
		</div>
	);
}

/**
 * @module ModalNavigation
 */
export default ModalNavigation;
