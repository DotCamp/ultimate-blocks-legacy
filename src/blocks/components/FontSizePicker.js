/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { useBlockEditContext } from "@wordpress/block-editor";
import { FontSizePicker, BaseControl } from "@wordpress/components";
import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";

function CustomFontSizePicker({
	attrKey,
	label,
	withReset = false,
	withSlider = true,
	showDefaultFontSize = true,
}) {
	const { clientId } = useBlockEditContext();
	const attributes = useSelect(
		(select) => select("core/block-editor").getSelectedBlock().attributes
	);
	const { fontSizes } = useSelect((select) => {
		return {
			fontSizes: select("core/block-editor")?.getSettings()?.fontSizes,
		};
	});
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const setAttributes = (newAttributes) => {
		updateBlockAttributes(clientId, newAttributes);
	};

	return (
		<>
			<ToolsPanelItem
				panelId={clientId}
				isShownByDefault={showDefaultFontSize}
				resetAllFilter={() =>
					setAttributes({
						[attrKey]: {},
					})
				}
				label={label}
				hasValue={() => !isEmpty(attributes[attrKey])}
				onDeselect={() => {
					setAttributes({ [attrKey]: "" });
				}}
			>
				<BaseControl label={label}>
					<FontSizePicker
						withReset={withReset}
						size="__unstable-large"
						__nextHasNoMarginBottom
						fontSizes={fontSizes}
						withSlider={withSlider}
						value={attributes[attrKey]}
						onChange={(newSize) => setAttributes({ [attrKey]: newSize })}
					/>
				</BaseControl>
			</ToolsPanelItem>
		</>
	);
}

export default CustomFontSizePicker;
