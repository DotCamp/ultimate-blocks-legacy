// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import FilterControlItem from "$Components/FilterControlItem";

/**
 * Filter types for blocks.
 * @type {Object}
 */
export const FILTER_TYPES = {
	ALL: 'all',
	ENABLED: 'enabled',
	DISABLED: 'disabled',
	_DEFAULT: 'all',
};

/**
 * Control for filtering blocks depending on their enabled status.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {String} props.filterVal active filter id at startup
 * @param {Function} [props.onFilterChanged=()=>{}] callback for filter changed event
 */
function BlockStatusFilterControl( { filterVal, onFilterChanged = () => {} } ) {
	const filterValCheck = ( val ) => {
		let filterValBeforeCheck = val;
		// revert filter value to a default if non compatible one is assigned
		if ( ! Object.values( FILTER_TYPES ).includes( val ) ) {
			filterValBeforeCheck = FILTER_TYPES._DEFAULT;
		}
		return filterValBeforeCheck;
	};

	const [ innerFilterVal, setInnerFilterVal ] = useState( filterVal );

	useEffect( () => {
		const checkedFilterVal = filterValCheck( innerFilterVal );
		if ( checkedFilterVal !== innerFilterVal ) {
			setInnerFilterVal( checkedFilterVal );
		}

		onFilterChanged( innerFilterVal );
	}, [ innerFilterVal ] );

	return (
		<div className={ 'block-status-filter-control' }>
			{
				Object.values( ( () => {
					// eslint-disable-next-line no-unused-vars
					const { _DEFAULT, ...rest } = FILTER_TYPES;
					return rest;
				} )() ).map( filterId => {
					return (
						<FilterControlItem key={ filterId } id={ filterId } title={ filterId } onFilterItemSelected={ setInnerFilterVal } active={ innerFilterVal === filterId } />
					);
				} )

			}
		</div>
	);
}

/**
 * @module BlockStatusFilterControl
 */
export default BlockStatusFilterControl;
