// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client';
import AdminMenuContainer from "$Containers/AdminMenuContainer";
import "$Styles/ub-admin-settings.scss";
import AdminMenuWrapper from "$Components/AdminMenuWrapper";
import settingsMenuStore from "./stores/settings-menu/settingsMenuStore";
import LocalStorageProvider from "$Components/LocalStorageProvider";

const mountPoint = document.querySelector( '#ub-admin-menu' );

if ( mountPoint ) {
	const root = createRoot( mountPoint );

	root.render(
		<AdminMenuWrapper>
			<Provider store={ settingsMenuStore() }>
				<LocalStorageProvider>
					<AdminMenuContainer />
				</LocalStorageProvider>
			</Provider>
		</AdminMenuWrapper>
	);
} else {
	throw new Error( 'no mount point found for settings menu' );
}
