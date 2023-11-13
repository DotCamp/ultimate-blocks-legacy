import React, { useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import withStore from '$HOC/withStore';
import { getLogo } from '$Stores/settings-menu/slices/assets';
import RightContainerItem from '$Components/RightContainerItem';
import VersionControl from '$Components/VersionControl';
import Navigation from '$Components/Navigation';
import { routeObjects } from '$AdminInc/routes';
import {
	getCurrentRoutePath,
	setCurrentRoutePath,
} from '$Stores/settings-menu/slices/app';
import HamburgerMenu from '$Components/HamburgerMenu';
import AssetProvider from '$Components/AssetProvider';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import ProFilter from '$Components/ProFilter';

/**
 * Settings menu header element.
 *
 * @param {Object}   props                  component properties
 * @param {string}   props.logoUrl          plugin logo url, will be supplied via HOC
 * @param {string}   props.currentRoutePath current route path, will be supplied via HOC
 * @param {Function} props.setRoute         set route path, will be supplied via HOC
 * @return {JSX.Element} component
 */
function MenuHeader({ logoUrl, currentRoutePath, setRoute }) {
	// status of hamburger menu
	const [menuStatus, setMenuStatus] = useState(false);

	const routeObjectsMinus404 = useMemo(
		() => routeObjects.slice(0, routeObjects.length - 1),
		[]
	);

	return (
		<div className={'header-wrapper'}>
			<div className={'menu-header'}>
				<div className={'left-container'}>
					<div className={'logo-container'}>
						<img alt={'plugin logo'} src={logoUrl} />
						<div className={'ub-plugin-logo-text'}>
							Ultimate Blocks
						</div>
					</div>
				</div>
				<div className={'ub-menu-navigation-wrapper'}>
					<Navigation
						routes={routeObjectsMinus404}
						currentRoutePath={currentRoutePath}
						setRoute={setRoute}
					/>
				</div>
				<div className={'right-container'}>
					<RightContainerItem>
						<div className={'version-control-header-wrapper'}>
							<VersionControl />
						</div>
						<ProFilter>
							<AssetProvider assetIds={['proBuyUrl']}>
								{({ proBuyUrl }) => (
									<ButtonLink
										url={proBuyUrl}
										title={__(
											'Upgrade to PRO',
											'ultimate-blocks'
										)}
										type={ButtonLinkType.DEFAULT}
									/>
								)}
							</AssetProvider>
						</ProFilter>
					</RightContainerItem>
				</div>
				<HamburgerMenu
					clickHandler={() => setMenuStatus(!menuStatus)}
					status={menuStatus}
				/>
			</div>
			<div
				className={'dropdown-navigation'}
				data-menu-status={menuStatus}
			>
				<div className={'dropdown-drawer'}>
					<Navigation
						routes={routeObjectsMinus404}
						currentRoutePath={currentRoutePath}
						setRoute={setRoute}
					/>
					<div className={'hamburger-version-control'}>
						<VersionControl />
					</div>
				</div>
			</div>
		</div>
	);
}

// store select mapping
const selectMapping = (select) => {
	return {
		logoUrl: select(getLogo),
		currentRoutePath: select(getCurrentRoutePath),
	};
};

// store action mapping
const actionMapping = () => ({
	setRoute: setCurrentRoutePath,
});

/**
 * @module MenuHeader
 */
export default withStore(MenuHeader, selectMapping, actionMapping);
