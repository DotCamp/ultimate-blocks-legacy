import React from 'react';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import { BoxContentSize } from '$Components/BoxContent/BoxContent';

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
					<div>
						<iframe
							width="100%"
							height="315"
							src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=jzY8QXe9R1hOO4Va"
							title="YouTube video player"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						></iframe>
					</div>
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
