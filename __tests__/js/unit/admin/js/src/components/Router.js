import React from 'react';
import { render, screen } from '@testing-library/react';
import Router from '$Components/Router';
import { generateRouteArray } from '$AdminInc/Route';

/**
 * Routes for testing.
 *
 * @type {Array}
 */
const testRoutes = [
	{
		path: 'welcome',
		title: 'welcome',
		element: () => <div data-testid={'welcome'}>Welcome</div>,
	},
	{
		path: 'blocks',
		title: 'blocks',
		element: () => <div data-testid={'blocks'}>Welcome</div>,
	},
	{
		path: '404',
		title: '404',
		element: () => <div data-testid={404}>Page not found</div>,
	},
];

describe('Router', () => {
	it('should show route content', () => {
		render(
			<Router
				routes={generateRouteArray(testRoutes)}
				currentRoutePath={'blocks'}
			/>
		);

		const welcomeComponent = screen.getByTestId('blocks');
		expect(welcomeComponent).to.not.be.null();
	});
	it('should show last route if none other match', async () => {
		render(
			<Router
				routes={generateRouteArray(testRoutes)}
				currentRoutePath={'non_existent'}
			/>
		);

		const errorComponent = screen.getByTestId('404');
		expect(errorComponent).to.not.be.null();
	});
});
