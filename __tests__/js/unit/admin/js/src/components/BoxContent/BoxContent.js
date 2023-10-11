import React from 'react';
import { render, screen } from '@testing-library/react';
import BoxContent from '$Components/BoxContent/BoxContent';

describe( 'BoxContent', () => {
	it( 'should render title if prop supplied', () => {
		const title = 'Super important title';
		render( <BoxContent title={ title } /> );

		const welcomeComponent = screen.getByText( title );
		expect( welcomeComponent ).to.be.ok();
	} );
	it( 'should render content if prop supplied', () => {
		const content = 'Super important content.';
		render( <BoxContent content={ content } /> );

		const welcomeComponent = screen.getByText( content );
		expect( welcomeComponent ).to.be.ok();
	} );

	it( 'should render its children', () => {
		const content = (
			<div data-testid={ 'content-child' }>Super important children</div>
		);

		render( <BoxContent>{ content }</BoxContent> );

		const welcomeComponent = screen.getByTestId( 'content-child' );
		expect( welcomeComponent ).to.be.ok();
	} );
} );
