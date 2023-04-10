import React from 'react';
import ProPass from '$Inc/components/ProPass';
import SavedStylesInspectorPanel from '$Inc/components/SavedStyles/SavedStylesInspectorPanel';

/**
 * Saved styles inspector container for base version.
 *
 * This component will automatically check for pro version to decide visibility of base version of saved styles inspector panel.
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
 * @function Object() { [native code] }
 */
function SavedStylesInspector(props) {
	return (
		<ProPass>
			<SavedStylesInspectorPanel {...props} />
		</ProPass>
	);
}

/**
 * @module SavedStylesInspector
 */
export default SavedStylesInspector;
