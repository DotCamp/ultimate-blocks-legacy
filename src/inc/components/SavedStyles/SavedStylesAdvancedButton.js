import React from 'react';
import { Button } from '@wordpress/components';
import { Overlay } from '$Library/ub-common/Components';
import { showExtensionInfo } from '$BlockStores/mainStore/actions';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';

/**
 * Button for advanced controls.
 *
 * Other than `isUpsell` property, all other properties will be passed to WordPress Button component.
 *
 * @param {Object}   props                                     component properties
 * @param {string}   props.children                            button label
 * @param {boolean}  [props.isUpsell=true]                     is connected to upsell feature
 * @param {Function} props.showModal                           show modal window for target feature, will be supplied by HOC
 * @param {string}   [props.targetFeatureId='savedStylesMain'] target feature id
 * @param {string}   [props.containerClassName='']             class names for container
 * @function Object() { [native code] }
 */
function SavedStylesAdvancedButton({
	children,
	isUpsell = true,
	showModal,
	targetFeatureId = 'savedStylesMain',
	containerClassName = '',
	...rest
}) {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			className={'ub-saved-styles-advanced-button ' + containerClassName}
			onClick={() => {
				if (isUpsell) {
					showModal(targetFeatureId);
				}
			}}
		>
			{isUpsell && <Overlay />}
			<Button {...rest}>{children}</Button>
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
 * @module SavedStyleAdvancedButton
 */
export default connectWithMainStore(
	null,
	mainStoreActionMap
)(SavedStylesAdvancedButton);
