// eslint-disable-next-line no-unused-vars
import React from 'react';
import TextIndicate from "$Components/TextIndicate";

/**
 * Content phrase component.
 *
 * @constructor
 */
function ContentPhrase() {
	return (
		<div className={ 'content-phrase' }>
			<div className={ 'line-wrapper' }>
				<TextIndicate>Manage</TextIndicate> Your <TextIndicate>Blocks</TextIndicate> As
			</div>
			<div className={ 'line-wrapper' }>Your <TextIndicate>Preferences</TextIndicate></div>
		</div>
	);
}

/**
 * @module ContentPhrase;
 */
export default ContentPhrase;
