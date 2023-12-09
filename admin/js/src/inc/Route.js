import React from 'react';

/**
 * Route default options.
 *
 * @type {Object}
 */
export const defaultRouteOptions = {
	path: null,
	title: 'no_title',
	element: null,
};

/**
 * Route object.
 *
 * @param {Object} options route options
 * @class
 */
function Route(options) {
	const { path, title, element } = { ...defaultRouteOptions, ...options };
	/**
	 * Get route path.
	 *
	 * @return {string} path
	 */
	this.getPath = () => path;

	/**
	 * Get route title.
	 *
	 * @return {string} title
	 */
	this.getTitle = () => title;

	/**
	 * Get route element.
	 *
	 * @return {Function} element
	 */
	this.getElement = () =>
		element ?? <div>no element defined for route [{this.getPath()}]</div>;
}

/**
 * Generate options array from settings objects.
 *
 * These settings objects should correspond to Route default options.
 *
 * @param {Array<Object>} optionsArray options array
 * @return {Array<Route>} route object array
 */
export const generateRouteArray = (optionsArray) => {
	return optionsArray.map((options) => new Route(options));
};

/**
 * @module Route
 */
export default Route;
