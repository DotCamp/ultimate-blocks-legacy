import React from 'react';
import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import YouTubeEmbed from '$Components/YouTubeEmbed';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import ButtonLinkGroup from '$Components/ButtonLinkGroup';
import UpgradeBoxContent from '$Components/UpgradeBoxContent';
import withStore from '$HOC/withStore';
import { getAsset } from '$Stores/settings-menu/slices/assets';

/**
 * Welcome content component.
 *
 * @param {Object} props                component properties
 * @param {string} props.youtubeVideoId youtube video id for welcome page
 * @param {string} props.documentsUrl   url for documents
 * @param {string} props.supportUrl     url for support forum
 * @param {string} props.twitterUrl     url for twitter
 * @param {string} props.facebookUrl    url for facebook
 * @param {string} props.youtubeUrl     url for youtube
 * @class
 */
function WelcomeContent( {
	youtubeVideoId,
	documentsUrl,
	supportUrl,
	twitterUrl,
	facebookUrl,
	youtubeUrl,
} ) {
	return (
		<div className={ 'ub-welcome-content' }>
			<div className={ 'ub-welcome-content__main' }>
				<BoxContentProvider
					size={ BoxContentSize.JUMBO }
					contentId={ 'welcome' }
				>
					<YouTubeEmbed height={ 315 } videoId={ youtubeVideoId } />
				</BoxContentProvider>
				<UpgradeBoxContent />
			</div>
			<div className={ 'ub-welcome-content__right-sidebar' }>
				<BoxContentProvider contentId={ 'documentation' }>
					<ButtonLink
						url={ documentsUrl }
						title={ __( 'Visit Documents', 'ultimate-blocks' ) }
						type={ ButtonLinkType.DEFAULT }
					/>
				</BoxContentProvider>
				<BoxContentProvider contentId={ 'support' }>
					<ButtonLink
						url={ supportUrl }
						title={ __( 'Support Forum', 'ultimate-blocks' ) }
						type={ ButtonLinkType.DEFAULT }
					/>
				</BoxContentProvider>
				<BoxContentProvider contentId={ 'community' }>
					<ButtonLinkGroup>
						<ButtonLink
							url={ facebookUrl }
							title={ __( 'Facebook', 'ultimate-blocks' ) }
							type={ ButtonLinkType.TEXT }
						/>
						<ButtonLink
							url={ twitterUrl }
							title={ __( 'Twitter', 'ultimate-blocks' ) }
							type={ ButtonLinkType.TEXT }
						/>
						<ButtonLink
							url={ youtubeUrl }
							title={ __( 'YouTube', 'ultimate-blocks' ) }
							type={ ButtonLinkType.TEXT }
						/>
					</ButtonLinkGroup>
				</BoxContentProvider>
			</div>
		</div>
	);
}

// store select mapping
const selectMapping = ( select ) => ( {
	youtubeVideoId: select( ( state ) => getAsset( state, 'youtubeVideoId' ) ),
	documentsUrl: select( ( state ) => getAsset( state, 'documentsUrl' ) ),
	supportUrl: select( ( state ) => getAsset( state, 'supportUrl' ) ),
	twitterUrl: select( ( state ) => getAsset( state, 'twitterUrl' ) ),
	facebookUrl: select( ( state ) => getAsset( state, 'facebookUrl' ) ),
	youtubeUrl: select( ( state ) => getAsset( state, 'youtubeUrl' ) ),
} );

/**
 * @module WelcomeContent
 */
export default withStore( WelcomeContent, selectMapping );
