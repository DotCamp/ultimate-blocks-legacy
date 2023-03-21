import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

/**
 * Pro panel container for inspector upsell controls and panel bodies.
 *
 * @param {Object}                          props          component properties
 * @param {JSX.Element | Function | Array } props.children component children
 * @function Object() { [native code] }
 */
function UpsellProPanel({ children }) {
	return (
		<PanelBody
			className={'ub-upsell-pro-panel'}
			initialOpen={false}
			title={__('PRO', 'ultimate-blocks')}
		>
			{children}
		</PanelBody>
	);
}

/**
 * @module UpsellProPanel
 */
export default UpsellProPanel;
