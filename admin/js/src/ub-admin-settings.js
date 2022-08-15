// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminMenuContainer from "$Containers/AdminMenuContainer";
import "$Styles/ub-admin-settings.sass";

const mountPoint = document.querySelector( '#ub-admin-menu' );

if ( mountPoint ) {
	const root = createRoot( mountPoint );

	root.render(
		<AdminMenuContainer />
	);
} else {
	throw new Error( 'no mount point found for settings menu' );
}
