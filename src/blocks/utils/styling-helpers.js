/**
 * Checks is given value is a spacing preset.
 *
 * @param {string} value Value to check
 *
 * @return {boolean} Return true if value is string in format var:preset|spacing|.
 */
export function isValueSpacingPreset(value) {
	if (!value?.includes) {
		return false;
	}
	return value === "0" || value.includes("var:preset|spacing|");
}

/**
 * Converts a spacing preset into a custom value.
 *
 * @param {string} value Value to convert.
 *
 * @return {string | undefined} CSS var string for given spacing preset value.
 */
export function getSpacingPresetCssVar(value) {
	if (!value) {
		return;
	}

	const slug = value.match(/var:preset\|spacing\|(.+)/);

	if (!slug) {
		return value;
	}

	return `var(--wp--preset--spacing--${slug[1]})`;
}

export function getSpacingCss(object) {
	let css = {};
	for (const [key, value] of Object.entries(object)) {
		if (isValueSpacingPreset(value)) {
			css[key] = getSpacingPresetCssVar(value);
		} else {
			css[key] = value;
		}
	}
	return css;
}
