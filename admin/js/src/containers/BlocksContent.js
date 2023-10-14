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
			<div>
				<i>blocks control</i>
			</div>
			<UpgradeBoxContent alignment={ BoxContentAlign.CENTER } />
		</div>
	);
}

/**
 * @module BlocksContent
 */
export default BlocksContent;
