/*
 * Operations that are queued before registration of blocks.
 *
 * This file will include mainly features that will support block functionality.
 */
import { FrontendDataManager } from '$Library/ub-common/Inc';
import MainStore from '$BlockStores/mainStore';
import ProManager from '$Manager/ProManager';

// initialize frontend data manager
FrontendDataManager.init('ubEditorClientData');

// initialize main plugin store
MainStore.init('ub/main');

// initialize pro manager
ProManager.init();
