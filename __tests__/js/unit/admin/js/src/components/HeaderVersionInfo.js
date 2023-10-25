import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderVersionInfo from '$Components/HeaderVersionInfo';

describe( 'HeaderVersionInfo', () => {
	it( 'should not add current version twice to dropdown list', () => {
		const availableVersions = [
			'1.0.0',
			'1.0.1',
			'1.0.2',
			'1.0.3',
			'1.0.4',
		];

		const currentVersion =
			availableVersions[
				Math.floor( Math.random() * ( availableVersions.length - 1 ) )
			];

		render(
			<HeaderVersionInfo
				currentVersion={ currentVersion }
				availableVersions={ availableVersions }
			/>
		);

		const currentVersionOptions = screen.getAllByText( currentVersion );
		expect( currentVersionOptions ).to.have.length( 1 );
	} );
} );
