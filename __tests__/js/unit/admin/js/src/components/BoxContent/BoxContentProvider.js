import React from 'react';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { render, screen } from '@testing-library/react';
import * as WithStoreModule from '$HOC/withStore';

describe('BoxContentProvider', () => {
	it('should override supplied content properties with content data', async () => {
		const testData = {
			title: 'title overwrite',
			content: 'content overwrite',
		};

		const getCData = sinon.stub().returns(testData);

		sinon.stub(WithStoreModule, 'default').callsFake((Component) => {
			return (props) => <Component {...props} getCData={getCData} />;
		});

		const BoxContentProvider = proxyquire(
			require.resolve('$Components/BoxContent/BoxContentProvider'),
			{}
		).default;

		render(
			<BoxContentProvider
				title={'new title'}
				content={'new content'}
				contentId={'test'}
			/>
		);

		expect(screen.getByText(testData.title)).to.be.ok();
		expect(screen.getByText(testData.content)).to.be.ok();
	});
});
