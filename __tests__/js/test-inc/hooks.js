/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const { cleanup } = require('@testing-library/react');

exports.mochaHooks = {
	afterEach() {
		sinon.restore();
		cleanup();
	},
};

exports.mochaGlobalSetup = () => {
	const context = global || self;
	context.expect = chai.expect;
	chai.use(dirtyChai);
};
