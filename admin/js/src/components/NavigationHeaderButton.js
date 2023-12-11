import React from 'react';

/**
 * Navigation header button component.
 *
 * @param {Object}   props                component properties
 * @param {string}   props.title          button title
 * @param {string}   props.targetPath     target path
 * @param {Function} props.onClickHandler click handler, will call with targetPath as first argument
 * @param {boolean}  props.isActive       button active status
 * @class
 */
function NavigationHeaderButton({
	title,
	targetPath,
	onClickHandler,
	isActive = false,
}) {
	const onClickHandlerDefault = () => onClickHandler(targetPath);

	return (
		<div
			data-active={isActive}
			data-path={targetPath}
			className={'ub-menu-navigation-header-button'}
			tabIndex={0}
			role={'button'}
			onClick={onClickHandlerDefault}
			onKeyDown={onClickHandlerDefault}
		>
			{title}
		</div>
	);
}

/**
 * @module NavigationHeaderButton
 */
export default NavigationHeaderButton;
