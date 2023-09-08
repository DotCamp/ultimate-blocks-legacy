import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Info control button for pro block cards.
 *
 * @param {Object}   props             component properties
 * @param {Function} props.handleClick click callback
 */
function BlockCardProInfoControl( { handleClick } ) {
	return (
		<div className={ 'pro-block-card-info-button' } onClick={ handleClick }>
			<FontAwesomeIcon icon="fa-solid fa-circle-info" />
		</div>
	);
}

/**
 * @module BlockCardProInfoControl
 */
export default BlockCardProInfoControl;
