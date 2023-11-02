import React, { useEffect, useState } from 'react';

/**
 * Extensions content component.
 */
function ExtensionsContent() {
	const [ opacityMap, setOpacityMap ] = useState( [ false, false, false ] );
	let currentIndex = 0;

	/**
	 * useEffect hook.
	 */
	useEffect( () => {
		setInterval( () => {
			opacityMap[ currentIndex ] = ! opacityMap[ currentIndex ];
			setOpacityMap( [ ...opacityMap ] );
			currentIndex = ( currentIndex + 1 ) % opacityMap.length;
		}, 200 );
	}, [] );

	return (
		<div className="ub-extensions-content">
			<span className={ 'soon' }>
				Coming soon
				{ opacityMap.map( ( dataVal, index ) => {
					return (
						<span
							key={ index }
							data-opacity={ dataVal }
							className={ 'just-a-dot' }
						>
							.
						</span>
					);
				} ) }
			</span>
		</div>
	);
}

/**
 * @module ExtensionsContent
 */
export default ExtensionsContent;
