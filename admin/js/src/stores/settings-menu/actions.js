import { getAjaxInfo } from "$Stores/settings-menu/slices/assets";

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
