import {select, dispatch} from '@wordpress/data';
import {
	ManagerBase,
	FrontendDataManager,
	HookManager,
	hookTypes,
} from '$Library/ub-common/Inc';
import SavedStylesStore from '$BlockStores/savedStyles';

/**
 * Saved styles manager for frontend.
 *
 * Depends on initializations of:
 * - FrontendDataManager
 */
class SavedStylesManager extends ManagerBase {
	/**
	 * Store object
	 *
	 * @type {null | Object}
	 */
	#store = null;

	/**
	 * Store namespace.
	 *
	 * @type {string}
	 */
	storeNamespace = 'ub/saved-styles-base';

	/**
	 * Create persistent state object.
	 *
	 * @private
	 * @return {Object} persistent state
	 */
	#preparePersistentState() {
		let savedStylesData =
			FrontendDataManager.getDataProperty('savedStyles');

		// in order to get various block info (icon, name, description, etc), we register our blocks on settings page too, but since no style data will be shared with that script, we need to check and overwrite this data here to not break settings page functionality
		if (!savedStylesData) {
			savedStylesData = {
				saved: {},
			};
		}

		if (savedStylesData.saved.styles) {
			savedStylesData.saved.styles = JSON.parse(
				atob(savedStylesData.saved.styles)
			);
		} else {
			savedStylesData.saved.styles = {};
		}

		if (Array.isArray(savedStylesData.saved.styles)) {
			savedStylesData.saved.styles = {};
		}

		// eslint-disable-next-line array-callback-return
		Object.keys(savedStylesData.saved.styles).map((blockType) => {
			if (
				Object.prototype.hasOwnProperty.call(
					savedStylesData.saved.styles,
					blockType
				)
			) {
				if (Array.isArray(savedStylesData.saved.styles[blockType])) {
					savedStylesData.saved.styles[blockType] = {};
				}
			}
		});

		if (savedStylesData.saved.defaultStyles) {
			savedStylesData.saved.defaultStyles = JSON.parse(
				atob(savedStylesData.saved.defaultStyles)
			);
		} else {
			savedStylesData.saved.defaultStyles = {};
		}

		return {...savedStylesData};
	}

	/**
	 * Saved styles manager initialization manager.
	 */
	_initLogic() {
		const persistentState = this.#preparePersistentState();
		this.#registerStore(persistentState);

		window.onload = () => {
			this.#cacheStartupBlockIds();
		};

		HookManager.addFilter(
			hookTypes.filters.ADD_SUB_COMPONENT,
			'savedStylesManagerSubComponentAdd',
			(defaultProps) => {
				return {...defaultProps, applyDefaultStyle: true};
			}
		);
	}

	/**
	 * Find blocks belonging to ultimate blocks and cache their ids.
	 */
	#cacheStartupBlockIds() {
		const blocksOnEditor = select('core/block-editor').getBlocks();

		const ubBlockIds = blocksOnEditor.reduce((carry, blockProps) => {
			if (blockProps.name.startsWith('ub/')) {
				carry.push(blockProps.clientId);
			}

			return carry;
		}, []);

		// cache blocks ids to store
		dispatch(this.storeNamespace).setStartupBlockIds(ubBlockIds);
	}

	/**
	 * Register manager store to centralized data registry.
	 *
	 * @private
	 * @param {Object} storeState store state
	 */
	#registerStore(storeState) {
		this.#store = new SavedStylesStore(this.storeNamespace);
		this.#store.registerStore(storeState);
	}
}

/**
 * @module SavedStylesManager
 */
export default new SavedStylesManager();
