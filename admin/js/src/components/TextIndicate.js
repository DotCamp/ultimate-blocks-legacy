// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * Component for indicating given text.
 * @param {Object} props component properties
 * @param {React.ElementType} children children
 * @constructor
 */
function TextIndicate( { children } ) {
	return (
		<span className={ 'text-indicate' }>{ children }</span>
	);
}

/**
 * @module TextIndicate
 */
export default TextIndicate;
