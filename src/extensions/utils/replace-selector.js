import { isString } from "lodash";
export function replaceSelector(css, clientId) {
	if (!isString(css)) {
		return css;
	}

	return css.replace(/(\bselector\b)/g, `.wp-block[data-block="${clientId}"]`);
}
