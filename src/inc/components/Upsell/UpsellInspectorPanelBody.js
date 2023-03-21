import React from 'react';
import { PanelBody } from '@wordpress/components';

/**
 * General inspector panel body dedicated only to hold upsell controls.
 *
 * @param {Object}                         props          component properties
 * @param {string}                         props.title    panel title
 * @param {JSX.Element | Function | Array} props.children component children
 * @function Object() { [native code] }
 */
function UpsellInspectorPanelBody({ title, children }) {
	return (
		<PanelBody initialOpen={false} title={title}>
			{children}
		</PanelBody>
	);
}

/**
 * @module UpsellInspectorPanelBody.
 */
export default UpsellInspectorPanelBody;
