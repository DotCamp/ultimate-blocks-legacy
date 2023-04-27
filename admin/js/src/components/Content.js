import React from 'react';
import Router from '$Components/Router';
import Route from '$Components/Route';

/**
 * Content of menu page.
 *
 * @function Object() { [native code] }
 */
function Content() {
	return (
		<Router>
			<Route pageParameter={'ultimate-blocks-settings-pro'}>
				<i>pro version</i>
			</Route>
			<Route pageParameter={'ultimate-blocks-settings'}>
				<i>base version</i>
			</Route>
		</Router>
	);
}

/**
 * @module Content
 */
export default Content;
