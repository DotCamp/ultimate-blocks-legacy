// eslint-disable-next-line no-unused-vars
import React from 'react';
import MenuHeader from '$Components/MenuHeader';
import Content from '$Components/Content';

/**
 * Container for admin menu.
 *
 * @return {JSX.Element} container component
 * @function Object() { [native code] }
 */
function AdminMenuContainer() {
	return (
		<div className={'ub-admin-menu-container'}>
			<MenuHeader />
			<Content />
		</div>
	);
}

/**
 * @module AdminMenuContainer
 */
export default AdminMenuContainer;
