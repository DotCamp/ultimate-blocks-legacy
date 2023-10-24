import React, { useState } from 'react';
import proxyquire from 'proxyquire';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import * as RouterModule from '$Components/Router';

const semiMockedRouterProvider = () =>
	proxyquire( require.resolve( '$Components/RouterProvider' ), {
		[ require.resolve( '$HOC/withStore' ) ]: {
			default: ( Component ) => Component,
		},
	} ).default;

const mockRouter = () => {
	sinon
		.stub( RouterModule, 'default' )
		.callsFake( ( { currentRoutePath } ) => (
			<div>{ currentRoutePath }</div>
		) );
};

const addRouteToUrl = ( route ) => {
	const url = new URL( window.location.href );
	url.searchParams.set( 'route', route );
	window.history.pushState( null, null, url.href );
};

const getRouteFromUrl = () => {
	const url = new URL( window.location.href );
	return url.searchParams.get( 'route' );
};

describe( 'RouterProvider', () => {
	it( 'should render its router child component', async () => {
		mockRouter();

		const MockedRouterProvider = semiMockedRouterProvider();
		const testRoute = 'test-route';

		render(
			<MockedRouterProvider
				currentRoutePath={ testRoute }
				setRoutePath={ () => {} }
			>
				<RouterModule.default />
			</MockedRouterProvider>
		);

		await expect( screen.getByText( testRoute ) ).to.be.ok();
	} );
	it( 'should parse startup route from URL search params', async () => {
		mockRouter();

		const testRoute = 'test-route';
		addRouteToUrl( testRoute );

		const setRoutePathSpy = sinon.spy();

		const MockedRouterProvider = semiMockedRouterProvider();

		render(
			<MockedRouterProvider
				setRoutePath={ setRoutePathSpy }
				currentRoutePath={ 'default-route' }
			>
				<RouterModule.default />
			</MockedRouterProvider>
		);

		expect( setRoutePathSpy.calledOnce ).to.be.ok();
		expect( setRoutePathSpy.calledWith( testRoute ) ).to.be.ok();
	} );
	it( 'should add a route to the URL search params when the route changes', async () => {
		mockRouter();
		const MockedRouterProvider = semiMockedRouterProvider();

		const targetRoute = 'target-route';
		const defaultRoute = 'default-route';

		const TestWrapper = ( { cRoute } ) => {
			const [ currentRoute, setCurrentRoute ] = useState( cRoute );

			return (
				<div>
					{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */ }
					<div
						onClick={ () => setCurrentRoute( targetRoute ) }
						data-testid="routeChangeButton"
					/>
					<MockedRouterProvider
						currentRoutePath={ currentRoute }
						setRoutePath={ setCurrentRoute }
					>
						<RouterModule.default />
					</MockedRouterProvider>
				</div>
			);
		};
		render( <TestWrapper cRoute={ defaultRoute } /> );
		expect( getRouteFromUrl() ).to.be.equal( defaultRoute );

		await userEvent.click( screen.getByTestId( 'routeChangeButton' ) );
		expect( getRouteFromUrl() ).to.be.equal( targetRoute );
	} );
} );
