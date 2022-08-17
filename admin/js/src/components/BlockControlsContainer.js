// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import withMenuContext from "$HOC/withMenuContext";
import BlockControl from "$Components/BlockControl";
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";

/**
 * Block controls container.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {Object} props.menuData menu data, will be supplied via context
 */
function BlockControlsContainer( { menuData } ) {
	const statusData = menuData.blocks.statusData.reduce( ( carry, { active, name } ) => {
		carry[ name ] = active;
		return carry;
	}, {} );

	/**
	 * Get status of given block id
	 * @param {String} blockId registered block id
	 * @returns {Boolean} status
	 */
	const getStatus = ( blockId ) => {
		return statusData[ blockId ];
	};

	return (
		<TransitionGroup className={ 'controls-container' } >
			{
				menuData.blocks.info.sort( ( a, b ) => {
					const aName = a.title;
					const bName = b.title;

					if ( aName < bName ) {
						return -1;
					} else if ( aName > bName ) {
						return 1;
					}

					return 0;
				} ).filter( ( { name } ) => {
					const currentFilter = menuData.app.blockFilter;
					if ( currentFilter === FILTER_TYPES.ALL ) {
						return true;
					}

					const blockStatus = getStatus( name ) ? FILTER_TYPES.ENABLED : FILTER_TYPES.DISABLED;

					return blockStatus === currentFilter;
				} ).map( ( { title, name, icon } ) => {
					return ( <CSSTransition timeout={ 200 } key={ name } classNames={ 'block-control-transition' }>
						<BlockControl key={ name } title={ title } blockId={ name } status={ getStatus( name ) }
							iconObject={ icon.src } />
					</CSSTransition> );
				} )
			}
		</TransitionGroup>
	);
}

/**
 * @module BlockControlsContainer
 */
export default withMenuContext( BlockControlsContainer );
