import React, { useState, useEffect } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	deleteStyle,
	setStyleAsDefaultThunk,
	updateStyleTitleAction,
} from '$BlockStores/savedStyles/actions';
import { getComponentDefaultStyle } from '$BlockStores/savedStyles/selectors';
import { connectWithStore } from '$Library/ub-common/Inc';
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
 * @param {string | null} props.defaultStyleId      default style id for current block
 * @param {Function}      props.setDefaultStyle     set selected style as default for current block
 * @param {Function}      props.removeDefaultStyle  unmark selected style as default for current block
 * @param {string | null} props.selectedStyleName   name of selected style
 * @param {Function}      props.updateStyleTitle    update title of currently selected style
 * @class
 */
function SelectedSavedStyleControls({
	deleteStyle,
	selectedItemId,
	busyStatus,
	updateStyleFunction,
	activeItemId,
	applyStyle,
	defaultStyleId,
	setDefaultStyle,
	removeDefaultStyle,
	selectedStyleName,
	updateStyleTitle,
}) {
	const [titleEditStatus, setTitleEditStatus] = useState(false);
	const [editedTitle, setEditedTitle] = useState(selectedStyleName);

	useEffect(() => {
		setTitleEditStatus(false);
		setEditedTitle(selectedStyleName);
	}, [selectedStyleName]);

	/**
	 * Generic disabled status.
	 *
	 * @return {boolean} disabled status
	 */
	function genericDisabledStatus() {
		return busyStatus || selectedItemId === null;
	}

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
	 * Disabled status for setting default style operation.
	 *
	 * @return {boolean} disabled status
	 */
	function isDefaultDisabled() {
		return genericDisabledStatus() || selectedItemId === defaultStyleId;
	}

	/**
	 * Remove default functionality status.
	 *
	 * @return {boolean} status
	 */
	function isRemoveDefaultEnabled() {
		return selectedItemId && selectedItemId === defaultStyleId;
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
			return UB_ENV === 'production';
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
		defaultStyleId: getComponentDefaultStyle(storeSelect),
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
		setDefaultStyle: () => {},
		removeDefaultStyle: () =>
			setStyleAsDefaultThunk(storeDispatch, storeSelect)(null),
	};
};

/**
 * @module SelectedStyleControls
 */
export default connectWithStore(
	SavedStylesManager.storeNamespace,
	selectMapping,
	actionMapping
)(withBusyStatus(SelectedSavedStyleControls));
