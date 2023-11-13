// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import Route from '$AdminInc/Route';

/**
 * Router for different menu content.
 *
 * Router children components should be Route components. Else those who are not will be ignored.
 *
 * If no route matches, the last route will be shown. It can be used as 404 page.
 *
 * @param {Object}       props                  component properties
 * @param {Array<Route>} props.routes           routes array
 * @param {string}       props.currentRoutePath current route path
 */
function Router({ routes, currentRoutePath }) {
	const [CurrentRouteContent, setCurrentRouteContent] = useState(null);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const currentRoute = routes.find((route) => {
			return route.getPath() === currentRoutePath;
		});

		if (currentRoute) {
			setCurrentRouteContent(currentRoute.getElement());
		} else {
			const lastRoute = routes[routes.length - 1];
			setCurrentRouteContent(lastRoute.getElement());
		}
	}, [currentRoutePath, routes]);

	return (
		<div
			className={'ub-router-content-wrapper'}
			data-route-path={currentRoutePath}
			key={currentRoutePath}
		>
			{CurrentRouteContent}
		</div>
	);
}

/**
 * @module Router
 */
export default Router;
