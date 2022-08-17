// eslint-disable-next-line no-unused-vars
import React, { createRef, useEffect, useRef, useState } from 'react';
import FilterControlItem from "$Components/FilterControlItem";
import ActiveFilterIndicator, { generateIndicatorData } from "$Components/ActiveFilterIndicator";

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

	const containerRef = createRef();

	const [ innerFilterVal, setInnerFilterVal ] = useState( filterVal );
	const [ activeItemRef, setActiveItemRef ] = useState( null );
	const [ indicatorPosData, setIndicatorPosData ] = useState( generateIndicatorData( 0, 50 ) );

	useEffect( () => {
		if ( activeItemRef ) {
			const { x, width } = activeItemRef.getBoundingClientRect();
			const { x: containerX } = containerRef.current.getBoundingClientRect();

			setIndicatorPosData( generateIndicatorData( x - containerX, width ) );
		}
	}, [ activeItemRef ] );

	useEffect( () => {
		const checkedFilterVal = filterValCheck( innerFilterVal );
		if ( checkedFilterVal !== innerFilterVal ) {
			setInnerFilterVal( checkedFilterVal );
		}

		onFilterChanged( innerFilterVal );
	}, [ innerFilterVal ] );

	return (
		<div ref={ containerRef } className={ 'block-status-filter-control' }>
			<ActiveFilterIndicator positionData={ indicatorPosData } />
			{
				Object.values( ( () => {
					// eslint-disable-next-line no-unused-vars
					const { _DEFAULT, ...rest } = FILTER_TYPES;
					return rest;
				} )() ).map( filterId => {
					return (
						<FilterControlItem key={ filterId } id={ filterId } title={ filterId } onFilterItemSelected={ setInnerFilterVal } active={ innerFilterVal === filterId } activeItemRefCallback={ setActiveItemRef } />
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
