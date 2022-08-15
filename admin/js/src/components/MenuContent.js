// eslint-disable-next-line no-unused-vars
import React from 'react';
import ContentPhrase from "$Components/ContentPhrase";
import BlockStatusFilterControl from "$Components/BlockStatusFilterControl";

/**
 * Menu content component.
 * @constructor
 */
function MenuContent() {
	return (
		<div className={ 'menu-content' }>
			<ContentPhrase />
			<BlockStatusFilterControl />
		</div>
	);
}

/**
 * @module MenuContent
 */
export default MenuContent;
