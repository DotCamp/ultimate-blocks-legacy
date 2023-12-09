import React from 'react';
import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import * as WithStoreModule from '$HOC/withStore';

/**
 * Mock withStore HOC.
 *
 * @param {boolean} proStatus pro status to inject
 */
const mockWithStore = ( proStatus ) => {
	sinon.stub( WithStoreModule, 'default' ).callsFake( ( Component ) => {
		return ( props ) => {
			return <Component { ...props } proStatus={ proStatus } />;
		};
	} );
};

describe( 'ProFilter', () => {
	it( 'should render its children if pro version is available', () => {
		mockWithStore( true );

		const ProFilter = proxyquire(
			require.resolve( '$Components/ProFilter' ),
			{}
		).default;

		const dataTestId = 'testId';
		render(
			<ProFilter invert={ false }>
				<div data-testid={ dataTestId }></div>
			</ProFilter>
		);

		expect( screen.getByTestId( dataTestId ) ).to.be.ok();
	} );

	it( 'should render its children if pro version is not available', () => {
		mockWithStore( false );

		const ProFilter = proxyquire(
			require.resolve( '$Components/ProFilter' ),
			{}
		).default;

		const dataTestId = 'testId';
		render(
			<ProFilter invert={ true }>
				<div data-testid={ dataTestId }></div>
			</ProFilter>
		);

		expect( screen.getByTestId( dataTestId ) ).to.be.ok();
	} );
} );
