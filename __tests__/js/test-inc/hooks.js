/* eslint-disable import/no-extraneous-dependencies */
const expect = require( 'chai' ).expect;
const sinon = require( 'sinon' );
const { cleanup } = require( '@testing-library/react' );

exports.mochaHooks = {
	afterEach() {
		sinon.restore();
		cleanup();
	},
};

exports.mochaGlobalSetup = () => {
	const context = global || self;
	context.expect = expect;
};
