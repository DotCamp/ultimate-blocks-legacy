import React from "react";
import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import connectWithMainStore from "$BlockStores/mainStore/hoc/connectWithMainStore";

/**
 * Pro panel container for inspector upsell controls and panel bodies.
 *
 * @param {Object}                          props           component properties
 * @param {JSX.Element | Function | Array } props.children  component children
 * @param {boolean}                         props.proStatus plugin pro status, will be supplied via HOC
 * @function Object() { [native code] }
 */
function UpsellProPanel({ proStatus, children, isExtension = false }) {
	console.log(isExtension);
	return (
		!proStatus && (
			<PanelBody
				className={"ub-upsell-pro-panel"}
				initialOpen={false}
				title={isExtension ? "PRO Extensions" : __("PRO", "ultimate-blocks")}
			>
				{children}
			</PanelBody>
		)
	);
}

// main store select mapping
const selectMapping = (namespacedSelect) => {
	const { getProStatus } = namespacedSelect;

	return { proStatus: getProStatus() };
};

/**
 * @module UpsellProPanel
 */
export default connectWithMainStore(selectMapping, null)(UpsellProPanel);
