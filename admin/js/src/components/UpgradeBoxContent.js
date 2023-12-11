import React from 'react';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import ProFilter from '$Components/ProFilter';
import AssetProvider from '$Components/AssetProvider';

/**
 * Box content for upgrade.
 *
 * @param {Object} props component properties, will be reflected to BoxContentProvider
 * @class
 */
function UpgradeBoxContent(props) {
	return (
		<AssetProvider assetIds={['proBuyUrl']}>
			{({ proBuyUrl }) => (
				<ProFilter invert={true}>
					<BoxContentProvider
						size={BoxContentSize.JUMBO}
						contentId={'upgrade'}
						{...props}
					>
						<ButtonLink
							url={proBuyUrl}
							title={'GET ULTIMATE BLOCKS PRO'}
							type={ButtonLinkType.PRIMARY}
						/>
					</BoxContentProvider>
				</ProFilter>
			)}
		</AssetProvider>
	);
}

/**
 * @module UpgradeBoxContent
 */
export default UpgradeBoxContent;
