import React from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import proxyquire from 'proxyquire';

beforeEach( () => {
	proxyquire.noPreserveCache();
} );

describe( 'withStore', () => {
	it( 'should return given component', async () => {
		const withStore = proxyquire( require.resolve( '$HOC/withStore' ), {
			'react-redux': {
				useDispatch: () => () => {},
			},
		} ).default;

		const componentTextContent = 'test component';
		const component = () => <div>{ componentTextContent }</div>;
		const HocComponent = withStore( component );

		render( <HocComponent /> );
		expect( screen.getByText( componentTextContent ) ).to.be.ok();
	} );
	it( 'should inject selectors as props', () => {
		const withStore = proxyquire( require.resolve( '$HOC/withStore' ), {
			'react-redux': {
				useSelector: ( selectorName ) => selectorName,
				useDispatch: () => () => {},
			},
		} ).default;

		const testSelectorTarget = 'testMessage';
		const selectMapping = ( selector ) => ( {
			message: selector( testSelectorTarget ),
		} );
		const component = ( { message = 'there is none' } ) => (
			<div>{ message }</div>
		);
		const HocComponent = withStore( component, selectMapping );

		render( <HocComponent /> );
		expect( screen.getByText( testSelectorTarget ) ).to.be.ok();
	} );
	it( 'should inject actions as props', () => {
		const withStore = proxyquire( require.resolve( '$HOC/withStore' ), {
			'react-redux': {
				useSelector: () => () => {},
				useDispatch: () => () => {},
			},
		} ).default;

		const testActionSpy = sinon.spy();
		const actionMapping = () => ( {
			testAction: testActionSpy,
		} );
		const actionCallbackVal = 'testVal';
		const component = ( { testAction } ) => {
			testAction( actionCallbackVal );
			return <div />;
		};
		const HocComponent = withStore( component, null, actionMapping );

		render( <HocComponent /> );

		expect( testActionSpy.calledWith( actionCallbackVal ) ).to.be.ok();
	} );
} );
