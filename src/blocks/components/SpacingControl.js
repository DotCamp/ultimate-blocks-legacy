/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	useBlockEditContext,
	__experimentalSpacingSizesControl as SpacingSizesControl,
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { PanelBody } from "@wordpress/components";

function SpacingControl({ label, attrKey, minimumCustomValue = 0 }) {
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
			<SpacingSizesControl
				minimumCustomValue={minimumCustomValue}
				allowReset={true}
				label={label}
				values={attributes[attrKey]}
				sides={["top", "right", "bottom", "left"]}
				onChange={(newValue) => {
					setAttributes({
						[attrKey]: newValue,
					});
				}}
			/>
		</>
	);
}

export default SpacingControl;
