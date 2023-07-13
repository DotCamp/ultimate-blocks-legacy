import React, { useEffect } from 'react';
import { modeCheckDev } from '$Inc/helpers/modeCheck';

/**
 * DEVELOPMENT
 *
 * Base development component.
 *
 * @param {Object}                         props          component properties
 * @param {Function | Array | JSX.Element} props.children component children
 */
function DevelopmentComponent({ children }) {
	/**
	 * useEffect hook
	 */
	useEffect(() => {
		// eslint-disable-next-line no-console
		console.warn(
			`A development component is found, if this is a production version, remove it. %c\n\nComponent Name: [${children.type.name}]`,
			'font-weight: bold'
		);
	}, []);

	return React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, {
				...child.props,
				isDevelopment: modeCheckDev(),
			});
		}
		return child;
	});
}

/**
 * @module DevelopmentComponent
 */
export default DevelopmentComponent;
