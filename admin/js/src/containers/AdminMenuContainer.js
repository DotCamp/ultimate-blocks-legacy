// eslint-disable-next-line no-unused-vars
import React from 'react';
import MenuHeader from '$Components/MenuHeader';
import Content from '$Components/Content';
import UpsellModalSettingsMenu from '$Components/UpsellModalSettingsMenu';

/**
 * Container for admin menu.
 *
 * @return {JSX.Element} container component
 * @function Object() { [native code] }
 */
function AdminMenuContainer() {
	return (
		<div className={'ub-admin-menu-container'}>
			<UpsellModalSettingsMenu />
			<MenuHeader />
			<Content />
		</div>
	);
}

/**
 * @module AdminMenuContainer
 */
export default AdminMenuContainer;
