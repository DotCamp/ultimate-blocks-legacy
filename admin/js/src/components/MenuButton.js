// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * Menu button component.
 *
 * @param {Object} props component properties
 * @param {String} props.title button title
 * @param {Function} [props.onClickHandler=()=>{}] click callback
 * @param {Boolean} [props.status=false] disabled status
 * @constructor
 */
function MenuButton( { title, onClickHandler = () => {}, status = false } ) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div onClick={ () => {
			if ( status ) {
				onClickHandler();
			}
		} } className={ 'ub-menu-button' } data-enabled={ JSON.stringify( status ) }>
			{ title }
		</div>
	);
}

/**
 * @module MenuButton
 */
export default MenuButton;
