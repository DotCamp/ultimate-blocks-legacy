// eslint-disable-next-line no-unused-vars
import React from 'react';
import withStore from "$HOC/withStore";
import { getLogo } from "$Stores/settings-menu/slices/assets";

/**
 * Settings menu header element.
 *
 * @param {Object} props component properties
 * @param {String} props.logoUrl plugin logo url, will be supplied via HOC
 * @returns {JSX.Element} component
 * @constructor
 */
function MenuHeader( { logoUrl } ) {
	return (
		<div className={ 'menu-header' }>
			<div className={ 'logo-container' }>
				<img alt={ 'plugin logo' } src={ logoUrl } />
			</div>
		</div>
	);
}

const selectMapping = ( select ) => {
	return {
		logoUrl: select( getLogo ),
	};
};

/**
 * @module MenuHeader
 */
export default withStore( MenuHeader, selectMapping );
