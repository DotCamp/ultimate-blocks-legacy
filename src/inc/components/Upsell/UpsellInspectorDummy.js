import React from 'react';
import UpsellProPanel from '$Inc/components/Upsell/UpsellProPanel';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import UpsellControlSelector from '$Inc/components/Upsell/Controls/UpsellControlSelector';

/**
 * Upsell dummy inspector wrapper for side panel.
 *
 * @param {Object}       props              component properties
 * @param {Array | null} props.controlsData dummy controls data, will be supplied via HOC
 * @function Object() { [native code] }
 */
function UpsellInspectorDummy({ controlsData }) {
	return (
		controlsData &&
		Array.isArray(controlsData) &&
		controlsData.length > 0 && (
			<UpsellProPanel>
				{controlsData.map((data) => (
					<UpsellControlSelector
						key={data.featureId}
						controlData={data}
					/>
				))}
			</UpsellProPanel>
		)
	);
}

// main store select mapping
const selectMapping = (namespacedSelect) => {
	const { getUpsellDummyControlDataActiveBlock } = namespacedSelect;

	return { controlsData: getUpsellDummyControlDataActiveBlock() };
};

/**
 * @module UpsellInspectorDummy
 */
export default connectWithMainStore(selectMapping, null)(UpsellInspectorDummy);
