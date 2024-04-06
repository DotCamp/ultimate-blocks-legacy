import React, { useMemo } from 'react';
import {
	getModalTargetBlockType,
	getModalVisibilityStatus,
	hideProBlockUpsellModal,
	getCurrentRoutePath,
} from '$Stores/settings-menu/slices/app';
import { getBlockById } from '$Stores/settings-menu/slices/blocks';
import { getExtensionById } from '$Stores/settings-menu/slices/extension';
import withStore from '$HOC/withStore';
import UpsellModalBase from '$EditorComponents/Upsell/UpsellModalBase';
import { getAsset } from '$Stores/settings-menu/slices/assets';

/**
 * Upsell modal window for settings menu.
 *
 * @param {Object}   props                    component properties
 * @param {string}   props.targetBlock        target block id, will be supplied via HOC
 * @param {boolean}  props.visibility         modal visibility status, will be supplied via HOC
 * @param {Function} props.closeModalWindow   close modal window, will be supplied via HOC
 * @param {Function} props.getBlockObject     get block object, will be supplied via HOC
 * @param {Function} props.getExtensionObject get extension object, will be supplied via HOC
 * @param {string}   props.proBuyUrl          url for pro buy page, will be supplied via HOC
 * @param {string}   props.currentRoutePath   provides the current router
 */
function UpsellModalSettingsMenu({
	targetBlock,
	visibility,
	closeModalWindow,
	getBlockObject,
	getExtensionObject,
	proBuyUrl,
	currentRoutePath,
}) {
	/**
	 * Parse url and set route path.
	 */

	/**
	 * Prepare modal upsell data to be compatible with modal base component.
	 *
	 * @param {Object} blockObject block object
	 */
	const prepareUpsellData = (blockObject) => {
		if (blockObject && typeof blockObject === 'object') {
			const { name, title, info, icon, screenshotUrl, label } =
				blockObject;

			return {
				[name]: {
					name: title ?? label ?? '',
					description: Array.isArray(info) ? info[0] : info,
					imageUrl: screenshotUrl,
					icon,
				},
			};
		}

		return null;
	};
	const targetBlockObj =
		currentRoutePath === 'extensions'
			? getExtensionObject(targetBlock)
			: getBlockObject(targetBlock);
	const currentUpsellData = useMemo(() => {
		return prepareUpsellData(targetBlockObj);
	}, [targetBlock, targetBlockObj]);

	const currentBlockIcon = useMemo(() => {
		if (currentUpsellData) {
			const [{ icon }] = Object.values(currentUpsellData);
			return icon;
		}

		return null;
	}, [currentUpsellData]);

	return (
		<UpsellModalBase
			upsellData={currentUpsellData}
			modalVisibility={visibility}
			closeModal={closeModalWindow}
			proUrl={proBuyUrl}
			targetBlockIcon={currentBlockIcon}
		/>
	);
}

// store select mapping
const selectMapping = (select) => {
	return {
		targetBlock: select(getModalTargetBlockType),
		visibility: select(getModalVisibilityStatus),
		getBlockObject: (blockId) =>
			select((state) => getBlockById(state, blockId)),
		getExtensionObject: (blockId) =>
			select((state) => getExtensionById(state, blockId)),
		proBuyUrl: select((state) => getAsset(state, 'proBuyUrl')),
		currentRoutePath: select(getCurrentRoutePath),
	};
};
// store action mapping
const actionMapping = () => {
	return {
		closeModalWindow: hideProBlockUpsellModal,
	};
};

/**
 * @module UpsellModal
 */
export default withStore(UpsellModalSettingsMenu, selectMapping, actionMapping);
