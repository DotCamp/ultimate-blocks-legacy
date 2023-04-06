import React, { useState, useEffect } from 'react';
import SavedStylesListingFilter from '$Inc/components/SavedStyles/SavedStylesListingFilter';
import SavedStyleItemCardContainer from '$Inc/components/SavedStyles/SavedStyleItemCardContainer';
import withBusyStatus from '$BlockStores/savedStyles/hoc/withBusyStatus';
import {
	deleteStyle,
	setStyleAsDefaultThunk,
} from '$BlockStores/savedStyles/actions';
import { getComponentDefaultStyle } from '$BlockStores/savedStyles/selectors';
import { connectWithStore } from '$Library/ub-common/Inc';
import SavedStylesManager from '$Manager/SavedStylesManager';

/**
 * Component for displaying currently available styles for plugin blocks.
 *
 * @param {Object}             props                            components properties
 * @param {undefined | Object} props.styles                     styles
 * @param {Function}           [props.applyStyle=() => {}]      apply selected style
 * @param {boolean}            props.busyStatus                 busy status of application, will be supplied via HOC
 * @param {null | string}      props.activeItemId               id of active saved style
 * @param {undefined | string} props.defaultStyle               default style id for current block, will be supplied via HOC
 * @param {boolean}            props.advancedControlsVisibility visibility status of advanced controls, will be supplied via HOC
 * @param {string| null}       props.selectedItemId             selected style item id, will be supplied via HOC
 * @param {Function}           props.setSelectedItemId          set id of selected style, will be supplied via HOC
 * @return {JSX.Element} saved style listing component
 * @class
 */
function SavedStylesListing({
	busyStatus,
	styles,
	applyStyle = () => {},
	activeItemId,
	defaultStyle,
	advancedControlsVisibility,
	selectedItemId,
	setSelectedItemId,
}) {
	const [filterName, setFilterName] = useState('');
	const [filteredStyles, setFilteredStyles] = useState(styles);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		if (!advancedControlsVisibility && activeItemId !== selectedItemId) {
			applyStyle(selectedItemId);
		}
	}, [selectedItemId]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		const filteredStyleList = Object.keys(styles).reduce(
			(carry, styleId) => {
				if (Object.prototype.hasOwnProperty.call(styles, styleId)) {
					if (
						styles[styleId].title
							.toLowerCase()
							.includes(filterName.toLowerCase())
					) {
						carry[styleId] = styles[styleId];
					}
				}
				return carry;
			},
			{}
		);

		setFilteredStyles(filteredStyleList);
	}, [styles, filterName]);

	return (
		<div className={'ub-pro-saved-styles-inspector-listing-parent'}>
			<SavedStylesListingFilter
				value={filterName}
				onInput={setFilterName}
			/>
			<SavedStyleItemCardContainer
				filterClause={filterName}
				styles={filteredStyles}
				onItemSelect={setSelectedItemId}
				selectedItemId={selectedItemId}
				activeItemId={activeItemId}
				defaultStyleId={defaultStyle}
			/>
		</div>
	);
}

// store select mapping
const selectMapping = (storeSelect) => {
	const { isAdvancedControlsVisible, getSelectedItemId } = storeSelect;
	return {
		defaultStyle: getComponentDefaultStyle(storeSelect),
		advancedControlsVisibility: isAdvancedControlsVisible(),
		selectedItemId: getSelectedItemId(),
	};
};

// store action mapping
const actionMapping = (storeDispatch, storeSelect) => {
	const { setSelectedItemId } = storeDispatch;
	return {
		deleteComponentStyle: deleteStyle(storeDispatch, storeSelect),
		setDefaultStyle: setStyleAsDefaultThunk(storeDispatch, storeSelect),
		removeDefaultStyle: () => {
			setStyleAsDefaultThunk(storeDispatch, storeSelect)(null);
		},
		setSelectedItemId,
	};
};

/**
 * @module SavedStylesListing
 */
export default connectWithStore(
	SavedStylesManager.storeNamespace,
	selectMapping,
	actionMapping
)(withBusyStatus(SavedStylesListing));
