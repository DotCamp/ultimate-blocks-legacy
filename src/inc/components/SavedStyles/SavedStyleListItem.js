import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { connectWithStore } from '$Library/ub-common/Inc';
import { getRenderedPreviewThunk } from '$BlockStores/savedStyles/actions';
import SavedStylesManager from '$Manager/SavedStylesManager';
import ListItemPill from '$Inc/components/SavedStyles/ListItemPill';
import StylePreviewModal from '$Inc/components/SavedStyles/StylePreviewModal';

/**
 * List item to be used inside saved styles listing.
 *
 * @param {Object}   props                      component properties
 * @param {string}   props.title                list item title
 * @param {string}   props.filterClause         filter clause
 * @param {boolean}  [props.disabled=false]     disabled status
 * @param {Function} [props.itemClicked=()=>{}] item clicked callback function
 * @param {string}   props.id                   unique id
 * @param {boolean}  props.isSelected           whether current item is selected
 * @param {boolean}  props.isActive             is item active
 * @param {boolean}  props.isDefault            is item default
 * @param {Function} props.getPreview           get string representation of style item, will be supplied via HOC
 * @param {Object}   props.renderedComponents   rendered components
 * @param {boolean}  props.isPreviewsEnabled    preview render status, will be supplied via HOC
 * @return {JSX.Element} saved style list item component
 * @class
 */
function SavedStyleListItem({
	id,
	title,
	filterClause,
	disabled = false,
	itemClicked = () => {},
	isSelected,
	isActive,
	isDefault,
	getPreview,
	renderedComponents,
	isPreviewsEnabled,
}) {
	const [htmlPreview, setHtmlPreview] = useState(null);

	const [showPreviewVisibility, setShowPreview] = useState(false);

	/**
	 * Whether to show block style previews or not.
	 *
	 * @return {boolean} status
	 */
	function showPreview() {
		return isPreviewsEnabled && showPreviewVisibility;
	}

	/**
	 * useEffect hook
	 */
	useEffect(() => {
		if (showPreview()) {
			// queue render operation to not block main thread
			setTimeout(async () => {
				const html = await getPreview(id);
				setHtmlPreview(html);
			}, 10);
		}
	}, [showPreview(), renderedComponents]);

	/**
	 * Generate item title.
	 *
	 * @return {{__html: string}} html content
	 */
	function itemTitle() {
		const regExp = new RegExp(`${filterClause}`, 'gi');

		let reformedTitle =
			filterClause !== ''
				? title.replaceAll(
						regExp,
						'<span class="matched-title">$&</span>'
				  )
				: `<span>${title}</span>`;

		if (filterClause !== '') {
			reformedTitle = `<span class="matched-title-base">${reformedTitle}</span>`;
		}

		return {
			__html: reformedTitle,
		};
	}

	/**
	 * Item click callback.
	 *
	 * @param {Event} e event object
	 */
	function itemClick(e) {
		e.preventDefault();
		itemClicked(id);
	}

	return (
		<Fragment>
			{showPreview() && (
				<StylePreviewModal
					targetQuery={'.interface-interface-skeleton__content'}
					htmlContent={htmlPreview}
					styleTitle={title}
				/>
			)}
			{/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
			<div
				onMouseOver={() => setShowPreview(true)}
				onMouseLeave={() => setShowPreview(false)}
			>
				<ListItemPill
					disabled={disabled}
					pillClick={itemClick}
					isSelected={isSelected}
					isActive={isActive}
					isDefault={isDefault}
					title={itemTitle()}
				/>
			</div>
		</Fragment>
	);
}

// store select mapping
const selectMapping = (storeSelect) => {
	const { getRendered, isPreviewsEnabled } = storeSelect;

	return {
		renderedComponents: getRendered(),
		isPreviewsEnabled: isPreviewsEnabled(),
	};
};

// store action mapping
const actionMapping = (storeDispatch, storeSelect) => {
	return {
		getPreview: getRenderedPreviewThunk(storeDispatch, storeSelect),
	};
};

/**
 * @module SavedStyleListItem
 */
export default connectWithStore(
	SavedStylesManager.storeNamespace,
	selectMapping,
	actionMapping
)(SavedStyleListItem);
