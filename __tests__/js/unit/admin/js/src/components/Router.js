import React from 'react';
import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import Router from '$Components/Router';
import Route from '$Components/Route';

describe( 'Router', () => {
	it( 'should show last route if none other match', async () => {
		global.wp = {
			hooks: {
				applyFilters: sinon
					.stub()
					// eslint-disable-next-line no-unused-vars
					.callsFake( ( _fName, finalVal, _val ) => finalVal ),
			},
		};

		render(
			<Router>
				<Route pageParameter={ 'blocks' }>
					<div>Blocks</div>
				</Route>
				<Route>
					<div>404</div>
				</Route>
			</Router>
		);

		const errorComponent = screen.getByText( '404' );

		expect( errorComponent ).to.not.be.null();
	} );
} );
