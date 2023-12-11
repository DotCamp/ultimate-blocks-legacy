import Route, { defaultRouteOptions } from '$AdminInc/Route';

describe('Route', () => {
	it('should use default options for missing constructor ones', () => {
		const testOptions = { path: 'some_path' };
		const testRoute = new Route(testOptions);

		expect(testRoute.getTitle()).to.equal(defaultRouteOptions.title);
	});
	it('should use generated element for missing element option', () => {
		const testOptions = { path: 'some_path' };
		const testRoute = new Route(testOptions);

		expect(testRoute.getElement()).to.be.ok();
	});
});
