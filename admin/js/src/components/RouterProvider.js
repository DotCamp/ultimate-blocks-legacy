import React, { useEffect, useMemo } from 'react';
import Router from '$Components/Router';
import routes from '$AdminInc/routes';
import { generateRouteArray } from '$AdminInc/Route';
import withStore from '$HOC/withStore';
import {
	getCurrentRoutePath,
	setCurrentRoutePath,
} from '$Stores/settings-menu/slices/app';
import NoRouterComponentFoundError from '$AdminInc/err/NoRouterComponentFoundError';

/**
 * RouterProvider component.
 *
 * @param {Object}   props                  component properties
 * @param {Router}   props.children         router component
 * @param {string}   props.currentRoutePath current route path, will be supplied via HOC
 * @param {Function} props.setRoutePath     set route path, will be supplied via HOC
 * @class
 */
function RouterProvider({ children, currentRoutePath, setRoutePath }) {
	const RouterChild = useMemo(() => {
		const Component = children?.type === Router ? children.type : null;

		if (Component === null) {
			throw new NoRouterComponentFoundError();
		}

		return Component;
	}, []);

	const generatedRoutes = useMemo(() => {
		return generateRouteArray(routes);
	}, []);

	/**
	 * Parse url and set route path.
	 */
	const parseRouteFromUrl = () => {
		const url = new URL(window.location.href);
		const urlRoute = url.searchParams.get('route');

		if (urlRoute) {
			setRoutePath(urlRoute);
		}
	};

	/**
	 * Hook to add event listener for popstate.
	 */
	useEffect(() => {
		window.addEventListener('popstate', parseRouteFromUrl);
	}, []);

	/**
	 * Parse url and set route path at startup.
	 */
	useEffect(() => {
		parseRouteFromUrl();
	}, []);

	/**
	 * Add route path to url.
	 */
	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('route', currentRoutePath);
		window.history.pushState(null, null, url.href);
	}, [currentRoutePath]);

	return (
		<RouterChild
			routes={generatedRoutes}
			currentRoutePath={currentRoutePath}
		/>
	);
}

// store select mapping
const selectMapping = (selector) => ({
	currentRoutePath: selector(getCurrentRoutePath),
});

const actionMapping = () => ({ setRoutePath: setCurrentRoutePath });

/**
 * @module RouterProvider
 */
export default withStore(RouterProvider, selectMapping, actionMapping);
