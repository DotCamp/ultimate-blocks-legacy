import React from 'react';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';

/**
 * Welcome content component.
 *
 * @class
 */
function WelcomeContent() {
	return (
		<div className={ 'ub-welcome-content' }>
			<div className={ 'ub-welcome-content__main' }>
				<BoxContentProvider contentId={ 'welcome' } />
			</div>
			<div className={ 'ub-welcome-content__right-sidebar' }>
				right sidebar
			</div>
		</div>
	);
}

/**
 * @module WelcomeContent
 */
export default WelcomeContent;
