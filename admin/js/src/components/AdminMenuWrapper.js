// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';

/**
 * Admin menu wrapper.
 *
 * This component is responsible for arranging its child components inside default WordPress settings menu styles and elements.
 * @param {Object}  props component properties
 * @param {React.ElementType}  props.children child components
 * @constructor
 */
function AdminMenuWrapper( { children } ) {
	useEffect( () => {
		const wpContent = document.querySelector( '#wpcontent' );
		const wpBody = document.querySelector( '#wpbody' );
		const adminBar = document.querySelector( '#wpadminbar' );

		if ( wpBody ) {
			const adminBarAdjustment = adminBar ? adminBar.offsetHeight : 0;

			wpBody.style.height = `calc( 100vh - ${ adminBarAdjustment }px)`;
			wpContent.style.padding = 0;
		}
	}, [] );

	return (
		<div className={ 'ub-admin-menu-wrapper' }>{ children }</div>
	);
}

/**
 * @module AdminMenuWrapper
 */
export default AdminMenuWrapper;
