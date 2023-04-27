// eslint-disable-next-line no-unused-vars
import React from 'react';
import ContentPhrase from '$Components/ContentPhrase';
import BlockStatusFilterControl from '$Components/BlockStatusFilterControl';
import {
	getBlockFilter,
	setBlockFilter,
} from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';
import BlockControlsContainer from '$Components/BlockControlsContainer';

/**
 * Menu content component.
 *
 * @function Object() { [native code] }
 *
 * @param {Object}   props                     component properties
 * @param {string}   props.blockFilter         current block filter, will be supplied via HOC
 * @param {Function} props.setBlockFilterValue set block filter value for the app, will be supplied via HOC
 */
function MainContent({ blockFilter, setBlockFilterValue }) {
	return (
		<div className={'menu-content'}>
			<ContentPhrase />
			<BlockStatusFilterControl
				filterVal={blockFilter}
				onFilterChanged={setBlockFilterValue}
			/>
			<BlockControlsContainer />
		</div>
	);
}

const selectMapping = (selector) => {
	return {
		blockFilter: selector(getBlockFilter),
	};
};

const actionMapping = () => {
	return {
		setBlockFilterValue: setBlockFilter,
	};
};

/**
 * @module MenuContent
 */
export default withStore(MainContent, selectMapping, actionMapping);
