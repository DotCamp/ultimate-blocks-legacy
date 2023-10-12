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
					<div style={ { borderRadius: '8px', overflow: 'hidden' } }>
						<iframe
							width="560"
							height="315"
							src="https://www.youtube.com/embed/8FESaV5WE8A?si=Sy2LUgvsl13TENax"
							title="YouTube video player"
							frameBorder="0"
							allow="picture-in-picture; web-share; fullscreen"
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
