// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import BlockControl from "$Components/BlockControl";
import { FILTER_TYPES } from "$Components/BlockStatusFilterControl";
import withStore from "$HOC/withStore";
import { getBlocks, setBlockActiveStatus } from "$Stores/settings-menu/slices/blocks";
import { getBlockFilter, getBlockInfoShowStatus } from "$Stores/settings-menu/slices/app";
import { toggleBlockStatus } from "$Stores/settings-menu/actions";
import VisibilityWrapper from "$Components/VisibilityWrapper";

/**
 * Block controls container.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {Object} props.blocks menu data, will be supplied via HOC
 * @param {Object} props.blockFilter current filter for block status, will be supplied via HOC
 * @param {Function} props.setBlockStatus set a block's active status, will be supplied via HOC
 * @param {Boolean} props.showInfoStatus status of showing extra information in block controls, will be supplied via HOC
 */
function BlockControlsContainer( { blocks, blockFilter, setBlockStatus, dispatch, showInfoStatus } ) {
	/**
	 * Handle block status change
	 * @param {String} blockId target id
	 * @param {boolean} status status value
	 */
	const handleBlockStatusChange = ( blockId, status ) => {
		setBlockStatus( { id: blockId, status } );
		dispatch( toggleBlockStatus )( blockId, status );
	};

	const [ innerBlocks, setInnerBlocks ] = useState( blocks );

	useEffect( () => {
		const sortedBlocks = [ ...blocks ].sort(
			( a, b ) => {
				const aName = a.title;
				const bName = b.title;

				if ( aName < bName ) {
					return -1;
				} else if ( aName > bName ) {
					return 1;
				}

				return 0;
			}
		);

		setInnerBlocks( sortedBlocks );
	}, [ blocks ] );

	return (
		<div className={ 'controls-container' } data-show-info={ JSON.stringify( showInfoStatus ) }>
			{
				innerBlocks.map( ( { title, name, icon, active, info } ) => {
					const blockStatus = active ? FILTER_TYPES.ENABLED : FILTER_TYPES.DISABLED;
					const visibilityStatus = blockFilter === FILTER_TYPES.ALL ? true : blockStatus === blockFilter;
					return (
						<VisibilityWrapper
							key={ name }
							visibilityStatus={ visibilityStatus }
						>
							<BlockControl title={ title } blockId={ name } status={ active } iconObject={ icon }
								onStatusChange={ handleBlockStatusChange } info={ info } /></VisibilityWrapper>
					);
				} )
			}
		</div>
	);
}

const selectMapping = ( selector ) => ( {
	blocks: selector( getBlocks ),
	blockFilter: selector( getBlockFilter ),
	showInfoStatus: selector( getBlockInfoShowStatus ),
} );

const actionMapping = () => ( {
	setBlockStatus: setBlockActiveStatus,
} );

/**
 * @module BlockControlsContainer
 */
export default withStore( BlockControlsContainer, selectMapping, actionMapping );
