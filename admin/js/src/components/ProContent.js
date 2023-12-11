import React from 'react';
import ContentPhrase from '$Components/ContentPhrase';
import LineWrapper from '$Components/LineWrapper';
import TextIndicate from '$Components/TextIndicate';
import AnimationAppear from '$Components/AnimationAppear';
import { getAsset } from '$Stores/settings-menu/slices/assets';
import withStore from '$HOC/withStore';

/**
 * Pro content component.
 *
 * @param {Object} props           component properties
 * @param {string} props.proBuyUrl url for pro buy page
 */
function ProContent({ proBuyUrl }) {
	return (
		<div className={'pro-content'}>
			<ContentPhrase>
				<AnimationAppear delay={100}>
					<LineWrapper>
						<TextIndicate>Best</TextIndicate> Blocks Plugin
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
						href={proBuyUrl}
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

// store select mapping
const selectMapping = (selector) => {
	return {
		proBuyUrl: selector(getAsset)('proBuyUrl'),
	};
};

/**
 * @module ProContent
 */
export default withStore(ProContent, selectMapping);
