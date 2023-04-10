import { select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import SavedStylesManager from '$Manager/SavedStylesManager';

/**
 * Store selectors.
 *
 * @type {Object}
 */
const selectors = {
	/**
	 * Get rendered component HTML strings.
	 *
	 * @param {Object} state store state
	 *
	 * @return {Object} rendered component HTML strings object
	 */
	getRendered(state) {
		return state.rendered;
	},
	/**
	 * Get busy state of saved styles component.
	 *
	 * @param {Object} state store state
	 * @return {boolean} busy state
	 */
	busyState(state) {
		return state.app.busy;
	},
	/**
	 * Get styles related to supplied component name.
	 *
	 * @param {Object}        state         store state
	 * @param {string | null} componentName name of component
	 * @return {Object} component saved styles
	 */
	getComponentSavedStyles(state, componentName = null) {
		return componentName
			? { ...state.saved.styles[componentName] } || {}
			: state.saved.styles;
	},
	/**
	 * Get option.
	 *
	 * @param {Object} state       store state
	 * @param {string} propertyKey option property key
	 * @return {null | Object} option property value
	 */
	getOptions(state, propertyKey) {
		return state.options[propertyKey];
	},
	/**
	 * Get style object of given style of a component.
	 *
	 * @param {Object} state         store state
	 * @param {string} componentName name of component
	 * @param {string} styleId       style id
	 * @return {null | Object} style object
	 */
	getComponentStyleObject(state, componentName, styleId) {
		const componentType = styleId ? componentName : getBlockTypeExternal();
		const targetId = styleId ? styleId : componentName;
		return state.saved.styles?.[componentType]?.[targetId]?.styles;
	},
	/**
	 * Get name of given style of a component.
	 *
	 * @param {Object} state         store state
	 * @param {string} componentName name of component
	 * @param {string} styleId       style id
	 * @return {null | string} style name
	 */
	getComponentStyleName(state, componentName, styleId) {
		const componentType = styleId ? componentName : getBlockTypeExternal();
		const targetId = styleId ? styleId : componentName;
		return state.saved.styles?.[componentType]?.[targetId]?.title;
	},
	/**
	 * Get attributes of currently active block.
	 *
	 * @return {Object} block attributes
	 */
	getBlockAttributes() {
		return select('core/block-editor').getSelectedBlock().attributes;
	},
	/**
	 * Get block type.
	 *
	 * If block type is not overridden, it will return the block type of the currently active block in the editor.
	 *
	 * @param {Object} state store object
	 *
	 * @return {string} block type
	 */
	getBlockType(state) {
		const { currentBlockTypeOverride } = state.app;

		return currentBlockTypeOverride
			? currentBlockTypeOverride
			: select('core/block-editor').getSelectedBlock().name;
	},
	/**
	 * Get current active block id.
	 *
	 * @return {string} block id
	 */
	getBlockId() {
		return select('core/block-editor').getSelectedBlock()?.clientId;
	},
	/**
	 * Get all of available default styles for all blocks types.
	 *
	 * @param {Object} state store object
	 * @return {null | Object} default styles
	 */
	getDefaultStyles(state) {
		return state.saved.defaultStyles;
	},
	/**
	 * Get all rendered styles.
	 *
	 * @param {Object} state store object
	 * @return {Object} rendered styles
	 */
	getRenderedStyles(state) {
		return state.rendered;
	},
	/**
	 * Get callback function for render attribute preparation process.
	 *
	 * @param {Object} state store object
	 * @return {Function} render attribute preparation callback function
	 */
	getRenderAttributePreparationCallback(state) {
		return state.renderProps.attributeRenderPreparation;
	},
	/**
	 * Get callback function for render element preparation process.
	 *
	 * @param {Object} state store object
	 * @return {Function} render element preparation callback function
	 */
	getRenderElementPreparationCallback(state) {
		return state.renderProps.elementRenderPreparation;
	},
	/**
	 * Get parent block type for preview element.
	 *
	 * @param {Object} state store object
	 * @return {string} preview parent block type
	 */
	getRenderPreviewParentBlock(state) {
		return state.renderProps.previewParentBlock;
	},
	/**
	 * Get forced type of preview block type.
	 *
	 * @param {Object} state store object
	 * @return {string} preview block type
	 */
	getRenderPreviewBlockType(state) {
		return state.renderProps.previewBlockType;
	},
	/**
	 * Whether active block type is forced to be the block currently being worked on.
	 *
	 * @param {Object} state store object
	 * @return {string} preview parent block type
	 */
	isActiveBlockForRenderForced(state) {
		return state.renderProps.forceActiveBlockForRender;
	},
	/**
	 * Get status showing previews at listing enabled or not.
	 *
	 * @param {Object} state store object
	 * @return {boolean} show previews status
	 */
	isShowPreviewsEnabled(state) {
		return state.app.listing.showPreviews;
	},
	/**
	 * Get advanced controls' visibility status.
	 *
	 * @param {Object} state store object
	 * @return {boolean} advanced controls visibility status
	 */
	isAdvancedControlsVisible(state) {
		return state.app.advancedControlsVisible;
	},
	/**
	 * Get id of selected style.
	 *
	 * @param {Object} state store object
	 * @return {boolean|null} item id
	 */
	getSelectedItemId(state) {
		return state.app.listing.selectedItemId;
	},
	/**
	 * Get id of active style.
	 *
	 * @param {Object} state store object
	 * @return {boolean|null} item id
	 */
	getActiveItemId(state) {
		return state.app.activeItemId;
	},
	/**
	 * Get current editor page background color;
	 *
	 * @param {Object} state store object
	 * @return {string|null} color
	 */
	getPageBackgroundColor(state) {
		return state.app.pageBackgroundColor;
	},
	/**
	 * Get component type from given style id.
	 *
	 * @param {Object} state   store state object
	 * @param {string} styleId style id
	 *
	 * @return {null | string} component type
	 */
	getComponentTypeFromStyleId(state, styleId) {
		let componentType = null;

		if (state.saved.styles) {
			componentType = Object.keys(state.saved.styles)
				.filter((key) =>
					Object.prototype.hasOwnProperty.call(
						state.saved.styles,
						key
					)
				)
				.reduce((carry, cKey) => {
					const cStyles = Object.keys(
						state.saved.styles[cKey]
					).filter((sId) =>
						Object.prototype.hasOwnProperty.call(
							state.saved.styles[cKey],
							sId
						)
					);

					if (cStyles.includes(styleId)) {
						carry = cKey;
					}

					return carry;
				}, null);
		}

		return componentType;
	},
	/**
	 * Get cached block ids available at editor startup.
	 *
	 * @param {Object} state store state
	 */
	getStartupBlockIds(state) {
		return state.app.startupBlockIds;
	},
	/**
	 * Preview enabled status for block saved style preview renders.
	 *
	 * @param {Object} state store state
	 */
	isPreviewsEnabled(state) {
		return state.renderProps.previewsEnabled;
	},
	/**
	 * Get current block type override.
	 *
	 * @param {Object} state store state
	 * @return {string} current block type override
	 */
	getCurrentBlockTypeOverride(state) {
		return state.app.currentBlockTypeOverride;
	},
};

/**
 *
 * Get block type.
 *
 * This function is a helper for selectors inside select object itself where `getBlockType` is not reachable.
 *
 * @return {string} current block type
 */
function getBlockTypeExternal() {
	return select(SavedStylesManager.storeNamespace).getBlockType();
}

/**
 * Get default attributes at registry for current active block.
 *
 * `blockID` property will be omitted at returned value.
 *
 * @param {Object}   select              namespaced store select object
 * @param {Function} select.getBlockType get current block type
 * @return {Object} default attributes
 */
export const getDefaultBlockAttributes = ({ getBlockType }) => {
	// eslint-disable-next-line no-unused-vars
	const { blockID, ...rest } = createBlock(getBlockType()).attributes;

	return rest;
};

/**
 * Get default style for current component.
 *
 * @param {Object}   select                  namespaced store select object
 * @param {Function} select.getDefaultStyles get default block styles for all components
 * @param {Function} select.getBlockType     get current block type
 * @return {Object} default style for current component
 */
export const getComponentDefaultStyle = ({
	getDefaultStyles,
	getBlockType,
}) => {
	return getDefaultStyles()?.[getBlockType()];
};

/**
 * Get style ids related to supplied component.
 *
 * @param {Object}   namespacedSelect                         namespaced select object
 * @param {Function} namespacedSelect.getBlockType            get block type
 * @param {Function} namespacedSelect.getComponentSavedStyles get component related saved styles
 * @return {Array} component saved style ids
 */
export const getComponentSavedStyleIds = ({
	getBlockType,
	getComponentSavedStyles,
}) => {
	const componentStyles = getComponentSavedStyles(getBlockType());

	return Object.keys(componentStyles).filter((id) => {
		return Object.prototype.hasOwnProperty.call(componentStyles, id);
	});
};

/**
 * Get rendered preview for a block with given style id.
 *
 * @param {Object}   select                   store select object
 * @param {Function} select.getBlockType      get current block type
 * @param {Function} select.getRenderedStyles get rendered styles
 * @return {Function} middleware applied store select function
 */
export const getRenderedPreview =
	({ getBlockType, getRenderedStyles }) =>
	(styleId) => {
		return getRenderedStyles()?.[getBlockType()]?.[styleId];
	};

/**
 * @module selectors
 */
export default selectors;
