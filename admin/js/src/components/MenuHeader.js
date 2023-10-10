// eslint-disable-next-line no-unused-vars
import React from 'react';
import withStore from '$HOC/withStore';
import { getLogo } from '$Stores/settings-menu/slices/assets';
import RightContainerItem from '$Components/RightContainerItem';
import VersionControl from '$Components/VersionControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navigation from '$Components/Navigation';
import { routeObjects } from '$AdminInc/routes';

/**
 * Settings menu header element.
 *
 * @param {Object} props         component properties
 * @param {string} props.logoUrl plugin logo url, will be supplied via HOC
 * @return {JSX.Element} component
 */
function MenuHeader( { logoUrl } ) {
	const routeObjectsMinus404 = routeObjects.slice(
		0,
		routeObjects.length - 1
	);

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
			<Navigation routes={ routeObjectsMinus404 } />
			<div className={ 'right-container' }>
				<RightContainerItem>
					<VersionControl />
				</RightContainerItem>
				<RightContainerItem classNames={ [ 'share-node' ] }>
					<FontAwesomeIcon icon="fa-solid fa-share-nodes" />
				</RightContainerItem>
			</div>
		</div>
	);
}

const selectMapping = ( select ) => {
	return {
		logoUrl: select( getLogo ),
	};
};

/**
 * @module MenuHeader
 */
export default withStore( MenuHeader, selectMapping );
