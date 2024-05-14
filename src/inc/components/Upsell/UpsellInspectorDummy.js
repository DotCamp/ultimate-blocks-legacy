import React from "react";
import UpsellProPanel from "$Inc/components/Upsell/UpsellProPanel";
import connectWithMainStore from "$BlockStores/mainStore/hoc/connectWithMainStore";
import UpsellControlSelector from "$Inc/components/Upsell/Controls/UpsellControlSelector";
import { PanelBody } from "@wordpress/components";

/**
 * Upsell dummy inspector wrapper for side panel.
 *
 * @param {Object}       props              component properties
 * @param {Array | null} props.controlsData dummy controls data, will be supplied via HOC
 * @param {boolean}      props.proStatus    plugin pro status, will be supplied via HOC
 * @function Object() { [native code] }
 */
function UpsellInspectorDummy({ controlsData, proStatus }) {
	const hasControlData =
		controlsData && Array.isArray(controlsData) && controlsData.length > 0;
	const blocksData = hasControlData
		? controlsData.filter((data) => !data.isExtension)
		: [];
	const extensionData = hasControlData
		? controlsData.filter((data) => data.isExtension)
		: [];
	return (
		<>
			{!proStatus &&
				blocksData &&
				Array.isArray(blocksData) &&
				blocksData.length > 0 && (
					<UpsellProPanel>
						{blocksData.map((data) => (
							<UpsellControlSelector key={data.featureId} controlData={data} />
						))}
					</UpsellProPanel>
				)}
			{!proStatus &&
				extensionData &&
				Array.isArray(extensionData) &&
				extensionData.length > 0 &&
				extensionData.map((data) => {
					return (
						<div className={"ub-upsell-pro-panel"}>
							<UpsellControlSelector key={data.featureId} controlData={data} />
						</div>
					);
				})}
		</>
	);
}

// main store select mapping
const selectMapping = (namespacedSelect) => {
	const { getUpsellDummyControlDataActiveBlock, getProStatus } =
		namespacedSelect;

	return {
		controlsData: getUpsellDummyControlDataActiveBlock(),
		proStatus: getProStatus(),
	};
};

/**
 * @module UpsellInspectorDummy
 */
export default connectWithMainStore(selectMapping, null)(UpsellInspectorDummy);
