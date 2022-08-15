// eslint-disable-next-line no-unused-vars
import React from 'react';
import withMenuContext from "$HOC/withMenuContext";

/**
 * Settings menu header element.
 *
 * @returns {JSX.Element} component
 * @constructor
 */
function MenuHeader( { menuData } ) {
	return (
		<div className={ 'header' }>
			<div className={ 'logo-container' }>
				<img alt={ 'plugin logo' } src={ menuData.assets.logo } />
			</div>

		</div>
	);
}

/**
 * @module MenuHeader
 */
export default withMenuContext( MenuHeader );
