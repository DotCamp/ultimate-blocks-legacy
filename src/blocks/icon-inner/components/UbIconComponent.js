import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Ub icon editor component.
 *
 * @param {Object} props          component properties
 * @param {string} props.iconName icon name
 * @param {number} props.size     icon size in px
 * @param {string} props.prefix   icon prefix
 * @function Object() { [native code] }
 */
function UbIconComponent({ iconName, size, prefix }) {
	/**
	 * Whether component is empty or not.
	 *
	 * @return {boolean} empty status
	 */
	const isEmpty = () => {
		return !prefix || !iconName || iconName === '';
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
		>
			{!isEmpty() && (
				<FontAwesomeIcon
					className={'ultimate-blocks-icon-component-svg-base'}
					icon={[prefix, iconName]}
				/>
			)}
		</div>
	);
}

/**
 * @module UbIconEditor
 */
export default UbIconComponent;
