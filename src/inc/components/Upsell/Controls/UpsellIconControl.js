import React from 'react';
import withUpsellControlWrapper from '$Inc/hoc/withUpsellControlWrapper';
import { IconControl } from '$Library/ub-common/Components';

/**
 * Icon control for upsell features.
 *
 * @param {Object} props component properties
 * @function Object() { [native code] }
 */
function UpsellIconControl(props) {
	return <IconControl {...props} />;
}

/**
 * @module UpsellIconControl
 */
export default withUpsellControlWrapper(UpsellIconControl);
