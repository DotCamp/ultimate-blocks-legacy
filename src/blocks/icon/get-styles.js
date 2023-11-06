/**
 * WordPress Dependencies
 */
import { isUndefined, trim, isEmpty, omitBy, isNumber } from "lodash";
/**
 * Custom Dependencies
 */
import { getSpacingCss } from "../utils/styling-helpers";
/**
 *
 * @param {Array} attributes
 *
 * @return {object} - Block styles
 */

export function getStyles(attributes) {
	const rotation = isNumber(attributes?.iconRotation)
		? `rotate(${attributes.iconRotation}deg)`
		: "";
	const paddingObj = getSpacingCss(attributes.padding);
	const marginObj = getSpacingCss(attributes.margin);

	let styles = {
		"--ub-icon-rotation": rotation,
		"--ub-icon-size": attributes?.size,
		"--ub-icon-color": attributes?.iconColor,
		"--ub-icon-bg-color": !isEmpty(attributes?.iconBackground)
			? attributes.iconBackground
			: attributes?.iconGradientBackground,
		"--ub-icon-hover-color": attributes?.iconHoverColor,
		"--ub-icon-bg-hover-color": !isEmpty(attributes?.iconHoverBackground)
			? attributes?.iconHoverBackground
			: attributes?.iconHoverGradientBackground,
		"--ub-icon-justification": attributes?.justification,
		"--ub-icon-padding-top": paddingObj?.top,
		"--ub-icon-padding-right": paddingObj?.right,
		"--ub-icon-padding-bottom": paddingObj?.bottom,
		"--ub-icon-padding-left": paddingObj?.left,
		"--ub-icon-margin-top": marginObj?.top,
		"--ub-icon-margin-right": marginObj?.right,
		"--ub-icon-margin-bottom": marginObj?.bottom,
		"--ub-icon-margin-left": marginObj?.left,
	};

	return omitBy(styles, (value) => {
		return (
			isUndefined(value) ||
			value === false ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined" ||
			isEmpty(value)
		);
	});
}
