import React from 'react';
import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentLayout } from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';

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
			>
				<ButtonLink
					url={ 'https://ultimateblocks.com' }
					type={ ButtonLinkType.DEFAULT }
					title={ __( 'Activate All' ) }
				/>
				<ButtonLink
					url={ 'https://ultimateblocks.com' }
					type={ ButtonLinkType.DEFAULT }
					title={ __( 'Deactivate All' ) }
				/>
			</BoxContentProvider>
		</div>
	);
}

/**
 * @module BlocksContent
 */
export default BlocksContent;
