import React from 'react';
import Router from '$Components/Router';
import Route from '$Components/Route';
import MainContent from '$Components/MainContent';

/**
 * Content of menu page.
 *
 * @function Object() { [native code] }
 */
function Content() {
	return (
		<Router>
			<Route pageParameter={'ultimate-blocks-settings'}>
				<MainContent />
			</Route>
			<Route pageParameter={'ultimate-blocks-settings-pro'}>
				<div>
					<i>pro settings for base version</i>
				</div>
			</Route>
		</Router>
	);
}

/**
 * @module Content
 */
export default Content;
