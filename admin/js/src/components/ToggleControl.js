// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';

/**
 * Toggle control component.
 *
 * @class
 * @param {Object}   props                component properties
 * @param {boolean}  props.status         control status
 * @param {boolean}  props.disabled       control disabled status
 * @param {Function} props.onStatusChange status changed callback
 */
function ToggleControl({
	status,
	onStatusChange = () => {},
	disabled = false,
}) {
	/**
	 * Click handler for toggle component.
	 */
	const clickHandler = () => {
		if (!disabled) {
			onStatusChange(!status);
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus
		<div
			onClick={clickHandler}
			className={'ub-toggle-control'}
			data-enabled={JSON.stringify(disabled || status)}
			role={'button'}
		>
			<div className={'knob'}></div>
		</div>
	);
}

/**
 * @module ToggleControl
 */
export default ToggleControl;
