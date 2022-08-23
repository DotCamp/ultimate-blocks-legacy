// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * Button types.
 * @type {Object}
 */
export const BUTTON_TYPES = {
	NEGATIVE: 'negative',
	POSITIVE: 'positive',
};

/**
 * Menu button component.
 *
 * @param {Object} props component properties
 * @param {String} props.title button title
 * @param {Function} [props.onClickHandler=()=>{}] click callback
 * @param {Boolean} [props.status=false] enabled status
 * @param {String} [props.type='negative'] button type
 * @constructor
 */
function MenuButton( { title, onClickHandler = () => {}, status = false, type = BUTTON_TYPES.NEGATIVE } ) {
	const typeClass = () => {
		let buttonClass = '';

		switch ( type ) {
			case BUTTON_TYPES.NEGATIVE: {
				buttonClass = 'ub-negative-bg';
				break;
			}
			case BUTTON_TYPES.POSITIVE: {
				buttonClass = 'ub-positive-bg';
				break;
			}
		}

		return buttonClass;
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div onClick={ () => {
			if ( status ) {
				onClickHandler();
			}
		} } className={ `ub-menu-button ${ typeClass() }` } data-enabled={ JSON.stringify( status ) }>
			{ title }
		</div>
	);
}

/**
 * @module MenuButton
 */
export default MenuButton;
