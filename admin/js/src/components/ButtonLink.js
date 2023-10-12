import React, { useEffect } from 'react';
import ButtonLinkNoUrlError from '$AdminInc/err/ButtonLinkNoUrlError';

/**
 * Button link type.
 *
 * @type {{TEXT: string, PRIMARY: string, DEFAULT: string}}
 */
const ButtonLinkType = {
	TEXT: 'text',
	DEFAULT: 'default',
	PRIMARY: 'primary',
};

/**
 * Button link component.
 *
 * @param {Object}         props      component properties
 * @param {string}         props.url  target url
 * @param {ButtonLinkType} props.type button link type
 * @class
 */
function ButtonLink( { url = null, type = ButtonLinkType.DEFAULT } ) {
	/**
	 * useEffect hook.
	 */
	useEffect( () => {
		if ( ! url ) {
			throw new ButtonLinkNoUrlError();
		}
	}, [] );

	/**
	 * Redirect to component url.
	 */
	const redirect = () => {
		window.open( url, '_blank' );
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
		<div
			data-buttonlink-type={ type }
			onClick={ redirect }
			role={ 'button' }
		></div>
	);
}

/**
 * @module ButtonLink
 */
export default ButtonLink;
