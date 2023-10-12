import React, { useEffect } from 'react';
import ButtonLinkNoUrlError from '$AdminInc/err/ButtonLinkNoUrlError';

/**
 * Button link type.
 *
 * @type {{TEXT: string, PRIMARY: string, DEFAULT: string}}
 */
export const ButtonLinkType = {
	TEXT: 'text',
	DEFAULT: 'default',
	PRIMARY: 'primary',
};

/**
 * Button link component.
 *
 * @param {Object} props       component properties
 * @param {string} props.url   target url
 * @param {string} props.type  button link type, should be one of ButtonLinkType object values
 * @param {string} props.title button title
 * @class
 */
function ButtonLink( { title, url = null, type = ButtonLinkType.DEFAULT } ) {
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
			className={ 'ub-button-link' }
			data-buttonlink-type={ type }
			onClick={ redirect }
			role={ 'button' }
		>
			{ title }
		</div>
	);
}

/**
 * @module ButtonLink
 */
export default ButtonLink;
