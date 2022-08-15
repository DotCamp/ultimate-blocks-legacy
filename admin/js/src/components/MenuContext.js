// eslint-disable-next-line no-unused-vars
import React, { createContext } from 'react';

/**
 * Menu context.
 * @type {React.Context<{}>}
 */
export const CreatedMenuContext = createContext( {} );

/**
 * Menu context component.
 *
 * This component will supply application wide data for components hooking into it.
 *
 * @param {Object} props component properties
 * @param {any} props.startupValue startup value for context
 * @param {React.ReactNode} props.children component children
 * @constructor
 */
function MenuContext( { children, startupValue } ) {
	return (
		<CreatedMenuContext.Provider value={ startupValue }>
			{ children }
		</CreatedMenuContext.Provider>
	);
}

/**
 * @module MenuContext
 */
export default MenuContext;
