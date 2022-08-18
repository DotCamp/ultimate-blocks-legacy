// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import BlockControl from "$Components/BlockControl";
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";
import withStore from "$HOC/withStore";
import { getBlocks, setBlockActiveStatus } from "$Stores/settings-menu/slices/blocks";
import { getBlockFilter } from "$Stores/settings-menu/slices/app";

/**
 * Block controls container.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {Object} props.blocks menu data, will be supplied via HOC
 * @param {Object} props.blockFilter current filter for block status, will be supplied via HOC
 * @param {Function} props.setBlockStatus set a block's active status, will be supplied via HOC
 */
function BlockControlsContainer( { blocks, blockFilter, setBlockStatus } ) {
	/**
	 * Handle block status change
	 * @param {String} blockId target id
	 * @param {boolean} status status value
	 */
	const handleBlockStatusChange = ( blockId, status ) => {
		setBlockStatus( { id: blockId, status } );
	};

	return (
		<TransitionGroup className={ 'controls-container' } >
			{
				[ ...blocks ].sort( ( a, b ) => {
					const aName = a.title;
					const bName = b.title;

					if ( aName < bName ) {
						return -1;
					} else if ( aName > bName ) {
						return 1;
					}

					return 0;
				} ).filter( ( { active } ) => {
					if ( blockFilter === FILTER_TYPES.ALL ) {
						return true;
					}

					const blockStatus = active ? FILTER_TYPES.ENABLED : FILTER_TYPES.DISABLED;

					return blockStatus === blockFilter;
				} ).map( ( { title, name, icon, active, info } ) => {
					return ( <CSSTransition timeout={ 200 } key={ name } classNames={ 'block-control-transition' }>
						<BlockControl key={ name } title={ title } blockId={ name } status={ active }
							iconObject={ icon } onStatusChange={ handleBlockStatusChange }
							info={ info }
						/>
					</CSSTransition> );
				} )
			}
		</TransitionGroup>
	);
}

const selectMapping = ( selector ) => ( {
	blocks: selector( getBlocks ),
	blockFilter: selector( getBlockFilter ),
} );

const actionMapping = () => ( {
	setBlockStatus: setBlockActiveStatus,
} );

/**
 * @module BlockControlsContainer
 */
export default withStore( BlockControlsContainer, selectMapping, actionMapping );
