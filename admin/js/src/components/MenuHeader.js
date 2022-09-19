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
 * @function Object() { [native code] }
 */
function MenuHeader({ logoUrl, toggleShowInfoStatus, blockInfoShowStatus }) {
	return (
		<div className={'menu-header'}>
			<div className={'logo-container'}>
				<img alt={'plugin logo'} src={logoUrl} />
			</div>
			<div className={'right-container'}>
				<RightContainerItem>
					<VersionControl />
				</RightContainerItem>
				<RightContainerItem>
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
					<div
						onClick={toggleShowInfoStatus}
						className={'blog-info-toggle'}
						data-light-it-up={JSON.stringify(!blockInfoShowStatus)}
					>
						<FontAwesomeIcon icon="fa-solid fa-lightbulb" />
					</div>
				</RightContainerItem>
			</div>
		</div>
	);
}

const selectMapping = (select) => {
	return {
		logoUrl: select(getLogo),
		blockInfoShowStatus: select(getBlockInfoShowStatus),
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
export default withStore(MenuHeader, selectMapping, actionMapping);
