import React from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonLink from '$Components/ButtonLink';
import ButtonLinkNoUrlError from '$AdminInc/err/ButtonLinkNoUrlError';

describe( 'ButtonLink', () => {
	it( 'should render with given title', () => {
		const title = 'welcome';
		render( <ButtonLink title={ title } url={ 'https://example.com' } /> );

		const welcomeComponent = screen.getByText( title );
		expect( welcomeComponent ).to.be.ok();
	} );
	it( 'should throw error on empty links', () => {
		expect( () => render( <ButtonLink /> ) ).to.throw(
			ButtonLinkNoUrlError
		);
	} );
	it( 'should redirect to given url', async () => {
		const targetTestUrl = 'https://example.com';
		render( <ButtonLink url={ targetTestUrl } /> );

		const mockedOpen = sinon.stub( window, 'open' );
		await userEvent.click( screen.getByRole( 'button' ) );

		expect( mockedOpen.withArgs( targetTestUrl ) ).to.be.ok();
	} );
} );