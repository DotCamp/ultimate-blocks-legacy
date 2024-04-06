import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Info control button for pro extension cards.
 *
 * @param {Object}   props             component properties
 * @param {Function} props.handleClick click callback
 */
function ExtensionCardProInfoControl({ handleClick }) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus
		<div
			role={'button'}
			className={'pro-block-card-info-button'}
			onClick={handleClick}
		>
			<FontAwesomeIcon icon="fa-solid fa-circle-info" />
		</div>
	);
}

/**
 * @module ExtensionCardProInfoControl
 */
export default ExtensionCardProInfoControl;
