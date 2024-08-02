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
	const counterFontStyle = !isEmpty(attributes.counterFontAppearance.fontStyle)
		? attributes.counterFontAppearance.fontStyle
		: "";
	const counterFontWeight = !isEmpty(
		attributes.counterFontAppearance.fontWeight,
	)
		? attributes.counterFontAppearance.fontWeight
		: "";
	const labelFontStyle = !isEmpty(attributes.labelFontAppearance.fontStyle)
		? attributes.labelFontAppearance.fontStyle
		: "";
	const labelFontWeight = !isEmpty(attributes.labelFontAppearance.fontWeight)
		? attributes.labelFontAppearance.fontWeight
		: "";

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
		"--ub-counter-font-family": attributes.counterFontFamily,
		"--ub-counter-label-font-family": attributes.labelFontFamily,
		"--ub-counter-decoration": attributes.counterDecoration,
		"--ub-counter-label-decoration": attributes.labelDecoration,
		"--ub-counter-line-height": attributes.counterLineHeight,
		"--ub-counter-label-line-height": attributes.labelLineHeight,
		"--ub-counter-letter-spacing": attributes.counterLetterSpacing,
		"--ub-counter-label-letter-spacing": attributes.labelLetterSpacing,
		"--ub-counter-label-font-style": labelFontStyle,
		"--ub-counter-label-font-weight": labelFontWeight,
		"--ub-counter-font-style": counterFontStyle,
		"--ub-counter-font-weight": counterFontWeight,
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
