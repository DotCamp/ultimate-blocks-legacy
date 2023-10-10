import React from 'react';

/**
 * Routes for admin menu.
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
		path: '404',
		title: '404',
		element: <div>404</div>,
	},
];

export default routes;
