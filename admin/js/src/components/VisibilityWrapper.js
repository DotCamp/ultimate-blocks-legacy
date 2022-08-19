// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';

/**
 * Wrapper for handling visibility changes of its children.
 *
 * @param {Object} props component properties
 * @param {React.ElementType} props.children component children
 * @param {Boolean} props.visibilityStatus component visibility status
 *
 * @constructor
 */
function VisibilityWrapper( { children, visibilityStatus } ) {
	const wrapper = useRef();

	useEffect( () => {
		wrapper.current.addEventListener( 'animationend', ( { animationName } ) => {
			wrapper.current.style.display = animationName === 'disappear' ? 'none' : 'block';
		} );
	}, [] );

	return (
		<div ref={ wrapper } className={ 'visibility-wrapper' } data-visible={ JSON.stringify( visibilityStatus ) }>
			{ children }
		</div>
	);
}

/**
 * @module VisibilityWrapper
 */
export default VisibilityWrapper;
