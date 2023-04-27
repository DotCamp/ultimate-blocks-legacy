// eslint-disable-next-line no-unused-vars
import React from 'react';
import TextIndicate from '$Components/TextIndicate';
import ContentPhrase from '$Components/ContentPhrase';
import LineWrapper from '$Components/LineWrapper';

/**
 * Content phrase component.
 *
 * @function Object() { [native code] }
 */
function MainContentPhrase() {
	return (
		<ContentPhrase>
			<LineWrapper>
				<TextIndicate>Manage</TextIndicate> Your{' '}
				<TextIndicate>Blocks</TextIndicate> As
			</LineWrapper>
			<LineWrapper>
				Your <TextIndicate>Preferences</TextIndicate>
			</LineWrapper>
		</ContentPhrase>
	);
}

/**
 * @module MainContentPhrase
 */
export default MainContentPhrase;
