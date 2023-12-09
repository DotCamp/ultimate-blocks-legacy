import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { getSpacingCss } from "../utils/styling-helpers";

export function getStyles(attributes) {
	const { padding, margin, countdownColor, unitColor } = attributes;
	const paddingObj = getSpacingCss(padding);
	const marginObj = getSpacingCss(margin);

	let styles = {
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: !isEmpty(marginObj?.top) ? marginObj?.top : "",
		marginRight: !isEmpty(marginObj?.right) ? marginObj?.right : " ",
		marginBottom: !isEmpty(marginObj?.bottom) ? marginObj?.bottom : "",
		marginLeft: !isEmpty(marginObj?.left) ? marginObj?.left : "",
		"--ub-countdown-unit-color": unitColor,
		"--ub-countdown-digit-color": countdownColor,
	};

	return omitBy(
		styles,
		(value) =>
			value === false ||
			isEmpty(value) ||
			isUndefined(value) ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined"
	);
}
