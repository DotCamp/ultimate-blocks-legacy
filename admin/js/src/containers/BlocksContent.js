import React from 'react';
import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import {
	BoxContentAlign,
	BoxContentLayout,
	BoxContentSize,
} from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import UpgradeBoxContent from '$Components/UpgradeBoxContent';
import BlockControlsContainer from '$Components/BlockControlsContainer';

/**
 * Blocks content.
 *
 * @class
 */
function BlocksContent() {
	return (
		<div className="ub-blocks-content">
			<BoxContentProvider
				layout={ BoxContentLayout.HORIZONTAL }
				contentId={ 'globalControl' }
				size={ BoxContentSize.JUMBO }
			>
				<ButtonLink
					onClickHandler={ () => {} }
					type={ ButtonLinkType.DEFAULT }
					title={ __( 'Activate All' ) }
				/>
				<ButtonLink
					onClickHandler={ () => {} }
					type={ ButtonLinkType.DEFAULT }
					title={ __( 'Deactivate All' ) }
				/>
			</BoxContentProvider>
			<BlockControlsContainer />
			<UpgradeBoxContent alignment={ BoxContentAlign.CENTER } />
		</div>
	);
}

/**
 * @module BlocksContent
 */
export default BlocksContent;
