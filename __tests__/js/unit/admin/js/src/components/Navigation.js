import React from 'react';
import Navigation from '$Components/Navigation';
import { render, screen } from '@testing-library/react';
import { generateRouteArray } from '$AdminInc/Route';

describe('Navigation', () => {
	it('should render all sub elements with correct route titles', () => {
		const testRoutes = [
			{
				path: 'welcome_path',
				title: 'Welcome',
			},
			{
				path: 'blocks_path',
				title: 'Blocks',
			},
		];
		const routeObjects = generateRouteArray(testRoutes);

		render(<Navigation routes={routeObjects} />);
		// eslint-disable-next-line array-callback-return
		routeObjects.map((routeObj) => {
			expect(screen.getByText(routeObj.getTitle())).to.be.ok();
		});
	});
});
