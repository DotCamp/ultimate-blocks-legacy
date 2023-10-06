import React from 'react';
import Router from '$Components/Router';
import Route from '$Components/Route';
import MainContent from '$Components/MainContent';

/**
 * Contents of menu page.
 *
 * @function Object() { [native code] }
 */
function Content() {
	return (
		<Router>
			<Route pageParameter={ 'ultimate-blocks-settings' }>
				<MainContent />
			</Route>
		</Router>
	);
}

/**
 * @module Content
 */
export default Content;
