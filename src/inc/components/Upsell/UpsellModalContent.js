import React from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Upsell modal content component.
 *
 * @param {Object} props             component properties
 * @param {string} props.ssUrl       screenshot url
 * @param {string} props.description content description
 * @function Object() { [native code] }
 */
function UpsellModalContent({ ssUrl, description }) {
	return (
		<div className={'ub-upsells-modal-content'}>
			<div className={'ub-upsells-modal-content-image'}>
				<img alt={__('feature sample screenshot')} src={ssUrl} />
			</div>
			<div className={'ub-upsells-modal-content-description'}>
				{description}
			</div>
		</div>
	);
}

/**
 * @module UpsellModalContent
 */
export default UpsellModalContent;
