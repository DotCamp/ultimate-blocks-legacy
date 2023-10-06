// eslint-disable-next-line no-unused-vars
import React from 'react';
import withStore from '$HOC/withStore';
import { getLogo } from '$Stores/settings-menu/slices/assets';
import {
	toggleShowBlockInfo,
	getBlockInfoShowStatus,
} from '$Stores/settings-menu/slices/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RightContainerItem from '$Components/RightContainerItem';
import VersionControl from '$Components/VersionControl';

/**
 * Settings menu header element.
 *
 * @param {Object}   props                      component properties
 * @param {string}   props.logoUrl              plugin logo url, will be supplied via HOC
 * @param {Function} props.toggleShowInfoStatus toggle showing block controls info, will be supplied via HOC
 * @param {boolean}  props.blockInfoShowStatus  status of showing extra block information, will be supplied via HOC
 * @return {JSX.Element} component
 */
function MenuHeader( { logoUrl, toggleShowInfoStatus, blockInfoShowStatus } ) {
	return (
		<div className={ 'menu-header' }>
			<div className={ 'left-container' }>
				<div className={ 'logo-container' }>
					<img alt={ 'plugin logo' } src={ logoUrl } />
					<div className={ 'ub-plugin-logo-text' }>
						Ultimate Blocks
					</div>
				</div>
			</div>
			<div className={ 'right-container' }>
				<RightContainerItem>
					<VersionControl />
				</RightContainerItem>
			</div>
		</div>
	);
}

const selectMapping = ( select ) => {
	return {
		logoUrl: select( getLogo ),
		blockInfoShowStatus: select( getBlockInfoShowStatus ),
	};
};

const actionMapping = () => {
	return {
		toggleShowInfoStatus: toggleShowBlockInfo,
	};
};

/**
 * @module MenuHeader
 */
export default withStore( MenuHeader, selectMapping, actionMapping );
