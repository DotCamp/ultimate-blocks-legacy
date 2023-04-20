import React, { useEffect, useState } from 'react';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { connectWithStore, withHookManager } from '$Library/ub-common/Inc';
import SavedStylesManager from '$Manager/SavedStylesManager';
import SavedStylesListing from '$Inc/components/SavedStyles/SavedStylesListing';
import {
	applyStyleToComponent,
	saveStyle,
	updateSavedStyle,
} from '$BlockStores/savedStyles/actions';
import {
	getComponentDefaultStyle,
	getComponentSavedStyleIds,
	getDefaultBlockAttributes,
} from '$BlockStores/savedStyles/selectors';
import SavedStylesAdvancedControls from '$Inc/components/SavedStyles/SavedStylesAdvancedControls';

/**
 * Saved styles inspector panel control container.
 *
 * @param {Object}        props                               component properties
 * @param {string | null} [props.overrideBlockType=null]      override to use given block type instead of currently active block type
 * @param {string}        props.blockType                     target component type, will be supplied via HOC
 * @param {Object}        props.componentStyles               all available component styles, will be supplied via HOC
 * @param {Function}      props.saveCurrentStyle              save current style, will be supplied via HOC
 * @param {Function}      props.updateCurrentStyle            update current style, will be supplied via HOC
 * @param {Object | null} [props.attributes=null]             attributes of the current active component, if not supplied, current attributes in the centralized registry will be used
 * @param {Array | null}  [props.attributesToSave=null]       list of attributes that will be marked to be saved, if this property is null, then all keys in `attributes` property will be marked to be saved
 * @param {Object | null} [props.defaultAttributes=null]      default attributes, if not supplied, default attributes in the centralized registry will be used
 * @param {Function}      props.applyStyleToComponent         function to apply styles to selected components, will be supplied via HOC
 * @param {Function}      props.setAttribute                  set attribute function
 * @param {Array}         props.savedStyleIds                 component saved style ids
 * @param {string}        props.defaultStyleId                component default style, will be supplied via HOC
 * @param {Function}      props.previewAttributeCallback      callback for preparing attributes to generate style previews
 * @param {Function}      props.previewElementCallback        callback for preparing element to generate style previews
 * @param {Function}      props.setAttributeRenderPreparation setter preparation method for render attribute preparation, will be supplied via HOC
 * @param {Function}      props.setElementRenderPreparation   setter preparation method for render element preparation, will be supplied via HOC
 * @param {Function}      props.setRenderPreviewParentBlock   set parent block type for preview renders, will be supplied via HOC
 * @param {Function}      props.setRenderPreviewBlockType     set preview block type, will be supplied via HOC
 * @param {string | null} props.activeStyleId                 currently active style id applied to selected component, will be supplied via HOC
 * @param {Function}      props.setActiveStyleId              function to set active style id, will be supplied via HOC
 * @param {string | null} props.selectedStyleId               id of selected style, will be supplied via HOC
 * @param {null | string} [props.previewParentBlockType=null] if active block is an inner-block with a defined parent block type, this property will define it, null for default parent block type
 * @param {null | string} [props.previewBlockType=null]       preview block type, with this prop, preview block type might be overridden, assigning null will force component to use currently active block type
 * @param {string | null} props.activeBlockId                 get block id of currently active block component, will be supplied via HOC
 * @param {Array}         props.cachedBlockIds                cached ids of available ub blocks on editor, will be supplied via HOC
 * @param {Function}      props.setStartupBlockIds            set startup block ids, will be supplied via HOC
 * @param {boolean}       [props.previewsEnabled=true]        status of preview displays
 * @param {Function}      props.setPreviewsEnabledStatus      set status of preview displays, will be supplied via HOC
 * @param {Function}      props.setCurrentBlockTypeOverride   set current block type override, will be supplied via HOC
 * @return {JSX.Element} saved styles panel component
 * @class
 */

