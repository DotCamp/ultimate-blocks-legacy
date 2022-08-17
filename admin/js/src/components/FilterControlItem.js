// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * Filter control item.
 *
 * These items will represents different filter options parent filter control component has.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {String} props.title item title
 * @param {String} props.id item id, this id represents if of the filter this component represents
 * @param {Function} props.onFilterItemSelected callback for filter item selected event
 * @param {Boolean} props.active filter active status
 */
function FilterControlItem( { title, id, onFilterItemSelected, active } ) {
	/**
	 * Handle item select event.
	 */
	const handleClick = () => {
		onFilterItemSelected( id );
	};

	// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
	return ( <div data-active={ JSON.stringify( active ) } onClick={ handleClick } className={ 'filter-control-item' }>
		{ title }
	</div> );
}

/**
 * @module FilterControlItem
 */
export default FilterControlItem;
