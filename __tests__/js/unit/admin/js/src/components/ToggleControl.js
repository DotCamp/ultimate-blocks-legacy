import React, { useState } from 'react';
import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleControl from '$Components/ToggleControl';

describe('ToggleControl', () => {
	it('should call status change callback on click', async () => {
		const statusChangeSpy = sinon.spy();
		const testStatus = true;

		render(
			<ToggleControl
				status={testStatus}
				onStatusChange={statusChangeSpy}
			/>
		);
		await userEvent.click(screen.getByRole('button'));

		expect(statusChangeSpy.calledOnce).to.be.ok();
		expect(statusChangeSpy.calledWith(!testStatus)).to.be.ok();
	});
	it('should not call status change callback if disabled', async () => {
		const statusChangeSpy = sinon.spy();
		const testStatus = true;

		render(
			<ToggleControl
				status={testStatus}
				disabled={true}
				onStatusChange={statusChangeSpy}
			/>
		);
		await userEvent.click(screen.getByRole('button'));

		expect(statusChangeSpy.notCalled).to.be.ok();
	});
	it('should not call status change callback if given status is updated', async () => {
		const statusChangeSpy = sinon.spy();

		const WrapperComponent = () => {
			const [innerStatus, setInnerStatus] = useState(false);

			return (
				<div>
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
					<div
						data-testid={'stateChange'}
						onClick={() => setInnerStatus(!innerStatus)}
					>
						toggle status
					</div>
					<ToggleControl
						onStatusChange={statusChangeSpy}
						status={innerStatus}
					/>
				</div>
			);
		};

		render(<WrapperComponent />);

		await userEvent.click(screen.getByTestId('stateChange'));
		expect(statusChangeSpy.notCalled).to.be.ok();
	});
});
