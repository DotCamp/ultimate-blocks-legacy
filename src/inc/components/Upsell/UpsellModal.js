import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import { hideUpsellModal } from '$BlockStores/mainStore/actions';
import VitalizeText from '$Inc/components/Upsell/VitalizeText';
import ActiveBlockIcon from '$Inc/components/Upsell/ActiveBlockIcon';
import UpsellModalContent from '$Inc/components/Upsell/UpsellModalContent';
import UpsellModalButton, {
	modalButtonTypes,
} from '$Inc/components/Upsell/UpsellModalButton';
import ModalNavigation, {
	navigationType,
} from '$Inc/components/Upsell/ModalNavigation';

/**
 * Upsell modal component.
 *
 * @param {Object}   props                  component properties
 * @param {boolean}  props.modalVisibility  modal visibility status, will be supplied via HOC
 * @param {Function} props.closeModal       close modal window, will be supplied via HOC
 * @param {Object}   props.upsellData       upsell data to show, will be supplied via HOC
 * @param {string}   props.defaultFeatureSs default feature screenshot for empty replacements, will be supplied via HOC
 * @param {string}   props.proUrl           pro url, will be supplied via HOC
 * @function Object() { [native code] }
 */
function UpsellModal({
	modalVisibility,
	closeModal,
	upsellData,
	defaultFeatureSs,
	proUrl,
}) {
	const [dataIndex, setDataIndex] = useState(0);
	const [allData, setAllData] = useState([]);
	const [currentData, setCurrentData] = useState(null);

	/**
	 * Pre-check for increment/decrement operations.
	 *
	 * @param {number} amount amount
	 * @return {boolean} pre operation status
	 */
	const preIncDecCheck = (amount) => {
		const finalIndex = dataIndex + amount;

		return finalIndex >= 0 && finalIndex !== allData.length;
	};

	/**
	 * Increment/decrement index.
	 *
	 * @param {number} amount amount
	 */
	const incDecIndex = (amount) => {
		const finalIndex = dataIndex + amount;

		if (preIncDecCheck(amount)) {
			setDataIndex(finalIndex);
		}
	};

	/**
	 * Navigation button status.
	 *
	 * @param {number} amount assigned increment/decrement amount
	 * @return {boolean} status
	 */
	const navStatus = (amount) => {
		return allData.length > 1 && preIncDecCheck(amount);
	};

	/**
	 * Direct current page to pro url.
	 */
	const directToProUrl = () => {
		window.open(proUrl, '_blank');
	};

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (upsellData && typeof upsellData === 'object') {
			const upsellDataValues = Object.values(upsellData);
			setAllData(upsellDataValues);

			setCurrentData(upsellDataValues[0]);
		}

		setDataIndex(0);
	}, [upsellData]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		// reset data index on visibility changes
		setDataIndex(0);
	}, [modalVisibility]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		setCurrentData(allData[dataIndex]);
	}, [dataIndex, allData]);

	return (
		modalVisibility &&
		currentData && (
			<div className={'ub-upsells-modal-wrapper'}>
				<ModalNavigation
					clickHandler={() => incDecIndex(-1)}
					type={navigationType.LEFT}
					disable={!navStatus(-1)}
				/>
				<div className={'ub-upsells-modal-main-window'}>
					<div className={'ub-upsells-modal-header'}>
						<ActiveBlockIcon />
						<VitalizeText>{currentData.name}</VitalizeText>
					</div>
					<UpsellModalContent
						ssUrl={currentData.imageUrl || defaultFeatureSs}
						description={currentData.description}
					/>
					<div className={'ub-upsells-modal-footer'}>
						<UpsellModalButton clickHandler={closeModal}>
							{__('Close', 'ultimate-blocks')}
						</UpsellModalButton>
						<UpsellModalButton
							clickHandler={directToProUrl}
							type={modalButtonTypes.PRIO}
						>
							{__('Buy PRO', 'ultimate-blocks')}
						</UpsellModalButton>
					</div>
				</div>
				<ModalNavigation
					clickHandler={() => incDecIndex(1)}
					type={navigationType.RIGHT}
					disable={!navStatus(1)}
				/>
			</div>
		)
	);
}

// main store selector mapping
const mainStoreSelectMapping = (namespacedSelect) => {
	const {
		upsellModalVisibilityStatus,
		getUpsellTargetExtensionInfoShow,
		getUpsellDataActiveBlock,
		getLogoUrl,
		getAssets,
	} = namespacedSelect;

	return {
		modalVisibility: upsellModalVisibilityStatus(),
		upsellData: getUpsellDataActiveBlock(
			getUpsellTargetExtensionInfoShow()
		),
		defaultFeatureSs: getLogoUrl(),
		proUrl: getAssets('proUrl'),
	};
};

// main store action mapping
const mainStoreActionMapping = (namespacedDispatch) => {
	return {
		closeModal: hideUpsellModal(namespacedDispatch),
	};
};

/**
 * @module UpsellModal
 */
export default connectWithMainStore(
	mainStoreSelectMapping,
	mainStoreActionMapping
)(UpsellModal);
