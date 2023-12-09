// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * Menu right container item.
 *
 * @param {Object}            props            component properties
 * @param {React.ElementType} props.children   component children
 * @param {Array}             props.classNames component class names
 * @class
 */
function RightContainerItem({ children, classNames = [] }) {
	return (
		<div className={['right-container-item', ...classNames].join(' ')}>
			{children}
		</div>
	);
}

/**
 * @module RightContainerItem
 */
export default RightContainerItem;
