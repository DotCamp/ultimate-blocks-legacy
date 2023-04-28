import React from 'react';
import ContentPhrase from '$Components/ContentPhrase';
import LineWrapper from '$Components/LineWrapper';
import TextIndicate from '$Components/TextIndicate';
import AnimationAppear from '$Components/AnimationAppear';

/**
 * Pro content component.
 */
function ProContent() {
	return (
		<div className={'pro-content'}>
			<ContentPhrase>
				<AnimationAppear delay={100}>
					<LineWrapper>
						<TextIndicate>Best</TextIndicate> Block Plugin
					</LineWrapper>
				</AnimationAppear>
				<AnimationAppear delay={600}>
					<LineWrapper>
						Just Got Even <TextIndicate>Better.</TextIndicate>
					</LineWrapper>
				</AnimationAppear>
			</ContentPhrase>
			<AnimationAppear delay={1400}>
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
			</AnimationAppear>
		</div>
	);
}

/**
 * @module ProContent
 */
export default ProContent;
