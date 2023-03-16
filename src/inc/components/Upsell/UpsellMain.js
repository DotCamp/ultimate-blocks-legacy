import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withSelect } from '@wordpress/data';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import { PortalBase } from '$Library/ub-common/Components';
import UpsellInspectorNotice from '$Inc/components/Upsell/UpsellInspectorNotice';

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
	const [stickyTabbing, setStickyTabbing] = useState(48);
	const [noticeWrapperNode, setNoticeWrapperNode] = useState(null);

	const noticeParentQuery = '.components-panel';

	const onWrapRefChange = useCallback((el) => {
		setNoticeWrapperNode(el);
	}, []);

	/**
	 * Calculate tabbed height distance.
	 *
	 * @return {number | null} height.
	 */
	const calculateStickyTab = () => {
		const editInspectorHeader = document.querySelector(
			'.edit-post-sidebar__panel-tabs'
		);

		if (editInspectorHeader) {
			const { height: headerHeight } =
				editInspectorHeader.getBoundingClientRect();

			return headerHeight;
		}

		return null;
	};

	/**
	 * Reorder notice component in DOM to first place in its container element to maintain its visual functionality.
	 */
	const reOrderNotice = () => {
		if (noticeWrapperNode) {
			const noticeParent = document.querySelector(noticeParentQuery);

			if (noticeParent) {
				noticeParent.insertAdjacentElement(
					'afterbegin',
					noticeWrapperNode
				);
			}
		}
	};

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		reOrderNotice();
	}, [noticeWrapperNode]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (activeBlock && blockUpsellData) {
			setSummaryVisibility(true);

			const headerHeight = calculateStickyTab();

			if (headerHeight !== null) {
				setStickyTabbing(headerHeight);
			}
		} else {
			setSummaryVisibility(false);
		}
	}, [activeBlock, blockUpsellData]);

	return (
		summaryVisibility && (
			<PortalBase targetQuery={noticeParentQuery}>
				<div
					style={{
						top: `${stickyTabbing}px`,
					}}
					className={'ub-upsell-inspector-notice-wrapper'}
					ref={onWrapRefChange}
				>
					<UpsellInspectorNotice blockTitle={activeBlockTitle} />
				</div>
			</PortalBase>
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
