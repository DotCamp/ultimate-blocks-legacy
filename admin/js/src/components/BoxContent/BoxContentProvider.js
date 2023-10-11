import React, { useEffect, useState } from 'react';
import { getContentData } from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';
import BoxContent from '$Components/BoxContent/BoxContent';
import ContentNotFoundError from '$AdminInc/err/ContentNotFoundError';

/**
 * Box content provider component.
 *
 * This component will fetch given data id from store and generate BoxContent component based on it.
 *
 * @param {Object}   props                component properties
 * @param {string}   props.contentId      content id
 * @param {Function} props.getContentData get content data, will be supplied via HOC
 * @param {Function} props.children       component children, will be reflected to BoxContent component
 */
function BoxContentProvider( props ) {
	const [ contentTitle, setTitle ] = useState( null );
	const [ mainContent, setContent ] = useState( null );
	const [ rest, setRest ] = useState( {} );

	/**
	 * useEffect hook.
	 */
	useEffect( () => {
		const { contentId } = props;

		if ( contentId ) {
			const cData = getContentData( contentId );

			if ( cData ) {
				const { title, content, ...dataRest } = cData;
				setTitle( title );
				setContent( content );
				setRest( dataRest );
			}

			throw new ContentNotFoundError( contentId );
		}
	}, [] );

	return (
		<BoxContent title={ contentTitle } content={ mainContent } { ...rest }>
			{ props.children }
		</BoxContent>
	);
}

// store select mapping
const selectMapping = ( selector ) => {
	return {
		getContentData: selector( getContentData ),
	};
};

/**
 * @module BoxContentProvider
 */
export default withStore( BoxContentProvider, selectMapping );
