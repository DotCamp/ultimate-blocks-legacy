import React, { useEffect, useState } from 'react';
import { withSelect } from '@wordpress/data';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';

/**
 * Main container for upsell manager component.
 *
 * @param {Object}        props                 component properties
 * @param {string | null} props.activeBlock     type of currently active block on editor
 * @param {null | Object} props.blockUpsellData active block upsell data
 * @function Object() { [native code] }
 */
function UpsellMain({ activeBlock, blockUpsellData }) {
	const [summaryVisibility, setSummaryVisibility] = useState(false);

	return <div>upsell main</div>;
}

// selector mapping for core stores
const coreWithSelect = withSelect((select) => {
	const { getSelectedBlock } = select('core/block-editor');

	return {
		activeBlock: getSelectedBlock()?.name,
	};
})(UpsellMain);

// selector mapping for plugin main store
const mainStoreSelectMapping = (namespacedSelect) => {
	const { getUpsellDataActiveBlock } = namespacedSelect;

	return {
		blockUpsellData: getUpsellDataActiveBlock(),
	};
};

/*
 * @module UpsellMain
 */
export default connectWithMainStore(
	mainStoreSelectMapping,
	null
)(coreWithSelect);
