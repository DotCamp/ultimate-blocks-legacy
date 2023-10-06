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
function ToggleControl( {
	status,
	onStatusChange = () => {},
	disabled = false,
} ) {
	const initialRender = useRef( true );
	const [ innerStatus, setInnerStatus ] = useState( status );

	useEffect( () => {
		if ( initialRender.current ) {
			initialRender.current = false;
		} else {
			onStatusChange( innerStatus );
		}
	}, [ innerStatus ] );

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			onClick={ () => {
				if ( ! disabled ) {
					setInnerStatus( ! innerStatus );
				}
			} }
			className={ 'ub-toggle-control' }
			data-enabled={ JSON.stringify( innerStatus ) }
		>
			<div className={ 'knob' }></div>
		</div>
	);
}

/**
 * @module ToggleControl
 */
export default ToggleControl;
