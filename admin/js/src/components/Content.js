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
				<div
					style={ {
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					} }
				>
					404 Route Not Found
				</div>
			</Route>
		</Router>
	);
}

/**
 * @module Content
 */
export default Content;
