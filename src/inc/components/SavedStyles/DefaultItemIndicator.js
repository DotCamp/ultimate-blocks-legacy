import React from 'react';
import { __ } from '@wordpress/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Default item indicator for saved style preview component
 *
 * @class
 */
function DefaultItemIndicator() {
	return (
		<div
			className={ 'default-item-indicator-wrapper' }
			title={ __( 'default style', 'ultimate-blocks' ) }
		>
			<FontAwesomeIcon icon="dot-circle" />
		</div>
	);
}

/**
 * @module DefaultItemIndicator
 */
export default DefaultItemIndicator;
