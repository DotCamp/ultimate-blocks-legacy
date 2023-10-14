import React from 'react';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import ProFilter from '$Components/ProFilter';

/**
 * Box content for upgrade.
 *
 * @param {Object} props component properties, will be reflected to BoxContentProvider
 * @class
 */
function UpgradeBoxContent( props ) {
	return (
		<ProFilter invert={ true }>
			<BoxContentProvider
				size={ BoxContentSize.JUMBO }
				contentId={ 'upgrade' }
				{ ...props }
			>
				<ButtonLink
					url={ 'https://ultimateblocks.com' }
					title={ 'GET ULTIMATE BLOCKS PRO' }
					type={ ButtonLinkType.PRIMARY }
				/>
			</BoxContentProvider>
		</ProFilter>
	);
}

/**
 * @module UpgradeBoxContent
 */
export default UpgradeBoxContent;
