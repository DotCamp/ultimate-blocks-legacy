// eslint-disable-next-line no-unused-vars
import React from 'react';
import MenuHeader from "$Components/MenuHeader";
import MenuContent from "$Components/MenuContent";

/**
 * Container for admin menu.
 * @returns {JSX.Element} container component
 * @constructor
 */
function AdminMenuContainer() {
	return (
		<div className={ 'ub-admin-menu-container' }>
			<MenuHeader />
			<MenuContent />
		</div>
	);
}

/**
 * @module AdminMenuContainer
 */
export default AdminMenuContainer;

