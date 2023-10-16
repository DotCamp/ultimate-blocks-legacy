// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import BlockControlCard from '$Components/BlockControlCard';
import { FILTER_TYPES } from '$Components/BlockStatusFilterControl';
import withStore from '$HOC/withStore';
import {
	getBlocks,
	setBlockActiveStatus,
} from '$Stores/settings-menu/slices/blocks';
import {
	getBlockFilter,
	getBlockInfoShowStatus,
	getProStatus,
} from '$Stores/settings-menu/slices/app';
import { toggleBlockStatus } from '$Stores/settings-menu/actions';
import VisibilityWrapper from '$Components/VisibilityWrapper';

/**
 * Block controls container.
 *
 * @class
 *
 * @param {Object}   props                component properties
 * @param {Object}   props.blocks         menu data, will be supplied via HOC
 * @param {Object}   props.blockFilter    current filter for block status, will be supplied via HOC
 * @param {Function} props.dispatch       store action dispatch function, will be supplied via HOC
 * @param {Function} props.setBlockStatus set a block's active status, will be supplied via HOC
 * @param {boolean}  props.showInfoStatus status of showing extra information in block controls, will be supplied via HOC
 * @param {boolean}  props.proStatus      plugin pro status, will be supplied via HOC
 */
function BlockControlsContainer( {
	blocks,
	blockFilter,
	setBlockStatus,
	dispatch,
	showInfoStatus,
	proStatus,
} ) {
	const [ innerBlocks, setInnerBlocks ] = useState( blocks );

	/**
	 * Handle block status change.
	 *
	 * @param {boolean} proBlock is calling block belongs to pro version of the plugin
	 */
	const handleBlockStatusChange = ( proBlock ) => ( blockId, status ) => {
		if ( proBlock && ! proStatus ) {
			setBlockStatus( { id: blockId, status: false } );
			return;
		}

		setBlockStatus( { id: blockId, status } );
		dispatch( toggleBlockStatus )( blockId, status );
	};

	// useEffect hook
	useEffect( () => {
		const sortedBlocks = [ ...blocks ].sort( ( a, b ) => {
			const aName = a.title.toLowerCase();
			const bName = b.title.toLowerCase();

			if ( aName < bName ) {
				return -1;
			}
			if ( aName > bName ) {
				return 1;
			}

			return 0;
		} );

		setInnerBlocks( sortedBlocks );
	}, [ blocks ] );

	return (
		<div
			className={ 'controls-container' }
			data-show-info={ JSON.stringify( showInfoStatus ) }
		>
			{ innerBlocks.map( ( { title, name, icon, active, info, pro } ) => {
				const blockStatus = active
					? FILTER_TYPES.ENABLED
					: FILTER_TYPES.DISABLED;
				const visibilityStatus =
					blockFilter === FILTER_TYPES.ALL
						? true
						: blockStatus === blockFilter;
				return (
					<VisibilityWrapper
						key={ name }
						visibilityStatus={ visibilityStatus }
					>
						<BlockControlCard
							title={ title }
							blockId={ name }
							status={ active }
							iconObject={ icon }
							onStatusChange={ handleBlockStatusChange( pro ) }
							info={ info }
							proBlock={ pro }
						/>
					</VisibilityWrapper>
				);
			} ) }
		</div>
	);
}

const selectMapping = ( selector ) => ( {
	blocks: selector( getBlocks ),
	blockFilter: selector( getBlockFilter ),
	showInfoStatus: selector( getBlockInfoShowStatus ),
	proStatus: selector( getProStatus ),
} );

const actionMapping = () => ( {
	setBlockStatus: setBlockActiveStatus,
} );

/**
 * @module BlockControlsContainer
 */
export default withStore(
	BlockControlsContainer,
	selectMapping,
	actionMapping
);
