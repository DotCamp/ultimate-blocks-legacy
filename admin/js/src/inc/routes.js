import React from 'react';
import Route, { generateRouteArray } from '$AdminInc/Route';
import WelcomeContent from '$Containers/WelcomeContent';
import BlocksContent from '$Containers/BlocksContent';
import ExtensionsContent from '$Containers/ExtensionsContent';

/**
 * Routes for admin menu.
 *
 * Last route is reserved for 404 page.
 *
 * @type {Array} routes array
 */
const routes = [
	{
		path: 'welcome',
		title: 'Welcome',
		element: <WelcomeContent />,
	},
	{
		path: 'blocks',
		title: 'Blocks',
		element: <BlocksContent />,
	},
	{
		path: 'extensions',
		title: 'Extensions',
		element: <ExtensionsContent />,
	},
	{
		path: '404',
		title: '404',
		element: <div>404</div>,
	},
];

/**
 * Generated route objects array.
 *
 * @type {Array<Route>}
 */
export const routeObjects = generateRouteArray(routes);

/**
 * @module routes
 */
export default routes;
