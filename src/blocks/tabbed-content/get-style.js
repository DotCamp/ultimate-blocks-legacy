import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { getSpacingCss } from "../utils/styling-helpers";

export function getStyles(attributes) {
	const { padding, margin } = attributes;
	const paddingObj = getSpacingCss(padding);
	const marginObj = getSpacingCss(margin);

	let styles = {
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: marginObj?.top,
		marginRight: marginObj?.right,
		marginBottom: marginObj?.bottom,
		marginLeft: marginObj?.left,
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
