import React from 'react';

/**
 * Modal button types.
 *
 * @type {{PRIO: string, BASIC: string}}
 */
export const modalButtonTypes = {
	BASIC: 'basic',
	PRIO: 'prio',
};

/**
 * Button component for upsell modal.
 *
 * @param {Object}                       props              component properties
 * @param {Array | JSX.Element | string} props.children     component children
 * @param {Function}                     props.clickHandler button click handler
 * @param {string}                       [props.type=basic] button type
 * @function Object() { [native code] }
 */
function UpsellModalButton({
	children,
	clickHandler,
	type = modalButtonTypes.BASIC,
}) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			data-ub-upsell-button-type={type}
			className={'ub-upsell-modal-button'}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				clickHandler(e);
			}}
		>
			{children}
		</div>
	);
}

/**
 * @module UpsellModalButton
 */
export default UpsellModalButton;
