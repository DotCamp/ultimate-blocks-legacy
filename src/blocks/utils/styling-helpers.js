import { omitBy, isUndefined, trim, isEmpty } from "lodash";

function hasSplitBorders(border = {}) {
	const sides = ["top", "right", "bottom", "left"];

	for (const side in border) {
		if (sides.includes(side)) {
			return true;
		}
	}

	return false;
}
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

/**
 * Function that's help you to generate splitted or non splitted border CSS.
 * @param {object} object border attributes
 *
 * @return {{ css:object }} A css object
 */
export const getBorderCSS = (object) => {
	let css = {};

	if (!hasSplitBorders(object)) {
		css["top"] = object;
		css["right"] = object;
		css["bottom"] = object;
		css["left"] = object;
		return css;
	}
	return object;
};
/**
 *  Check values are mixed.
 * @param {any} values - value string or object
 * @returns true | false
 */
export function hasMixedValues(values = {}) {
	return typeof values === "string";
}
export function splitBorderRadius(value) {
	const isValueMixed = hasMixedValues(value);
	const splittedBorderRadius = {
		topLeft: value,
		topRight: value,
		bottomLeft: value,
		bottomRight: value,
	};
	return isValueMixed ? splittedBorderRadius : value;
}

export function getSingleSideBorderValue(border, side) {
	const hasWidth = !isEmpty(border[side]?.width);
	return `${border[side]?.width ?? ""} ${
		hasWidth && isEmpty(border[side]?.style)
			? "solid"
			: border[side]?.style ?? ""
	} ${hasWidth && isEmpty(border[side]?.color) ? "" : border[side]?.color}`;
}

export function getBorderVariablesCss(border, slug) {
	const borderInFourDimension = getBorderCSS(border);
	const borderSides = ["top", "right", "bottom", "left"];
	let borders = {};
	for (let i = 0; i < borderSides.length; i++) {
		const side = borderSides[i];
		const sideProperty = [`--ub-${slug}-border-${side}`];
		const sideValue = getSingleSideBorderValue(borderInFourDimension, side);
		borders[sideProperty] = sideValue;
	}

	return borders;
}

export function generateStyles(styles) {
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

export function getBackgroundColorVar(
	attributes,
	bgColorAttrKey,
	gradientAttrKey,
) {
	if (!isEmpty(attributes[bgColorAttrKey])) {
		return attributes[bgColorAttrKey];
	} else if (!isEmpty(attributes[gradientAttrKey])) {
		return attributes[gradientAttrKey];
	} else {
		return "";
	}
}
