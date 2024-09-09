import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { getBackgroundColorVar, getSpacingCss } from "../utils/styling-helpers";

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
		"--swiper-navigation-color": attributes.navigationColor,
		"--swiper-pagination-color": attributes.activePaginationColor,
		"--swiper-inactive-pagination-color": attributes.paginationColor,
		"--swiper-navigation-background-color": getBackgroundColorVar(
			attributes,
			"navigationBackgroundColor",
			"navigationGradientColor",
		),
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
