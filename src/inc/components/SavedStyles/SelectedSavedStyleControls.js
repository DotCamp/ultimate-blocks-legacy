import React, { useState, useEffect } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	deleteStyle,
	updateStyleTitleAction,
} from '$BlockStores/savedStyles/actions';
import { connectWithStore } from '$Library/ub-common/Inc';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import SavedStylesManager from '$Manager/SavedStylesManager';
import withBusyStatus from '$BlockStores/savedStyles/hoc/withBusyStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SavedStylesAdvancedButton from '$Inc/components/SavedStyles/SavedStylesAdvancedButton';

/**
 * Control wrapper for selected styles.
 *
 * @param {Object}        props                     component properties
 * @param {Function}      props.deleteStyle         delete a style, will be supplied via HOC
 * @param {string | null} props.selectedItemId      selected style item id, will be supplied via HOC
 * @param {boolean}       props.busyStatus          app busy status, will be supplied via HOC
 * @param {Function}      props.updateStyleFunction update selected style item with current component styles
 * @param {string|null}   props.activeItemId        currently active style id, will be supplied via HOC
 * @param {Function}      props.applyStyle          apply currently selected style to active block
 * @param {string | null} props.selectedStyleName   name of selected style
 * @param {Function}      props.updateStyleTitle    update title of currently selected style
 * @param {boolean}       props.prodStatus          plugin production status, will be supplied via HOC
 * @class
 */
function SelectedSavedStyleControls({
	// eslint-disable-next-line no-shadow
	deleteStyle,
	selectedItemId,
	busyStatus,
	updateStyleFunction,
	activeItemId,
	applyStyle,
	selectedStyleName,
	updateStyleTitle,
	prodStatus,
}) {
	const [titleEditStatus, setTitleEditStatus] = useState(false);
	const [editedTitle, setEditedTitle] = useState(selectedStyleName);

	useEffect(() => {
		setTitleEditStatus(false);
		setEditedTitle(selectedStyleName);
	}, [selectedStyleName]);

	/**
	 * Disabled status for apply operation.
	 *
	 * @return {boolean} disabled status
	 */
	function isApplyDisabled() {
		return (
			busyStatus ||
			selectedItemId === activeItemId ||
			selectedItemId === null
		);
	}

	/**
	 * Save updated style title to server.
	 */
	function updateStyleTitleToServer() {
		if (titleEditStatus && selectedStyleName !== editedTitle) {
			updateStyleTitle(selectedItemId, editedTitle);
		}
		setTitleEditStatus(false);
	}

	/**
	 * Start title edit operation.
	 */
	function startTitleEdit() {
		if (!staticStyleDisabledStatus()) {
			if (titleEditStatus && selectedStyleName !== editedTitle) {
				updateStyleTitleToServer();
			} else {
				setEditedTitle(selectedStyleName);
				setTitleEditStatus(!titleEditStatus);
			}
		}
	}

	/**
	 * Static style disabled status.
	 */
	function staticStyleDisabledStatus() {
		if (selectedItemId && selectedItemId.startsWith('ub-dev')) {
			return prodStatus;
		}
		return false;
	}

	return (
		<div className={'selected-saved-style-controls'}>
			<div className={'title-wrapper'}>
				<div className={'style-title'}>
					<input
						className={'title-input'}
						type={'text'}
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value.trim())}
						onKeyDown={(e) => {
							if (e.code === 'Enter') {
								updateStyleTitleToServer();
							}
						}}
						disabled={!titleEditStatus}
					/>
				</div>
				<div className={'edit-icon'}>
					{!staticStyleDisabledStatus() && (
						<FontAwesomeIcon
							icon={'pen'}
							onClick={startTitleEdit}
						/>
					)}
				</div>
			</div>
			<SavedStylesAdvancedButton
				isUpsell={staticStyleDisabledStatus()}
				className={'ub-pro-saved-styles-listing-delete-button'}
				containerClassName={'ub-pro-saved-styles-listing-delete-button'}
				disabled={staticStyleDisabledStatus()}
				isSmall={true}
				variant={'secondary'}
				onClick={deleteStyle}
				isDestructive={true}
			>
				{__('Delete', 'ultimate-blocks')}
			</SavedStylesAdvancedButton>
			<SavedStylesAdvancedButton
				className={'ub-pro-saved-styles-listing-update-button'}
				containerClassName={'ub-pro-saved-styles-listing-update-button'}
				disabled={staticStyleDisabledStatus()}
				isUpsell={staticStyleDisabledStatus()}
				isSmall={true}
				variant={'secondary'}
				onClick={() => updateStyleFunction(selectedItemId)}
			>
				{__('Update', 'ultimate-blocks')}
			</SavedStylesAdvancedButton>
			<Button
				className={'ub-pro-saved-styles-listing-apply-button'}
				disabled={isApplyDisabled()}
				isSmall={true}
				variant={'primary'}
				onClick={applyStyle}
			>
				{__('Apply', 'ultimate-blocks')}
			</Button>
			<SavedStylesAdvancedButton
				className={'ub-pro-saved-styles-listing-default-button'}
				containerClassName={
					'ub-pro-saved-styles-listing-default-button'
				}
				disabled={true}
				isSmall={true}
				variant={'primary'}
			>
				{__('Set as Default Style', 'ultimate-blocks')}
			</SavedStylesAdvancedButton>
		</div>
	);
}

/**
 * Store selection mapping.
 *
 * @param {Object} storeSelect namespaced store select object
 * @return {Object} selection mapping
 */
const selectMapping = (storeSelect) => {
	const { getSelectedItemId, getActiveItemId, getComponentStyleName } =
		storeSelect;
	return {
		selectedItemId: getSelectedItemId(),
		activeItemId: getActiveItemId(),
		selectedStyleName: getComponentStyleName(getSelectedItemId()),
	};
};

/**
 * Store action mapping.
 *
 * @param {Object} storeDispatch namespaced store dispatch object
 * @param {Object} storeSelect   namespaced store select object
 * @return {Object} action mapping
 */
const actionMapping = (storeDispatch, storeSelect) => {
	return {
		updateStyleTitle: updateStyleTitleAction(storeDispatch, storeSelect),
		deleteStyle: deleteStyle(storeDispatch, storeSelect),
	};
};

// select mapping for main store
const mainStoreSelectMapping = (namespacedSelect) => {
	const { inProduction } = namespacedSelect;

	return {
		prodStatus: inProduction(),
	};
};

/**
 * @module SelectedStyleControls
 */
export default connectWithMainStore(
	mainStoreSelectMapping,
	null
)(
	connectWithStore(
		SavedStylesManager.storeNamespace,
		selectMapping,
		actionMapping
	)(withBusyStatus(SelectedSavedStyleControls))
);
