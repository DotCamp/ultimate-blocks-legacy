import { getAjaxInfo } from "$Stores/settings-menu/slices/assets";
import { ajaxInfo } from "$Stores/settings-menu/slices/versionControl";
import { __ } from "@wordpress/i18n";

/**
 * Toggle block status.
 * @param {Function} dispatch store action dispatch function
 * @param {Function} getState store state selection function
 * @return {Function} action function
 */
export const toggleBlockStatus = ( dispatch, getState ) => ( blockId, status ) => {
	const { toggleStatus: ajaxInfo } = getAjaxInfo( getState() );
	const { url, action, nonce } = ajaxInfo;

	const formData = new FormData();
	formData.append( 'block_name', blockId );
	formData.append( 'enable', JSON.stringify( status ) );
	formData.append( 'action', action );
	formData.append( '_wpnonce', nonce );

	fetch( url, {
		method: 'POST',
		body: formData,
	} );
};

/**
 * Rollback plugin version.
 * @param {Function} dispatch store action dispatch function
 * @param {Function} getState store state selection function
 * @return {Function} action function
 */
export const rollbackToVersion = ( dispatch, getState ) => ( version ) => {
	const { url, action, nonce } = ajaxInfo( getState() ).versionRollback;

	const formData = new FormData();
	formData.append( 'action', action );
	formData.append( 'nonce', nonce );
	formData.append( 'version', version );

	return fetch( url, {
		method: 'POST',
		body: formData,
	} ).then( resp => {
		return resp.json();
	} ).then( data => {
		if ( data.error ) {
			throw new Error( data.error );
		}

		return data;
	} );
};
