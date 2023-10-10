import React, { useEffect, useState } from 'react';
import Route from '$AdminInc/Route';
import NavigationHeaderButton from '$Components/NavigationHeaderButton';

/**
 * Navigation component.
 *
 * @param {Object}       props        component properties
 * @param {Array<Route>} props.routes routes array
 * @class
 */
function Navigation( { routes } ) {
	const [ calculatedStyle, setCalculatedStyles ] = useState( {} );

	/**
	 * useEffect hook.
	 */
	useEffect( () => {
		const style = {
			gridTemplateColumns: `repeat(${ routes.length }, minmax(0,1fr))`,
		};
		setCalculatedStyles( style );
	}, [ routes ] );

	return (
		<div style={ calculatedStyle } className={ 'ub-menu-navigation' }>
			{ routes.map( ( routeObj ) => {
				return (
					<NavigationHeaderButton
						key={ routeObj.getPath() }
						title={ routeObj.getTitle() }
						targetPath={ routeObj.getPath() }
					/>
				);
			} ) }
		</div>
	);
}

/**
 * @module Navigation
 */
export default Navigation;
