import React from 'react';
import { ToggleControl } from '@wordpress/components';
import withUpsellControlWrapper from '$Inc/hoc/withUpsellControlWrapper';

/**
 * Toggle control for upsell features.
 *
 * @param {Object} props component properties
 * @function Object() { [native code] }
 */
function UpsellToggleControl(props) {
	return <ToggleControl {...props} />;
}

/**
 * @module UpsellToggleControl
 */
export default withUpsellControlWrapper(UpsellToggleControl);
