import createStoreState from '$BlockStores/savedStyles/state';
import types from '$BlockStores/savedStyles/types';

/**
 * Store reducers.
 *
 * @param {Object} [extraState={}] extra state object
 * @return {Function} reducer function
 */
const reducer = (extraState = {}) => {
	const DEFAULT_STATE = createStoreState(extraState);

	return (storeState = DEFAULT_STATE, action) => {
		switch (action.type) {
			case types.SET_BUSY_STATE:
				return {
					...storeState,
					app: {
						...storeState.app,
						busy: action.status,
					},
				};
			case types.SAVE_ALL_BLOCK_STYLES:
				const updatedSaved = {
					...storeState.saved,
					styles: action.styles,
				};
				return {
					...storeState,
					saved: updatedSaved,
				};
			case types.UPDATE_STYLE:
				return (() => {
					const { blockType, styleId, styleObject } = action;
					const updatedSavedStyles = {
						...storeState.saved.styles,
						[blockType]: {
							...storeState.saved.styles[blockType],
							[styleId]: {
								...storeState.saved.styles[blockType][styleId],
								styles: styleObject,
							},
						},
					};

					return {
						...storeState,
						saved: {
							...storeState.saved,
							styles: updatedSavedStyles,
						},
					};
				})();
			case types.SET_STYLE_DEFAULT:
				return (() => {
					const { blockType, styleId } = action;

					return {
						...storeState,
						saved: {
							...storeState.saved,
							defaultStyles: {
								...storeState.saved.defaultStyles,
								[blockType]: styleId,
							},
						},
					};
				})();
			case types.CACHE_BLOCK_PREVIEW:
				const { blockType, styleId, html } = action;

				if (!storeState.rendered[blockType]) {
					storeState.rendered[blockType] = {};
				}

				const updatedBlockPreviews = {
					...storeState.rendered[blockType],
					[styleId]: html,
				};

				return {
					...storeState,
					rendered: {
						...storeState.rendered,
						[blockType]: updatedBlockPreviews,
					},
				};
			case types.SET_ATTRIBUTE_RENDER_PREPARATION:
				return (() => {
					const { callback } = action;

					return {
						...storeState,
						renderProps: {
							...storeState.renderProps,
							attributeRenderPreparation: callback,
						},
					};
				})();
			case types.SET_ELEMENT_RENDER_PREPARATION:
				const { callback } = action;

				return {
					...storeState,
					renderProps: {
						...storeState.renderProps,
						elementRenderPreparation: callback,
					},
				};
			case types.SET_PREVIEW_PARENT_BLOCK:
				return (() => {
					let { parentBlockType } = action;
					if (parentBlockType === null) {
						parentBlockType = 'ub/preview-provider';
					}

					return {
						...storeState,
						renderProps: {
							...storeState.renderProps,
							previewParentBlock: parentBlockType,
						},
					};
				})();
			case types.SET_PREVIEW_BLOCK_TYPE:
				return (() => {
					const { blockType } = action;

					return {
						...storeState,
						renderProps: {
							...storeState.renderProps,
							previewBlockType: blockType,
						},
					};
				})();
			case types.SET_SHOW_PREVIEWS:
				return (() => {
					const { status } = action;

					return {
						...storeState,
						app: {
							...storeState.app,
							listing: {
								...storeState.app.listing,
								showPreviews: status,
							},
						},
					};
				})();
			case types.SET_ADVANCED_CONTROLS_VISIBILITY:
				const { status } = action;

				return {
					...storeState,
					app: {
						...storeState.app,
						advancedControlsVisible: status,
					},
				};
			case types.SET_SELECTED_ITEM_ID:
				return (() => {
					const { id } = action;

					return {
						...storeState,
						app: {
							...storeState.app,
							listing: {
								...storeState.app.listing,
								selectedItemId: id,
							},
						},
					};
				})();
			case types.SET_ACTIVE_ITEM_ID:
				return (() => {
					const { id } = action;

					return {
						...storeState,
						app: {
							...storeState.app,
							activeItemId: id,
						},
					};
				})();
			case types.SET_PAGE_BACKGROUND_COLOR:
				const { pageColor } = action;
				storeState.app.pageBackgroundColor = pageColor;
				return storeState;
			case types.UPDATE_STYLE_TITLE:
				return (() => {
					const { id, title, blockType } = action;

					if (
						storeState.saved.styles &&
						storeState.saved.styles[blockType] &&
						storeState.saved.styles[blockType][id]
					) {
						const targetBlockStyles = {
							...storeState.saved.styles[blockType],
						};

						targetBlockStyles[id].title = title;

						const updatedBlockStyles = {
							...storeState.saved.styles,
							[blockType]: targetBlockStyles,
						};

						return {
							...storeState,
							saved: {
								...storeState.saved,
								styles: updatedBlockStyles,
							},
						};
					}
					return storeState;
				})();
			case types.SET_STARTUP_BLOCK_IDS:
				return (() => {
					const { blockIds } = action;
					return {
						...storeState,
						app: {
							...storeState.app,
							startupBlockIds: blockIds,
						},
					};
				})();
			case types.SET_PREVIEW_ENABLED_STATUS:
				return (() => {
					const { status } = action;

					return {
						...storeState,
						renderProps: {
							...storeState.renderProps,
							previewsEnabled: status,
						},
					};
				})();
			case types.SET_CURRENT_BLOCK_TYPE_OVERRIDE:
				return (() => {
					const { blockType } = action;

					return {
						...storeState,
						app: {
							...storeState.app,
							currentBlockTypeOverride: blockType,
						},
					};
				})();
		}

		return storeState;
	};
};

/**
 * @module reducer
 */
export default reducer;
