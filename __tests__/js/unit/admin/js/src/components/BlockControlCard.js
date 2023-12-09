import React from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockControlCard from '$Components/BlockControlCard';

const defaultProps = {
	title: 'Test Block',
	blockId: 'test-block',
	status: true,
	proBlock: false,
	proStatus: false,
	showUpsell: () => {},
	onStatusChange: () => {},
	iconObject: 'x',
};

const prepareProps = (propsOverride) => ({
	...defaultProps,
	...propsOverride,
});

describe('BlockControlCard', () => {
	it('should signal its parent at block status change', async () => {
		const statusChangeSpy = sinon.spy();
		const status = true;
		const blockId = 'test-block';

		render(
			<BlockControlCard
				{...prepareProps({
					status,
					blockId,
					onStatusChange: statusChangeSpy,
				})}
			/>
		);
		await userEvent.click(screen.getByRole('button'));

		expect(statusChangeSpy.calledWith(blockId, !status)).to.be.ok();
	});
	it('should call showUpsell instead when target block is pro and plugin version is base', async () => {
		const showUpsellSpy = sinon.spy();
		render(
			<BlockControlCard
				{...prepareProps({
					showUpsell: showUpsellSpy,
					proBlock: true,
				})}
			/>
		);

		await userEvent.click(screen.getByRole('button'));
		expect(showUpsellSpy.calledWith(defaultProps.blockId)).to.be.ok();
	});
	it('should call status change when block is pro and plugin version is pro', async () => {
		const statusChangeSpy = sinon.spy();

		render(
			<BlockControlCard
				{...prepareProps({
					onStatusChange: statusChangeSpy,
					proBlock: true,
					proStatus: true,
				})}
			/>
		);

		await userEvent.click(screen.getByRole('button'));

		expect(
			statusChangeSpy.calledWith(
				defaultProps.blockId,
				!defaultProps.status
			)
		).to.be.ok();
	});
	it('should not show demo link when demoUrl is not supplied', () => {
		render(<BlockControlCard {...defaultProps} />);
		expect(screen.queryByText('See Demo')).to.be.not.ok();
	});
});
