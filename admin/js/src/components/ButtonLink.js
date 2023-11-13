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
 * @param {Object}   props                component properties
 * @param {string}   props.url            target url
 * @param {Function} props.onClickHandler click handler callback, if provided, url direction will be ignored
 * @param {string}   props.type           button link type, should be one of ButtonLinkType object values
 * @param {string}   props.title          button title
 * @class
 */
function ButtonLink({
	title,
	url = null,
	onClickHandler = null,
	type = ButtonLinkType.DEFAULT,
}) {
	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (!url && !onClickHandler) {
			throw new ButtonLinkNoUrlError();
		}
	}, []);

	/**
	 * Redirect to component url.
	 */
	const redirect = () => {
		window.open(url, '_blank');
	};

	/**
	 * Button clicked logic.
	 *
	 * @param {Event} e click event
	 */
	const buttonClicked = (e) => {
		if (onClickHandler && typeof onClickHandler === 'function') {
			onClickHandler(e);
		} else {
			redirect();
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
		<div
			className={'ub-button-link'}
			data-buttonlink-type={type}
			onClick={buttonClicked}
			role={'button'}
		>
			{title}
		</div>
	);
}

/**
 * @module ButtonLink
 */
export default ButtonLink;
