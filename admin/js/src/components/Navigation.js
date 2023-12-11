import React, { useEffect, useState } from 'react';
import Route from '$AdminInc/Route';
import NavigationHeaderButton from '$Components/NavigationHeaderButton';

/**
 * Navigation component.
 *
 * @param {Object}        props                  component properties
 * @param {Array<Route>}  props.routes           routes array
 * @param {string | null} props.currentRoutePath current route path
 * @param {Function}      props.setRoute         set route path
 * @class
 */
function Navigation({ routes, currentRoutePath, setRoute }) {
	const [calculatedStyle, setCalculatedStyles] = useState({});

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const style = {
			gridTemplateColumns: `repeat(${routes.length}, minmax(0,1fr))`,
		};
		setCalculatedStyles(style);
	}, [routes]);

	return (
		<div style={calculatedStyle} className={'ub-menu-navigation'}>
			{routes.map((routeObj) => {
				return (
					<NavigationHeaderButton
						key={routeObj.getPath()}
						title={routeObj.getTitle()}
						targetPath={routeObj.getPath()}
						isActive={currentRoutePath === routeObj.getPath()}
						onClickHandler={setRoute}
					/>
				);
			})}
		</div>
	);
}

/**
 * @module Navigation
 */
export default Navigation;
