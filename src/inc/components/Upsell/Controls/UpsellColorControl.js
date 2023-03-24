import React from 'react';
import withUpsellControlWrapper from '$Inc/hoc/withUpsellControlWrapper';
import { PanelColorSettings } from '@wordpress/block-editor';

/**
 * Color control for upsell features.
 *
 * @param {Object} props component properties
 * @function Object() { [native code] }
 */
function UpsellColorControl(props) {
	return <PanelColorSettings {...props} />;
}

/**
 * @module UpsellToggleControl
 */
export default withUpsellControlWrapper(UpsellColorControl);
