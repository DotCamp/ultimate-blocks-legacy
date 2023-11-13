import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Hamburger menu component.
 *
 * @param {Object}   props              component properties
 * @param {boolean}  props.status       menu status, whether it is open or not
 * @param {Function} props.clickHandler click handler
 * @param {string}   props.openIcon     open fontawesome icon
 * @param {string}   props.closeIcon    close fontawesome icon
 * @class
 */
function HamburgerMenu({
	status = false,
	clickHandler,
	openIcon = 'fa-solid fa-bars',
	closeIcon = 'fa-solid fa-xmark',
}) {
	return (
		<div className={'ub-hamburger-menu'}>
			<div
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						clickHandler();
					}
				}}
				role={'button'}
				className={'ub-hamburger-menu-icon-wrapper'}
				onClick={(e) => {
					e.preventDefault();
					clickHandler();
				}}
			>
				{!status ? (
					<div data-status={!status} data-menu-icon-id={'open'}>
						<FontAwesomeIcon icon={openIcon} />
					</div>
				) : (
					<div data-status={status} data-menu-icon-id={'close'}>
						<FontAwesomeIcon icon={closeIcon} />
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * @module HamburgerMenu
 */
export default HamburgerMenu;
