// eslint-disable-next-line no-unused-vars
import React, { createElement } from 'react';

/**
 * Hoc for creating and adding icon element by using Gutenberg block icon attribute object.
 *
 * @param {React.ElementType} BaseComponent target component
 * @returns {Function} function to use as HOC
 */
const withIcon = ( BaseComponent ) => ( props ) => {
	let iconElement = 'x';
	if ( ! props.iconObject || typeof props.iconObject !== 'object' ) {
		throw new Error( 'invalid type of icon object is supplied to withIcon HOC' );
	} else {
		const { iconObject } = props;
		const { type, props: iconProps } = iconObject;

		iconElement = createElement( type, iconProps );
	}

	return <BaseComponent { ...props } iconElement={ iconElement } />;
};

/**
 * @module withIcon
 */
export default withIcon;
