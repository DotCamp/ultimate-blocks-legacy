import React, { useEffect, useState } from 'react';
import { getContentData } from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';
import BoxContent from '$Components/BoxContent/BoxContent';
import ContentNotFoundError from '$AdminInc/err/ContentNotFoundError';

/**
 * Box content provider component.
 * Any BoxContent component property can be passed to this component. All will be reflected to generated one.
 * Passing content related property will make this absolutely useless since it will be overwritten by fetched data.
 *
 * This component will fetch given data id from store and generate BoxContent component based on it.
 *
 * @param {Object} props           component properties
 * @param {string} props.contentId content id
 */
function BoxContentProvider( props ) {
	const [ contentTitle, setTitle ] = useState( null );
	const [ mainContent, setContent ] = useState( null );
	const [ rest, setRest ] = useState( {} );

	/**
	 * useEffect hook.
	 */
	useEffect( () => {
		const { contentId, getCData, ...dataRest } = props;

		if ( contentId ) {
			const cData = getCData( contentId );

			if ( cData ) {
				const { title, content } = cData;
				setTitle( title );
				setContent( content );
				setRest( dataRest );
			} else {
				throw new ContentNotFoundError( contentId );
			}
		}
	}, [] );

	return (
		<BoxContent { ...rest } title={ contentTitle } content={ mainContent }>
			{ props.children }
		</BoxContent>
	);
}

// store select mapping
const selectMapping = ( selector ) => {
	return {
		getCData: selector( getContentData ),
	};
};

/**
 * @module BoxContentProvider
 */
export default withStore( BoxContentProvider, selectMapping );
