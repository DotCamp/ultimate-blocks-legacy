/**
 * WordPress Dependencies
 */
import { isUndefined, trim, isEmpty, omitBy } from "lodash";
/**
 *
 * @param {Array} attributes
 *
 * @return {object} - Block styles
 */

export function getStyles(attributes) {
	let styles = {
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
