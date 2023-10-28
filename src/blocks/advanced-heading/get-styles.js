import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { getSpacingCss } from "../utils/styling-helpers";

export function getStyles(attributes) {
	const {
		padding,
		alignment,
		textColor,
		backgroundColor,
		fontSize,
		textTransform,
		letterSpacing,
		fontFamily,
		fontWeight,
		lineHeight,
	} = attributes;
	const paddingObj = getSpacingCss(padding);
	let styles = {
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		textAlign: alignment,
		color: textColor,
		backgroundColor,
		fontSize: fontSize ? `${fontSize}px` : null,
		letterSpacing,
		textTransform,
		fontFamily: fontFamily.includes(" ") ? `'${fontFamily}'` : fontFamily,
		fontWeight,
		lineHeight: lineHeight ? `${lineHeight}px` : null,
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
