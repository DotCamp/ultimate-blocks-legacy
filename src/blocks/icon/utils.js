/**
 *
 * @param {string} svgString
 *
 * @returns {true|false} true if valid false is not valid
 */
export function isValidSVG(svgString) {
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgString.trim(), "image/svg+xml");
	const errors = svgDoc.getElementsByTagName("parsererror");

	return errors.length === 0;
}