function SavedStylesInspectorPanel({
	overrideBlockType = null,
	blockType,
	componentStyles,
	saveCurrentStyle,
	updateCurrentStyle,
	attributes = null,
	defaultAttributes = {},
	attributesToSave = null,
	// eslint-disable-next-line no-shadow
	applyStyleToComponent,
	setAttribute,
	savedStyleIds,
	defaultStyleId,
	previewAttributeCallback = (attr) => attr,
	previewElementCallback = (el) => el,
	setAttributeRenderPreparation,
	setElementRenderPreparation,
	setRenderPreviewParentBlock,
	setRenderPreviewBlockType,
	activeStyleId,
	setActiveStyleId,
	selectedStyleId,
	previewParentBlockType = null,
	previewBlockType = null,
	activeBlockId,
	cachedBlockIds,
	setStartupBlockIds,
	previewsEnabled = true,
	setPreviewsEnabledStatus,
	setSelectedItemId,
	setCurrentBlockTypeOverride,
}) {
	const [markedAttributes, setMarkedAttributes] = useState(
		prepareFinalAttributes()
	);

	/**
	 * Is component marked to apply default style on mount.
	 *
	 * @return {undefined | boolean} marked status
	 */
	function isSubcomponentMarkedForDefaultStyle() {
		return attributes.applyDefaultStyle;
	}

	/**
	 * Is block marked to apply default style on mount.
	 */
	function isBlockMarkedForDefaultStyle() {
		return !cachedBlockIds.includes(activeBlockId);
	}

	/**
	 * Calculate active style id.
	 *
	 * @return {string | null} active style id
	 */
	function calculateActiveStyleId() {
		let savedStyleId = null;

		try {
			// eslint-disable-next-line array-callback-return
			savedStyleIds.map((id) => {
				if (Object.prototype.hasOwnProperty.call(componentStyles, id)) {
					const savedStyleObject = componentStyles[id];

					if (savedStyleObject) {
						const equalityStatus =
							JSON.stringify(markedAttributes) ===
							JSON.stringify(savedStyleObject.styles);

						if (equalityStatus) {
							savedStyleId = id;

							// get out of iteration when saved style id is found
							throw new Error();
						}
					}
				}
			});
		} catch (e) {
			// do nothing
		}

		return savedStyleId;
	}

	/**
	 * Prepare final attribute object which is only including properties marked as to be saved.
	 *
	 * @return {Object} final attributes
	 */
	function prepareFinalAttributes() {
		let finalAttributes = {};

		if (attributesToSave === null) {
			finalAttributes = attributes;
		} else {
			// eslint-disable-next-line array-callback-return
			attributesToSave.map((key) => {
				finalAttributes[key] = attributes[key];
			});
		}

		return finalAttributes;
	}

	/**
	 * Save style with a given name.
	 *
	 * @param {string}  styleName style name
	 * @param {boolean} isStatic  is style static
	 */
	function saveStyleFunction(styleName, isStatic = false) {
		// apply newly saved style to trigger related operations
		saveCurrentStyle(styleName, markedAttributes, isStatic).then(
			applyStyle
		);
	}

	/**
	 * Apply style to component.
	 *
	 * @param {string | null} [styleId=null] style id
	 */
	function applyStyle(styleId = null) {
		// if no style id is supplied, use currently selected style id
		const finalStyleId =
			typeof styleId === 'string'
				? styleId || selectedStyleId
				: selectedStyleId;

		applyStyleToComponent(
			finalStyleId,
			blockType,
			defaultAttributes,
			setAttribute
		);
	}

	/**
	 * Update component style with a new properties.
	 *
	 * @param {string} styleId style id to update
	 */
	function updateComponentStyle(styleId) {
		if (styleId) {
			// apply newly updated style to trigger related operations
			updateCurrentStyle(styleId, markedAttributes).then(applyStyle);
		}
	}

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setCurrentBlockTypeOverride(overrideBlockType);
	}, []);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setPreviewsEnabledStatus(previewsEnabled);
	}, [previewsEnabled]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setAttributeRenderPreparation(previewAttributeCallback);
	}, [previewAttributeCallback]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setElementRenderPreparation(previewElementCallback);
	}, [previewElementCallback]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setRenderPreviewParentBlock(previewParentBlockType);
	}, [previewParentBlockType]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setRenderPreviewBlockType(previewBlockType);
	}, [previewBlockType]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		setMarkedAttributes(prepareFinalAttributes());
	}, [attributes]);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		// reset selected item
		setSelectedItemId(null);

		// calculate and update active style id
		setActiveStyleId(calculateActiveStyleId());

		// apply default style to subcomponents
		if (isSubcomponentMarkedForDefaultStyle()) {
			setAttribute({ ...attributes, applyDefaultStyle: false });
			if (defaultStyleId) {
				applyStyle(defaultStyleId);
			}
		}

		// apply default style to newly added blocks
		if (isBlockMarkedForDefaultStyle()) {
			// update cached block ids, this way any added new block will not be rechecked for default style functionality
			setStartupBlockIds([...cachedBlockIds, activeBlockId]);

			if (defaultStyleId) {
				applyStyle(defaultStyleId);
			}
		}
	}, [markedAttributes]);

	return (
		<PanelBody title={__('Styles', 'ultimate-blocks')}>
			<div className={'ub-pro-saved-styles-inspector-wrapper'}>
				<SavedStylesListing
					styles={componentStyles}
					applyStyle={applyStyle}
					activeItemId={activeStyleId}
					updateComponentStyle={updateComponentStyle}
				/>
				<SavedStylesAdvancedControls
					saveFunction={saveStyleFunction}
					updateFunction={updateComponentStyle}
					applyStyle={applyStyle}
				/>
			</div>
		</PanelBody>
	);
}

