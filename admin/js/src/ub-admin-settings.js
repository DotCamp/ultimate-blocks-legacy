// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminMenuContainer from "$Containers/AdminMenuContainer";
import "$Styles/ub-admin-settings.scss";
import AdminMenuWrapper from "$Components/AdminMenuWrapper";
import MenuContext from "$Components/MenuContext";
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";

const mountPoint = document.querySelector( '#ub-admin-menu' );

if ( mountPoint ) {
	const root = createRoot( mountPoint );

	const appData = { ...ubAdminMenuData };
	ubAdminMenuData = null;

	// add block infos to context data
	const registeredUbBlocks = wp.data.select( 'core/blocks' ).getBlockTypes();
	appData.blocks.info = registeredUbBlocks.filter( blockData => {
		return blockData.deprecated === undefined && blockData.parent === undefined;
	} );

	appData.app = {
		blockFilter: FILTER_TYPES._DEFAULT,
	};

	root.render(
		<AdminMenuWrapper>
			<MenuContext startupValue={ appData }><AdminMenuContainer /></MenuContext>
		</AdminMenuWrapper>
	);
} else {
	throw new Error( 'no mount point found for settings menu' );
}
