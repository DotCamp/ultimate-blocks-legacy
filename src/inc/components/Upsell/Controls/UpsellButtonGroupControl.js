import React from 'react';
import withUpsellControlWrapper from '$Inc/hoc/withUpsellControlWrapper';
import {
	BlackWhiteButtonGroup,
	BlackWhiteButton,
} from '$Library/ub-common/Components';

/**
 * Button Group for upsell features.
 *
 * @param {Object} props                   component properties
 * @param {Array}  [props.buttonLabels=[]] button labels
 * @function Object() { [native code] }
 */
function UpsellButtonGroupControl({ buttonLabels = [] }) {
	return (
		<BlackWhiteButtonGroup>
			{buttonLabels.map((label, index) => (
				<BlackWhiteButton key={index}>{label}</BlackWhiteButton>
			))}
		</BlackWhiteButtonGroup>
	);
}

/**
 * @module UpsellButtonGroupControl
 */
export default withUpsellControlWrapper(UpsellButtonGroupControl);
