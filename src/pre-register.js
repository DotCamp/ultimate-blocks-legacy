/*
 * Operations that are queued before registration of blocks.
 *
 * This file will include mainly features that will support block functionality.
 */
import { FrontendDataManager } from '$Library/ub-common/Inc';
import MainStore from '$BlockStores/mainStore';
import UpsellManager from '$Inc/managers/UpsellManager';

// initialize frontend data manager
FrontendDataManager.init('ubEditorClientData');

// initialize main plugin store
MainStore.init('ub/main');

const proStatus = MainStore.select().getProStatus();
if (!proStatus) {
	// only initialize upsell manager if pro version is not available
	UpsellManager.init();
	UpsellManager.addDummyInspectorControls();
}
