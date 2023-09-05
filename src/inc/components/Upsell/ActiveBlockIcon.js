import { createElement } from 'react';

/**
 * Component for displaying active block's icon component.
 *
 * @param {Object} props            component properties
 * @param {Object} props.iconObject icon object, will be supplied via HOC
 * @function Object() { [native code] }
 */
function ActiveBlockIcon( { iconObject } ) {
	// TODO [ErdemBircan] remove after testing
	// const { type, props } = iconObject;
	//
	// return (
	// 	<div className={ 'ub-active-block-icon' }>
	// 		{ createElement( type, props ) }
	// 	</div>
	// );
	return 'i';
}

/**
 * @module ActiveBlockIcon
 */
export default ActiveBlockIcon;
