import React from 'react';
import NavigationHeaderButton from '$Components/NavigationHeaderButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';

describe('NavigationHeaderButton', () => {
	it('should render given title', () => {
		const title = 'welcome';
		render(<NavigationHeaderButton title={title} />);

		const welcomeComponent = screen.getByText(title);
		expect(welcomeComponent).to.be.ok();
	});
	it('should callback with its path', async () => {
		const title = 'welcome';
		const path = 'welcome_path';
		const spyCallback = sinon.spy();
		render(
			<NavigationHeaderButton
				onClickHandler={spyCallback}
				title={title}
				targetPath={path}
			/>
		);

		const welcomeComponent = screen.getByText(title);
		await userEvent.click(welcomeComponent);

		expect(spyCallback.calledWith(path)).to.be.ok();
	});
});
