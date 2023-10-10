import React from 'react';
import Route, { generateRouteArray } from '$AdminInc/Route';

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
		element: () => <div>Welcome</div>,
	},
	{
		path: 'blocks',
		title: 'Blocks',
		element: <div>Blocks</div>,
	},
	{
		path: 'extensions',
		title: 'Extensions',
		element: <div>Extensions</div>,
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
export const routeObjects = generateRouteArray( routes );

/**
 * @module routes
 */
export default routes;
