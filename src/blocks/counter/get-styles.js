/**
 * WordPress Dependencies
 */
import { isUndefined, trim, isEmpty, omitBy } from "lodash";
import {
	getSpacingCss,
	getSpacingPresetCssVar,
} from "../utils/styling-helpers";
/**
 *
 * @param {Array} attributes
 *
 * @return {object} - Block styles
 */

export function getStyles(attributes) {
	const { padding, margin } = attributes;

	const paddingObj = getSpacingCss(padding);
	const marginObj = getSpacingCss(margin);
	const gap = getSpacingPresetCssVar(attributes.gap?.all) ?? "";
	let styles = {
		"--ub-counter-label-color": attributes?.labelColor,
		"--ub-counter-font-size": attributes?.counterFontSize,
		"--ub-counter-label-font-size": attributes?.labelFontSize,
		"--ub-counter-padding-top": paddingObj?.top,
		"--ub-counter-padding-right": paddingObj?.right,
		"--ub-counter-padding-bottom": paddingObj?.bottom,
		"--ub-counter-padding-left": paddingObj?.left,
		"--ub-counter-margin-top": marginObj?.top,
		"--ub-counter-margin-right": marginObj?.right,
		"--ub-counter-margin-bottom": marginObj?.bottom,
		"--ub-counter-margin-left": marginObj?.left,
		"--ub-counter-gap": gap,
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
