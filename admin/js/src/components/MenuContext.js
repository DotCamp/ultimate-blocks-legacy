// eslint-disable-next-line no-unused-vars
import React, { createContext, useEffect, useState } from 'react';

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
	const setFilterValue = ( val ) => {
		setContextObject( { ...contextObject, app: { ...contextObject.app, blockFilter: val } } );
	};

	startupValue.actions = {
		setFilterValue,
	};

	const [ contextObject, setContextObject ] = useState( startupValue );

	return (
		<CreatedMenuContext.Provider value={ contextObject }>
			{ children }
		</CreatedMenuContext.Provider>
	);
}

/**
 * @module MenuContext
 */
export default MenuContext;
