// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { CreatedMenuContext } from '$Components/MenuContext';

/**
 * Menu context hoc.
 * @param {React.ElementType} BaseComponent react component
 * @returns {Function} function to use as hoc
 */
const withMenuContext = ( BaseComponent ) => ( props ) => {
	const preparedContext = useContext( CreatedMenuContext );

	return <BaseComponent { ...props } menuData={ preparedContext } />;
};

/**
 * @module withMenuContext
 */
export default withMenuContext;
