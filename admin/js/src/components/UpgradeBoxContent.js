import React from 'react';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';

/**
 * Box content for upgrade.
 *
 * @param {Object} props component properties, will be reflected to BoxContentProvider
 * @class
 */
function UpgradeBoxContent( props ) {
	return (
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
	);
}

/**
 * @module UpgradeBoxContent
 */
export default UpgradeBoxContent;
