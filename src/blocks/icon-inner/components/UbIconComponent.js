import React from 'react';

/**
 * Ub icon editor component.
 *
 * @param {Object} props          component properties
 * @param {string} props.iconName icon name
 * @param {number} props.size     icon size in px
 * @function Object() { [native code] }
 */
function UbIconComponent({ iconName, size }) {
	/**
	 * Whether component is empty or not.
	 *
	 * @return {boolean} empty status
	 */
	const isEmpty = () => {
		return !iconName || iconName === '';
	};

	const wrapperStyles = () => {
		return {
			width: `${size}px`,
			height: `${size}px`,
		};
	};

	return (
		<div
			style={wrapperStyles()}
			data-empty={isEmpty()}
			className={'ultimate-blocks-icon-component'}
		></div>
	);
}

/**
 * @module UbIconEditor
 */
export default UbIconComponent;
