import React from 'react';

/**
 * Pro block card control title.
 *
 * @param {Object}  props       component properties
 * @param {boolean} props.isPro block pro status
 */
function ProExtensionCardTitle({ isPro }) {
	return isPro && <span className={'pro-block-card-title-suffix'}>PRO</span>;
}

/**
 * @module ProTitle
 */
export default ProExtensionCardTitle;
