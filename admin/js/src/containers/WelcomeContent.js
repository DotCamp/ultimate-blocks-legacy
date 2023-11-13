import React from 'react';
import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import YouTubeEmbed from '$Components/YouTubeEmbed';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import ButtonLinkGroup from '$Components/ButtonLinkGroup';
import UpgradeBoxContent from '$Components/UpgradeBoxContent';
import AssetProvider from '$Components/AssetProvider';

/**
 * Welcome content component.
 *
 * @class
 */
function WelcomeContent() {
	return (
		<AssetProvider
			assetIds={[
				'youtubeVideoId',
				'documentsUrl',
				'supportUrl',
				'twitterUrl',
				'facebookUrl',
				'youtubeUrl',
			]}
		>
			{({
				youtubeVideoId,
				documentsUrl,
				supportUrl,
				twitterUrl,
				facebookUrl,
				youtubeUrl,
			}) => (
				<div className={'ub-welcome-content'}>
					<div className={'ub-welcome-content__main'}>
						<BoxContentProvider
							size={BoxContentSize.JUMBO}
							contentId={'welcome'}
						>
							<YouTubeEmbed
								height={315}
								videoId={youtubeVideoId}
							/>
						</BoxContentProvider>
						<UpgradeBoxContent />
					</div>
					<div className={'ub-welcome-content__right-sidebar'}>
						<BoxContentProvider contentId={'documentation'}>
							<ButtonLink
								url={documentsUrl}
								title={__('Visit Documents', 'ultimate-blocks')}
								type={ButtonLinkType.DEFAULT}
							/>
						</BoxContentProvider>
						<BoxContentProvider contentId={'support'}>
							<ButtonLink
								url={supportUrl}
								title={__('Support Forum', 'ultimate-blocks')}
								type={ButtonLinkType.DEFAULT}
							/>
						</BoxContentProvider>
						<BoxContentProvider contentId={'community'}>
							<ButtonLinkGroup>
								<ButtonLink
									url={facebookUrl}
									title={__('Facebook', 'ultimate-blocks')}
									type={ButtonLinkType.TEXT}
								/>
								<ButtonLink
									url={twitterUrl}
									title={__('Twitter', 'ultimate-blocks')}
									type={ButtonLinkType.TEXT}
								/>
								<ButtonLink
									url={youtubeUrl}
									title={__('YouTube', 'ultimate-blocks')}
									type={ButtonLinkType.TEXT}
								/>
							</ButtonLinkGroup>
						</BoxContentProvider>
					</div>
				</div>
			)}
		</AssetProvider>
	);
}

/**
 * @module WelcomeContent
 */
export default WelcomeContent;
