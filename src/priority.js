// register main plugin store
import MainStore from '$BlockStores/mainStore';
import UpsellManager from '$Inc/UpsellManager';

// initialize main plugin store
MainStore.init('ub/main');

const proStatus = MainStore.select().getProStatus();
if (!proStatus) {
	// only initialize upsell manager if pro version is not available
	UpsellManager.init();
}
