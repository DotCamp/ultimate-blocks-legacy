import React from 'react';
import BoxContent from '$Components/BoxContent/BoxContent';

/**
 * Welcome content component.
 *
 * @class
 */
function WelcomeContent() {
	return (
		<div className={ 'ub-welcome-content' }>
			<div className={ 'ub-welcome-content__main' }>
				<BoxContent />
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
