// eslint-disable-next-line no-unused-vars
import React from 'react';
import withMenuContext from "$HOC/withMenuContext";
import BlockControl from "$Components/BlockControl";

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
		<div className={ 'controls-container' }>
			{
				menuData.blocks.info.map( ( { title, name } ) => {
					return <BlockControl key={ name } title={ title } blockId={ name } status={ getStatus( name ) } />;
				} )
			}
		</div>
	);
}

/**
 * @module BlockControlsContainer
 */
export default withMenuContext( BlockControlsContainer );
