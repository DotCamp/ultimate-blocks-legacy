import React from 'react';
import ContentPhrase from '$Components/ContentPhrase';
import LineWrapper from '$Components/LineWrapper';
import TextIndicate from '$Components/TextIndicate';

/**
 * Pro content component.
 */
function ProContent() {
	return (
		<div className={'pro-content'}>
			<ContentPhrase>
				<LineWrapper>
					<TextIndicate>Best</TextIndicate> Block Plugin
				</LineWrapper>
				<LineWrapper>
					Just Got Even <TextIndicate>Better.</TextIndicate>
				</LineWrapper>
			</ContentPhrase>
			<div className={'ub-pro-content-main'}>
				Get{' '}
				<a
					className={'ub-strip-anchor'}
					href={'https://ultimateblocks.com'}
					target={'_blank'}
					rel="noreferrer"
				>
					<TextIndicate>Ultimate Blocks Pro</TextIndicate>
				</a>{' '}
				Now!
			</div>
		</div>
	);
}

/**
 * @module ProContent
 */
export default ProContent;
