import React from 'react';
import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import YouTubeEmbed from '$Components/YouTubeEmbed';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';

/**
 * Welcome content component.
 *
 * @class
 */
function WelcomeContent() {
	return (
		<div className={ 'ub-welcome-content' }>
			<div className={ 'ub-welcome-content__main' }>
				<BoxContentProvider
					size={ BoxContentSize.JUMBO }
					contentId={ 'welcome' }
				>
					<YouTubeEmbed videoId={ '8FESaV5WE8A' } />
				</BoxContentProvider>
				<BoxContentProvider
					size={ BoxContentSize.JUMBO }
					contentId={ 'upgrade' }
				>
					<ButtonLink
						url={ 'https://ultimateblocks.com' }
						title={ 'GET ULTIMATE BLOCKS PRO' }
						type={ ButtonLinkType.PRIMARY }
					/>
				</BoxContentProvider>
			</div>
			<div className={ 'ub-welcome-content__right-sidebar' }>
				<BoxContentProvider contentId={ 'documentation' }>
					<ButtonLink
						url={ 'https://ultimateblocks.com' }
						title={ __( 'Visit Documents', 'ultimate-blocks' ) }
						type={ ButtonLinkType.DEFAULT }
					/>
				</BoxContentProvider>
				<BoxContentProvider contentId={ 'support' }>
					<ButtonLink
						url={ 'https://ultimateblocks.com/community/' }
						title={ __( 'Support Forum', 'ultimate-blocks' ) }
						type={ ButtonLinkType.DEFAULT }
					/>
				</BoxContentProvider>
				<BoxContentProvider contentId={ 'community' }>
					<ButtonLink
						url={ 'https://ultimateblocks.com' }
						title={ __( 'Facebook', 'ultimate-blocks' ) }
						type={ ButtonLinkType.TEXT }
					/>
				</BoxContentProvider>
			</div>
		</div>
	);
}

/**
 * @module WelcomeContent
 */
export default WelcomeContent;
