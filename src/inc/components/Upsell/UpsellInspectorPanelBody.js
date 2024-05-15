import React from "react";
import { PanelBody } from "@wordpress/components";
import UpsellControlSelector from "$Inc/components/Upsell/Controls/UpsellControlSelector";

/**
 * General inspector panel body dedicated only to hold upsell controls.
 *
 * @param {Object} props             component properties
 * @param {string} props.label       panel title
 * @param {Array}  props.contentData content data for dummy controls inside this panel
 * @function Object() { [native code] }
 */
function UpsellInspectorPanelBody({ label, contentData }) {
	return (
		<PanelBody initialOpen={false} title={label}>
			{contentData.map((data) => (
				<UpsellControlSelector key={data.featureId} controlData={data} />
			))}
		</PanelBody>
	);
}

/**
 * @module UpsellInspectorPanelBody.
 */
export default UpsellInspectorPanelBody;
