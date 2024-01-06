import { isUndefined, trim, isEmpty, omitBy } from "lodash";
import { getSpacingCss } from "../utils/styling-helpers";
/**
 *
 * @param {Array} attributes
 *
 * @return {object} - Block styles
 */

export function getStyles(attributes) {
	const paddingObj = getSpacingCss(attributes.padding);
	const marginObj = getSpacingCss(attributes.margin);

	let styles = {
		"--ub-bar-top-left-radius": attributes?.barBorderRadius?.topLeft,
		"--ub-bar-top-right-radius": attributes?.barBorderRadius?.topRight,
		"--ub-bar-bottom-left-radius": attributes?.barBorderRadius?.bottomLeft,
		"--ub-bar-bottom-right-radius": attributes?.barBorderRadius?.bottomRight,
		"--ub-progress-bar-padding-top": paddingObj?.top,
		"--ub-progress-bar-padding-right": paddingObj?.right,
		"--ub-progress-bar-padding-bottom": paddingObj?.bottom,
		"--ub-progress-bar-padding-left": paddingObj?.left,
		"--ub-progress-bar-margin-top": marginObj?.top,
		"--ub-progress-bar-margin-right": marginObj?.right,
		"--ub-progress-bar-margin-bottom": marginObj?.bottom,
		"--ub-progress-bar-margin-left": marginObj?.left,
		"--ub-progress-bar-label-font-size": attributes["barThickness"] + 5 + "%",
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
