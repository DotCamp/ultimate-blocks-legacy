import React from 'react';
import Router from '$Components/Router';
import routes from '$AdminInc/routes';
import { generateRouteArray } from '$AdminInc/Route';
import { getCurrentRoutePath } from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';

/**
 * Contents of menu page.
 *
 * @param {Object} props                  component properties
 * @param {string} props.currentRoutePath current route path, will be supplied via HOC
 * @function Object() { [native code] }
 */
function Content( { currentRoutePath } ) {
	return (
		<Router
			routes={ generateRouteArray( routes ) }
			currentRoutePath={ currentRoutePath }
		/>
	);
}

// select mapping
const selectMapping = ( selector ) => ( {
	currentRoutePath: selector( getCurrentRoutePath ),
} );

/**
 * @module Content
 */
export default withStore( Content, selectMapping );
