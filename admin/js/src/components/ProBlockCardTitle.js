import React from 'react';

/**
 * Pro block card control title.
 *
 * @param {Object}  props       component properties
 * @param {boolean} props.isPro block pro status
 */
function ProBlockCardTitle({ isPro }) {
	return isPro && <span className={'pro-block-card-title-suffix'}>PRO</span>;
}

/**
 * @module CouponCardProTitle
 */
export default ProBlockCardTitle;
