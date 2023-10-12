import React from 'react';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';
import YouTubeEmbed from '$Components/YouTubeEmbed';

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
				/>
			</div>
			<div className={ 'ub-welcome-content__right-sidebar' }>
				<BoxContentProvider contentId={ 'documentation' } />
				<BoxContentProvider contentId={ 'support' } />
				<BoxContentProvider contentId={ 'community' } />
			</div>
		</div>
	);
}

/**
 * @module WelcomeContent
 */
export default WelcomeContent;
