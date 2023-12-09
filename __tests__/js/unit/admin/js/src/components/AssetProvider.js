import React from 'react';
import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import * as WithStoreModule from '$HOC/withStore';
import proxyquire from 'proxyquire';

describe( 'AssetProvider', () => {
	it( 'should render its child component with render props', () => {
		sinon
			.stub( WithStoreModule, 'default' )
			.callsFake( ( Component ) => Component );

		const MockedAssetProvider = proxyquire(
			require.resolve( '$Components/AssetProvider' ),
			{}
		).default;

		const mockedStoreAssetState = {
			testMessage: 'test message',
			testUrl: 'test url',
		};

		const getAssetStub = sinon
			.stub()
			.callsFake( ( assetId ) => mockedStoreAssetState[ assetId ] );

		render(
			<MockedAssetProvider
				getStoreAsset={ getAssetStub }
				assetIds={ [ 'testMessage', 'testUrl' ] }
			>
				{ ( { testMessage, testUrl } ) => (
					<div>
						<div>{ testMessage }</div>
						<div data-testId={ testUrl } />
					</div>
				) }
			</MockedAssetProvider>
		);

		expect(
			screen.getByText( mockedStoreAssetState.testMessage )
		).to.be.ok();

		expect(
			screen.getByTestId( mockedStoreAssetState.testUrl )
		).to.be.ok();
	} );
} );
