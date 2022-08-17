// eslint-disable-next-line no-unused-vars
import React from 'react';
import ContentPhrase from "$Components/ContentPhrase";
import BlockStatusFilterControl from "$Components/BlockStatusFilterControl";
import BlockControlsContainer from "$Components/BlockControlsContainer";
import withMenuContext from "$HOC/withMenuContext";
import { CreatedMenuContext } from "$Components/MenuContext";

/**
 * Menu content component.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {Object} props.menuData menu context data, will be supplied via HOC
 */
function MenuContent( { menuData } ) {
	const changeFilter = ( filterVar ) => {
		menuData.actions.setFilterValue( filterVar );
	};

	return (
		<div className={ 'menu-content' }>
			<ContentPhrase />
			<BlockStatusFilterControl filterVal={ menuData.app.blockFilter } onFilterChanged={ changeFilter } />
			<BlockControlsContainer />
		</div>
	);
}

/**
 * @module MenuContent
 */
export default withMenuContext( MenuContent );
