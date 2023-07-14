/**
 * Get current env mode.
 *
 * @return {string} env mode
 */
export const currentMode = () => {
	return UB_ENV;
};

/**
 * Check target mode against current env mode.
 *
 * @param {string} against target mode to check for
 * @return {boolean} match
 */
const modeCheck = (against) => {
	return currentMode() === against;
};

/**
 * Check if current env is development.
 *
 * @return {boolean} match
 */
export const modeCheckDev = () => {
	return modeCheck('development');
};

/**
 * Check if current env is production.
 *
 * @return {boolean} match
 */
export const modeCheckProd = () => {
	return modeCheck('production');
};
