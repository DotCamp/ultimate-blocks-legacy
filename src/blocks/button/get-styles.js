import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { getBorderVariablesCss, getSpacingCss } from "../utils/styling-helpers";

export function getStyles(attributes) {
	const {
		padding,
		margin,
		borderRadius,
		buttonColor,
		buttonHoverColor,
		buttonTextColor,
		buttonTextHoverColor,
		buttonIsTransparent,
		border,
	} = attributes;
	const paddingObj = getSpacingCss(padding);
	const marginObj = getSpacingCss(margin);
	const borderValues = getBorderVariablesCss(border, "button");

	let styles = {
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: marginObj?.top,
		marginRight: marginObj?.right,
		marginBottom: marginObj?.bottom,
		marginLeft: marginObj?.left,
		"--ub-button-bg-color": buttonIsTransparent ? "transparent" : buttonColor,
		"--ub-button-text-color": buttonIsTransparent
			? buttonColor
			: buttonTextColor,
		borderTopLeftRadius: borderRadius?.topLeft,
		borderTopRightRadius: borderRadius?.topRight,
		borderBottomLeftRadius: borderRadius?.bottomLeft,
		borderBottomRightRadius: borderRadius?.bottomRight,
		"--ub-button-hover-bg-color": buttonIsTransparent
			? "transparent"
			: buttonHoverColor,
		"--ub-button-hover-text-color": buttonIsTransparent
			? buttonHoverColor
			: buttonTextHoverColor,
		...borderValues,
	};

	return omitBy(
		styles,
		(value) =>
			value === false ||
			isEmpty(value) ||
			isUndefined(value) ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined",
	);
}
