import React from 'react';

/**
 * Component for animating its children.
 *
 * This component relies on @keyframes animations.
 *
 * @param {Object}                       props                       component properties
 * @param {JSX.Element | Array | string} props.children              component children
 * @param {string}                       props.animationKeyframeName keyframe name
 * @param {number}                       [props.duration=1000]       duration in milliseconds
 * @param {number}                       [props.delay=0]             delay in milliseconds
 */
function Animation({
	children,
	animationKeyframeName,
	duration = 1000,
	delay = 0,
}) {
	return (
		<span
			className={'ub-animation'}
			style={{
				animation: `${animationKeyframeName} ${duration}ms ease-out ${delay}ms both`,
			}}
		>
			{children}
		</span>
	);
}

/**
 * @module Animation
 */
export default Animation;
