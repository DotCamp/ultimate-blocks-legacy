/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import {
	useBlockEditContext,
	__experimentalBorderRadiusControl as WPBorderRadiusControl,
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	BaseControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";

export function hasMixedValues(values = {}) {
	return typeof values === "string";
}
export function splitBorderRadius(value) {
	const isValueMixed = hasMixedValues(value);
	const splittedBorderRadius = {
		topLeft: value,
		topRight: value,
		bottomLeft: value,
		bottomRight: value,
	};
	return isValueMixed ? splittedBorderRadius : value;
}

function BorderRadiusControl({ label, attrKey }) {
	const { clientId } = useBlockEditContext();
	const attributes = useSelect(
		(select) => select("core/block-editor").getSelectedBlock().attributes
	);
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const setAttributes = (newAttributes) => {
		updateBlockAttributes(clientId, newAttributes);
	};

	return (
		<>
			<ToolsPanelItem
				panelId={clientId}
				resetAllFilter={() =>
					setAttributes({
						[attrKey]: {},
					})
				}
				label={label}
				hasValue={() => !isEmpty(attributes[attrKey])}
				onDeselect={() => {
					setAttributes({ [attrKey]: {} });
				}}
			>
				<BaseControl.VisualLabel as="legend">{label}</BaseControl.VisualLabel>
				<div className="ub-border-radius-control">
					<WPBorderRadiusControl
						values={attributes[attrKey]}
						onChange={(newBorderRadius) => {
							const splitted = splitBorderRadius(newBorderRadius);

							setAttributes({
								[attrKey]: splitted,
							});
						}}
					/>
				</div>
			</ToolsPanelItem>
		</>
	);
}

export default BorderRadiusControl;
