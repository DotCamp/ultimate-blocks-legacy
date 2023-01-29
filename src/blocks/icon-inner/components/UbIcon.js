import React, { Fragment } from 'react';
import UbIconComponent from './UbIconComponent';
import UbIconInspector from './UbIconInspector';

/**
 * Icon main component.
 *
 * @param {Object}   props               component properties
 * @param {string}   props.iconName      icon name
 * @param {Function} props.setAttributes block attribute update function
 * @param {number}   props.size          icon size
 * @function Object() { [native code] }
 */
function UbIcon({ iconName, size, setAttributes }) {
	return (
		<Fragment>
			<UbIconComponent iconName={iconName} size={size} />
			<UbIconInspector />
		</Fragment>
	);
}

/**
 * @module UbIcon
 */
export default UbIcon;
