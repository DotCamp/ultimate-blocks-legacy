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
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: marginObj?.top,
		marginRight: marginObj?.right,
		marginBottom: marginObj?.bottom,
		marginLeft: marginObj?.left,
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
