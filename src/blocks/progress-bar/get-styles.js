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
		"--ub-bar-top-left-radius": attributes?.barBorderRadius?.topLeft,
		"--ub-bar-top-right-radius": attributes?.barBorderRadius?.topRight,
		"--ub-bar-bottom-left-radius": attributes?.barBorderRadius?.bottomLeft,
		"--ub-bar-bottom-right-radius": attributes?.barBorderRadius?.bottomRight,
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
