import { useEffect } from 'react';
import { dispatch } from '@wordpress/data';
import DevelopmentComponent from '$Development/components/DevelopmentComponent';

/**
 * DEVELOPMENT
 *
 * Activate given block on editor ready state.
 *
 * @param {Object} props component properties
 * @function Object() { [native code] }
 */
const ActivateBlockOnStartup = (props) => {
	const { clientId, children, isDevelopment } = props;

	/**
	 * useEffect hook
	 */
	useEffect(() => {
		if (isDevelopment) {
			dispatch('core/block-editor').selectBlock(clientId);
		}
	}, []);

	return children;
};

/**
 * HOC for setting target block active on startup
 *
 * @param {Function} Component target block component
 * @return {function(*): *} generated component
 */
const withActivateBlockOnStartup = (Component) => (props) => {
	return (
		<DevelopmentComponent>
			<ActivateBlockOnStartup {...props}>
				<Component {...props} />
			</ActivateBlockOnStartup>
		</DevelopmentComponent>
	);
};

/**
 * @module ActivateBlockOnStartup
 */
export default withActivateBlockOnStartup;
