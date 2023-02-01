import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

/**
 * Generate key values.
 *
 * @param {Object} containerObj container object
 * @return {Array<Object>} key values
 */
const generateValues = (containerObj) => {
	return Object.keys(containerObj)
		.filter((key) =>
			Object.prototype.hasOwnProperty.call(containerObj, key)
		)
		.map((objKey) => containerObj[objKey]);
};

const fasValues = generateValues(fas);
const fabValues = generateValues(fab);

/**
 * Get prefix for given icon name.
 *
 * @param {string} targetIconName icon name
 *
 * @return {string | null} prefix, null if no suitable prefix is found
 */
export const getIconPrefix = (targetIconName) => {
	return [
		['fas', fasValues],
		['fab', fabValues],
	].reduce((carry, [prefix, values]) => {
		if (values.some(({ iconName }) => iconName === targetIconName)) {
			carry = prefix;
		}
		return carry;
	}, null);
};
