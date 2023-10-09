import React from 'react';
import Route from '$Components/Route.js';
import { render } from '@testing-library/react';

describe( 'Route', () => {
	it( 'should be imported', () => {
		render( <Route /> );
		// eslint-disable-next-line no-unused-expressions
		expect( true ).to.be.ok;
	} );
} );
