import React from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import proxyquire from 'proxyquire';
import * as BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import * as ProFilterModule from '$Components/ProFilter';

describe( 'UpgradeBoxContent', () => {
	it( 'should reflect given props to BoxContentProvider', () => {
		const testMessage = 'test message';

		sinon
			.stub( ProFilterModule, 'default' )
			.callsFake( ( { children } ) => children );

		sinon
			.stub( BoxContentProvider, 'default' )
			.callsFake( ( { message } ) => {
				return <div>{ message }</div>;
			} );

		const UpgradeBoxContent = proxyquire(
			require.resolve( '$Components/UpgradeBoxContent' ),
			{}
		).default;

		render( <UpgradeBoxContent message={ testMessage } /> );
		expect( screen.getByText( testMessage ) ).to.be.ok();
	} );
} );
