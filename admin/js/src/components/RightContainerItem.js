// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * Menu right container item.
 *
 * @param {Object} props component properties
 * @param {React.ElementType}  props.children component children
 * @constructor
 */
function RightContainerItem( { children } ) {
	return (
		<div className={ 'right-container-item' }>
			{ children }
		</div>
	);
}

/**
 * @module RightContainerItem
 */
export default RightContainerItem;
