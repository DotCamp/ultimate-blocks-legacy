// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import ToggleControl from "$Components/ToggleControl";
import MenuButton from "$Components/MenuButton";
import withIcon from "$HOC/withIcon";
import { getBlockInfoShowStatus } from "$Stores/settings-menu/slices/app";
import withStore from "$HOC/withStore";

/**
 * Menu block control component.
 *
 * This control will be used for both enabling/disabling blocks and showing info about them.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {String} props.title block title
 * @param {String} props.blockId registry id of block
 * @param {Boolean} props.status block status
 * @param {HTMLElement} props.iconElement icon element, will be supplied via HOC
 * @param {Function} props.onStatusChange callback for status change event
 * @param {Array} props.info information about block and its usage
 * @param {Boolean} props.blockInfoShowStatus block info show status, will be supplied via HOC
 *
 */
function BlockControl( { title, blockId, status, iconElement, onStatusChange, info, blockInfoShowStatus } ) {
	const initialRender = useRef( true );
	const initialAnimation = useRef( true );

	const [ innerStatus, setInnerStatus ] = useState( status === undefined ? false : status );
	const [ blockStyle, setBlockStyle ] = useState( {} );
	const [ headerHeight, setHeaderHeight ] = useState( 0 );

	const headerRef = useRef();
	useEffect( () => {
		const { height } = headerRef.current.getBoundingClientRect();
		setHeaderHeight( height );
	}, [] );

	useEffect( () => {
		setBlockStyle( {
			height: blockInfoShowStatus ? '' : `${ headerHeight }px`,
		} );
	}, [ headerHeight ] );

	useEffect( () => {
		setBlockStyle( {
			height: blockInfoShowStatus ? '' : `${ headerHeight }px`,
		} );

		return () => {
			if ( blockInfoShowStatus !== undefined ) {
				initialAnimation.current = false;
			}
		};
	}, [ blockInfoShowStatus ] );

	useEffect( () => {
		if ( initialRender.current ) {
			initialRender.current = false;
		} else {
			onStatusChange( blockId, innerStatus );
		}
	}, [ innerStatus ] );

	const howToUse = null;

	/**
	 * Main visibility calculation for how to use button.
	 * @return {boolean} visibility status
	 */
	const howToUseVisibility = () => {
		return howToUse !== null;
	};

	return (
		<div style={ blockStyle } className={ 'block-control' } data-enabled={ JSON.stringify( innerStatus ) } data-initial-animation={ JSON.stringify( initialAnimation.current ) }>
			<div ref={ headerRef } className={ 'block-title' }>
				<div className={ 'block-title-left-container' }>
					<div className={ 'title-icon' }>
						{
							iconElement
						}
					</div>
					{ title }
				</div>
				<div className={ 'block-title-right-container' }>
					<ToggleControl onStatusChange={ setInnerStatus } status={ innerStatus } />
				</div>
			</div>
			<div className={ 'block-info' }>
				{
					info.map( ( infoLine, index ) => {
						return ( <div className={ 'info-line' } key={ index }>
							{ infoLine[ 0 ].toUpperCase() + Array.from( infoLine ).splice( 1 ).join( '' ) }
						</div> );
					} )
				}
			</div>
			{
				howToUseVisibility() && (
					<div className={ 'block-howto' }>
						<MenuButton title={ 'How to Use' } status={ howToUse !== null && innerStatus }
							onClickHandler={ howToUse } />
					</div>
				)
			}
		</div>
	);
}

const selectMapping = ( select ) => {
	return {
		blockInfoShowStatus: select( getBlockInfoShowStatus ),
	};
};

/**
 * @module BlockControl
 */
export default withStore( withIcon( BlockControl ), selectMapping );
