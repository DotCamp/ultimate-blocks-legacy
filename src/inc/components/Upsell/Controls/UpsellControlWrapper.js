import React from 'react';
import { __ } from '@wordpress/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showExtensionInfo } from '$BlockStores/mainStore/actions';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';

/**
 * Upsell control wrapper component.
 *
 * @param {Object}              props           component properties
 * @param {Array | JSX.Element} props.children  component children
 * @param {string}              props.featureId feature id
 * @param {Function}            props.showModal show modal, will be supplied by HOC
 * @function Object() { [native code] }
 */
function UpsellControlWrapper({ children, featureId, showModal }) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			className={'ub-upsell-control-wrapper'}
			onClick={() => showModal(featureId)}
			title={__('click for more info', 'ultimate-blocks')}
		>
			{children}
			<div className={'ub-upsell-control-wrapper-lock'}>
				<div className={'ub-upsell-control-wrapper-lock-container'}>
					<FontAwesomeIcon icon="fa-solid fa-lock" />
				</div>
			</div>
			<div className={'ub-upsell-control-wrapper-overlay'}></div>
		</div>
	);
}

// main store action mapping
const mainStoreActionMap = (namespacedDispatch) => {
	return {
		showModal: showExtensionInfo(namespacedDispatch),
	};
};

/**
 * @module UpsellControlWrapper
 */
export default connectWithMainStore(
	null,
	mainStoreActionMap
)(UpsellControlWrapper);
