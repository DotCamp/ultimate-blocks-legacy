import React from 'react';
import BoxContentTitle from '$Components/BoxContent/BoxContentTitle';
import BoxContentInc from '$Components/BoxContent/BoxContentInc';

export const BoxContentLayout = {
	HORIZONTAL: 'horizontal',
	VERTICAL: 'vertical',
};

/**
 * Box content component.
 *
 * @param {Object}        props                                    component properties
 * @param {string | null} props.title                              box title
 * @param {string | null} props.content                            box content
 * @param {string}        [props.layout=BoxContentLayout.VERTICAL] box layout, available values can be found in BoxContentLayout object
 * @param {Function}      props.children                           component children
 */
function BoxContent( {
	title = null,
	content = null,
	layout = BoxContentLayout.VERTICAL,
	children,
} ) {
	return (
		<div className={ 'ub-box-content' } data-layout={ layout }>
			{ title && <BoxContentTitle>{ title }</BoxContentTitle> }
			{ content && <BoxContentInc>{ content }</BoxContentInc> }
			{ children }
		</div>
	);
}

/**
 * @module BoxContent
 */
export default BoxContent;
