import React from 'react';
import Animation from '$Components/Animation';

/**
 * Animation appear component.
 *
 * This is a wrapper for Animation component. You can use its props for more customization.
 * `animationKeyframeName` is set to `appear` by default and will override any other value provided.
 *
 * @param {Object} props component properties
 */
function AnimationAppear(props) {
	const { children, ...rest } = props;
	rest.animationKeyframeName = 'appear';

	return <Animation {...rest}>{children}</Animation>;
}

/**
 * @module AnimationAppear
 */
export default AnimationAppear;
