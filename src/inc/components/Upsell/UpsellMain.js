import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { withSelect } from '@wordpress/data';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import { PortalBase } from '$Library/ub-common/Components';
import UpsellInspectorNotice from '$Inc/components/Upsell/UpsellInspectorNotice';
import UpsellModal from '$Inc/components/Upsell/UpsellModal';

/**
 * Main container for upsell manager component.
 *
 * @param {Object}        props                  component properties
 * @param {string | null} props.activeBlock      type of currently active block on editor, will be supplied via HOC
 * @param {string | null} props.activeBlockTitle title of currently active block on editor, will be supplied via HOC
 * @param {null | Object} props.blockUpsellData  active block upsell data, will be supplied via HOC
 * @function Object() { [native code] }
 */
function UpsellMain({ activeBlock, activeBlockTitle, blockUpsellData }) {
	const [summaryVisibility, setSummaryVisibility] = useState(false);
	const [noticeWrapperNode, setNoticeWrapperNode] = useState(null);

	const noticeParentQuery = '.interface-complementary-area';

	const onWrapRefChange = useCallback((el) => {
		setNoticeWrapperNode(el);
	}, []);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		// reOrderNotice();
	}, [noticeWrapperNode]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (activeBlock && blockUpsellData) {
			setSummaryVisibility(true);
		} else {
			setSummaryVisibility(false);
		}
	}, [activeBlock, blockUpsellData]);

	return (
		summaryVisibility && (
			<Fragment>
				<PortalBase targetQuery={noticeParentQuery}>
					<div
						className={'ub-upsell-inspector-notice-wrapper'}
						ref={onWrapRefChange}
					>
						<UpsellInspectorNotice blockTitle={activeBlockTitle} />
					</div>
				</PortalBase>
				<UpsellModal />
			</Fragment>
		)
	);
}

// selector mapping for core stores
const coreWithSelect = withSelect((select) => {
	const { getSelectedBlock } = select('core/block-editor');
	const { getBlockType } = select('core/blocks');

	return {
		activeBlock: getSelectedBlock()?.name,
		activeBlockTitle: getBlockType(getSelectedBlock()?.name)?.title,
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
