import React from 'react';
import BoxContentTitle from '$Components/BoxContent/BoxContentTitle';
import BoxContentInc from '$Components/BoxContent/BoxContentInc';

/**
 * Box content layout types.
 *
 * @type {{VERTICAL: string, HORIZONTAL: string}}
 */
export const BoxContentLayout = {
	HORIZONTAL: 'horizontal',
	VERTICAL: 'vertical',
};

/**
 * Box content size types.
 *
 * @type {{normal: string, JUMBO: string}}
 */
export const BoxContentSize = {
	JUMBO: 'jumbo',
	NORMAL: 'normal',
};

/**
 * Box content component.
 *
 * @param {Object}        props                                    component properties
 * @param {string | null} props.title                              box title
 * @param {string | null} props.content                            box content
 * @param {string}        [props.layout=BoxContentLayout.VERTICAL] box layout, available values can be found in BoxContentLayout object
 * @param {string}        [props.size=BoxContentLayout.NORMAL]     box size, available values can be found in BoxContentSize object
 * @param {Function}      props.children                           component children
 */
function BoxContent( {
	title = null,
	content = null,
	layout = BoxContentLayout.VERTICAL,
	size = BoxContentSize.NORMAL,
	children,
} ) {
	return (
		<div
			className={ 'ub-box-content' }
			data-layout={ layout }
			data-size={ size }
		>
			<div className={ 'ub-box-content-title-inc-wrapper' }>
				{ title && <BoxContentTitle>{ title }</BoxContentTitle> }
				{ content && <BoxContentInc>{ content }</BoxContentInc> }
			</div>
			<div className={ 'ub-box-content-footer' }>{ children }</div>
		</div>
	);
}

/**
 * @module BoxContent
 */
export default BoxContent;
