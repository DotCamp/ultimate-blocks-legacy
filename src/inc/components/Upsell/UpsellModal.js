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

/**
 * Upsell modal component.
 *
 * @param {Object}   props                 component properties
 * @param {boolean}  props.modalVisibility modal visibility status, will be supplied via HOC
 * @param {Function} props.closeModal      close modal window, will be supplied via HOC
 * @param {Object}   props.upsellData      upsell data to show
 * @function Object() { [native code] }
 */
function UpsellModal({ modalVisibility, closeModal, upsellData }) {
	const [dataIndex, setDataIndex] = useState(0);
	const [allData, setAllData] = useState([]);
	const [currentData, setCurrentData] = useState(null);

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
		setCurrentData(allData[dataIndex]);
	}, [dataIndex, allData]);

	return (
		modalVisibility &&
		currentData && (
			<div className={'ub-upsells-modal-wrapper'}>
				<div className={'ub-upsells-modal-main-window'}>
					<div className={'ub-upsells-modal-header'}>
						<ActiveBlockIcon />
						<VitalizeText>{currentData.name}</VitalizeText>
					</div>
					<UpsellModalContent
						ssUrl={currentData.imageUrl}
						description={currentData.description}
					/>
					<div className={'ub-upsells-modal-footer'}>
						<UpsellModalButton clickHandler={closeModal}>
							{__('Close', 'ultimate-blocks')}
						</UpsellModalButton>

						<UpsellModalButton
							clickHandler={() => {}}
							type={modalButtonTypes.PRIO}
						>
							{__('Buy PRO', 'ultimate-blocks')}
						</UpsellModalButton>
					</div>
				</div>
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
	} = namespacedSelect;

	return {
		modalVisibility: upsellModalVisibilityStatus(),
		upsellData: getUpsellDataActiveBlock(
			getUpsellTargetExtensionInfoShow()
		),
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