// store action mapping
const actionMapping = (storeDispatch, storeSelect) => {
	const {
		setAttributeRenderPreparation,
		setElementRenderPreparation,
		setActiveItemId,
		setRenderPreviewParentBlock,
		setRenderPreviewBlockType,
		setStartupBlockIds,
		setPreviewsEnabledStatus,
		setSelectedItemId,
		setCurrentBlockTypeOverride,
	} = storeDispatch;
	return {
		saveCurrentStyle: saveStyle(storeDispatch, storeSelect),
		updateCurrentStyle: updateSavedStyle(storeDispatch, storeSelect),
		applyStyleToComponent: applyStyleToComponent(
			storeDispatch,
			storeSelect
		),
		setAttributeRenderPreparation,
		setElementRenderPreparation,
		setRenderPreviewParentBlock,
		setRenderPreviewBlockType,
		setActiveStyleId: setActiveItemId,
		setStartupBlockIds,
		setPreviewsEnabledStatus,
		setSelectedItemId,
		setCurrentBlockTypeOverride,
	};
};

// store selection mapping
const selectMapping = (namespacedSelect, ownProps) => {
	const blockType = namespacedSelect.getBlockType();
	const {
		getActiveItemId,
		getSelectedItemId,
		getBlockId,
		getStartupBlockIds,
	} = namespacedSelect;
	const selectObject = {
		blockType,
		componentStyles: namespacedSelect.getComponentSavedStyles(blockType),
		savedStyleIds: getComponentSavedStyleIds(namespacedSelect),
		defaultStyleId: getComponentDefaultStyle(namespacedSelect),
		activeStyleId: getActiveItemId(),
		selectedStyleId: getSelectedItemId(),
		activeBlockId: getBlockId(),
		cachedBlockIds: getStartupBlockIds(),
	};

	// if no attributes are supplied, use the attributes of the currently selected block
	if (!ownProps.attributes) {
		// eslint-disable-next-line no-unused-vars
		const { blockID, ...rest } = namespacedSelect.getBlockAttributes();
		selectObject.attributes = rest;
	}

	// if no default attributes are supplied, use default attributes of the selected block available in the centralized registry
	if (!ownProps.defaultAttributes) {
		selectObject.defaultAttributes =
			getDefaultBlockAttributes(namespacedSelect);
	}

	return selectObject;
};

/**
 * @module SavedStylesInspectorPanel
 */
export default withHookManager(
	connectWithStore(
		SavedStylesManager.storeNamespace,
		selectMapping,
		actionMapping
	)(SavedStylesInspectorPanel)
);
