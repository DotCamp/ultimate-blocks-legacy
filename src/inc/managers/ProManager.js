import { ManagerBase } from '$Library/ub-common/Inc';
import MainStore from '$BlockStores/mainStore';
import UpsellManager from '$Inc/managers/UpsellManager';

/**
 * Manager for handling pro features of plugin on editor side.
 *
 * Depends on:
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
		}
	}
}

/**
 * @module ProManager
 */
export default new ProManager();
