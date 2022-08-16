// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminMenuContainer from "$Containers/AdminMenuContainer";
import "$Styles/ub-admin-settings.scss";
import AdminMenuWrapper from "$Components/AdminMenuWrapper";
import MenuContext from "$Components/MenuContext";

const mountPoint = document.querySelector( '#ub-admin-menu' );

if ( mountPoint ) {
	const root = createRoot( mountPoint );

	const appData = Object.assign( {}, ubAdminMenuData );
	ubAdminMenuData = null;

	// TODO [ErdemBircan] remove for production
	console.log( appData );

	root.render(
		<AdminMenuWrapper>
			<MenuContext startupValue={ appData }><AdminMenuContainer /></MenuContext>
		</AdminMenuWrapper>
	);
} else {
	throw new Error( 'no mount point found for settings menu' );
}
