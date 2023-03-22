import React from 'react';
import { SelectControl } from '@wordpress/components';
import withUpsellControlWrapper from '$Inc/hoc/withUpsellControlWrapper';

/**
 * Select control for upsell features.
 *
 * @param {Object} props component properties
 * @function Object() { [native code] }
 */
function UpsellSelectControl(props) {
	return <SelectControl {...props} />;
}

/**
 * @module UpsellToggleControl
 */
export default withUpsellControlWrapper(UpsellSelectControl);
