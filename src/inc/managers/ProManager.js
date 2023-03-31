import { ManagerBase, registerPreviewManager } from '$Library/ub-common/Inc';
import MainStore from '$BlockStores/mainStore';
import UpsellManager from '$Manager/UpsellManager';
import SavedStylesManager from '$Manager/SavedStylesManager';

/**
 * Manager for handling pro features of plugin on editor side.
 *
 * Depends on initializations of:
 * - MainStore
 */
class ProManager extends ManagerBase {
	/**
	 * Get plugin pro status.
	 *
	 * @return {boolean} status
	 */
	proStatus() {
		return MainStore.select().getProStatus();
	}

	/**
	 * Pro manager initialization logic.
	 *
	 * @private
	 */
	_initLogic() {
		if (!this.proStatus()) {
			// initialize upsell manager
			UpsellManager.init();
			UpsellManager.addDummyInspectorControls();

			// register preview manager block
			registerPreviewManager();

			// initialize saved styles manager
			SavedStylesManager.init();
		}
	}
}

/**
 * @module ProManager
 */
export default new ProManager();
