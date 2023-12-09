import { getAjaxInfo } from '$Stores/settings-menu/slices/assets';
import { ajaxInfo } from '$Stores/settings-menu/slices/versionControl';

/**
 * Toggle extension status.
 *
 * @param {Function} dispatch store action dispatch function
 * @param {Function} getState store state selection function
 * @return {Function} action function
 */
export const toggleExtensionStatus =
	(dispatch, getState) => (extensionId, status) => {
		const { toggleExtensionStatus: ajaxInfoSub } = getAjaxInfo(getState());
		const { url, action, nonce } = ajaxInfoSub;

		if (!Array.isArray(extensionId)) {
			extensionId = [extensionId];
		}

		const formData = new FormData();

		extensionId.map((eId) => formData.append('extension_name[]', eId));

		formData.append('enable', JSON.stringify(status));
		formData.append('action', action);
		formData.append('_wpnonce', nonce);

		fetch(url, {
			method: 'POST',
			body: formData,
		});
	};
/**
 * Toggle block status.
 *
 * @param {Function} dispatch store action dispatch function
 * @param {Function} getState store state selection function
 * @return {Function} action function
 */
export const toggleBlockStatus = (dispatch, getState) => (blockId, status) => {
	const { toggleStatus: ajaxInfoSub } = getAjaxInfo(getState());
	const { url, action, nonce } = ajaxInfoSub;

	if (!Array.isArray(blockId)) {
		blockId = [blockId];
	}

	const formData = new FormData();

	blockId.map((bId) => formData.append('block_name[]', bId));

	formData.append('enable', JSON.stringify(status));
	formData.append('action', action);
	formData.append('_wpnonce', nonce);

	fetch(url, {
		method: 'POST',
		body: formData,
	});
};

/**
 * Rollback plugin version.
 *
 * @param {Function} dispatch store action dispatch function
 * @param {Function} getState store state selection function
 * @return {Function} action function
 */
export const rollbackToVersion = (dispatch, getState) => (version) => {
	const { url, action, nonce } = ajaxInfo(getState()).versionRollback;

	const formData = new FormData();
	formData.append('action', action);
	formData.append('nonce', nonce);
	formData.append('version', version);

	return fetch(url, {
		method: 'POST',
		body: formData,
	})
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			if (data.error) {
				throw new Error(data.error);
			}

			return data;
		});
};
