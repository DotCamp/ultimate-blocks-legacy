import React from 'react';
import Router from '$Components/Router';
import RouterProvider from '$Components/RouterProvider';

/**
 * Contents of menu page.
 */
function Content() {
	return (
		<RouterProvider>
			<Router />
		</RouterProvider>
	);
}

/**
 * @module Content
 */
export default Content;
