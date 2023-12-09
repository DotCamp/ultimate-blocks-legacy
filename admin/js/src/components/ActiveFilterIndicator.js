// eslint-disable-next-line no-unused-vars
import React, { createRef, useEffect } from 'react';

/**
 * Generate indicator position data.
 *
 * @param {number} x     x position
 * @param {number} width width
 * @return {Object} position data
 */
export const generateIndicatorData = (x, width) => {
	return { x, width };
};

/**
 * Active item indicator for filter component.
 *
 * @param {Object} props                                       component properties
 * @param {Object} [props.positionData={x:0, y:0, width: 100}] position data
 * @class
 */
function ActiveFilterIndicator({ positionData = { x: 0, width: 100 } }) {
	/**
	 * Add px to given value
	 *
	 * @param {number} val value
	 * @return {string} post fixed value
	 */
	const toPx = (val) => {
		return `${val}px`;
	};

	return (
		<div
			style={{
				left: toPx(positionData.x),
				width: toPx(positionData.width),
			}}
			className={'active-indicator'}
		></div>
	);
}

/**
 * @module ActiveFilterIndicator
 */
export default ActiveFilterIndicator;
