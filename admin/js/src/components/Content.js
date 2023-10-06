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
			<Route pageParameter={ 'blocks' }>
				<MainContent />
			</Route>
			<Route>
				<div className={ 'route-404' }>
					<h1>404</h1>
				</div>
			</Route>
		</Router>
	);
}

/**
 * @module Content
 */
export default Content;
