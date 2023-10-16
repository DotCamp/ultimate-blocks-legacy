// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import ToggleControl from '$Components/ToggleControl';
import withIcon from '$HOC/withIcon';
import {
	getProStatus,
	showProBlockUpsellModal,
} from '$Stores/settings-menu/slices/app';
import withStore from '$HOC/withStore';
import ProBlockCardTitle from '$Components/ProBlockCardTitle';
import BlockCardProInfoControl from '$Components/BlockCardProInfoControl';

/**
 * Menu block control component.
 *
 * This control will be used for both enabling/disabling blocks and showing info about them.
 *
 * @class
 *
 * @param {Object}      props                component properties
 * @param {string}      props.title          block title
 * @param {string}      props.blockId        registry id of block
 * @param {boolean}     props.status         block status
 * @param {HTMLElement} props.iconElement    icon element, will be supplied via HOC
 * @param {Function}    props.onStatusChange callback for status change event
 * @param {boolean}     props.proBlock       block belongs to pro version
 * @param {boolean}     props.proStatus      plugin pro status, will be supplied via HOC
 * @param {Function}    props.showUpsell     set target block type for modal interface, will be supplied via HOC
 */
function BlockControlCard( {
	title,
	blockId,
	status,
	iconElement,
	onStatusChange,
	proBlock,
	proStatus,
	showUpsell,
} ) {
	const initialRender = useRef( true );
	const initialAnimation = useRef( true );

	const [ innerStatus, setInnerStatus ] = useState(
		status === undefined ? false : status
	);

	/* useEffect block */

	useEffect( () => {
		if ( proBlock && ! proStatus ) {
			setInnerStatus( false );
		}
	}, [ innerStatus ] );

	useEffect( () => {
		if ( initialRender.current ) {
			initialRender.current = false;
		} else {
			onStatusChange( blockId, innerStatus );
		}
	}, [ innerStatus ] );

	/* useEffect block end */

	return (
		<div
			className={ 'block-control' }
			data-enabled={ JSON.stringify( innerStatus ) }
			data-initial-animation={ JSON.stringify(
				initialAnimation.current
			) }
		>
			<div className={ 'block-title' }>
				<div className={ 'block-title-left-container' }>
					<div className={ 'title-icon' }>{ iconElement }</div>
					<div className={ 'title-text' }>
						{ title }
						<ProBlockCardTitle isPro={ proBlock } />
					</div>
					<div className={ 'title-demo' }>See Demo</div>
				</div>
				<div className={ 'block-title-right-container' }>
					{ proBlock && ! proStatus ? (
						<BlockCardProInfoControl
							handleClick={ ( e ) => {
								e.preventDefault();
								showUpsell( blockId );
							} }
						/>
					) : (
						<ToggleControl
							onStatusChange={ setInnerStatus }
							status={ innerStatus }
							disabled={ proBlock && ! proStatus }
						/>
					) }
				</div>
			</div>
		</div>
	);
}

const selectMapping = ( select ) => {
	return {
		proStatus: select( getProStatus ),
	};
};

const actionMapping = () => {
	return { showUpsell: showProBlockUpsellModal };
};

/**
 * @module BlockControl
 */
export default withStore(
	withIcon( BlockControlCard ),
	selectMapping,
	actionMapping
);
