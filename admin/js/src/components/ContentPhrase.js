import React from 'react';

/**
 * Content phrase component.
 *
 * @param {Object}                       props          component properties
 * @param {JSX.Element | Array | string} props.children component children
 */
function ContentPhrase({ children }) {
	return <div className={'content-phrase'}>{children} </div>;
}

/**
 * @module ContentPhrase
 */
export default ContentPhrase;
