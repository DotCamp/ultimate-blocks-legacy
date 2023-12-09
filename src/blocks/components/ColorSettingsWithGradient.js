/**
 * WordPress Dependencies
 */

import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
	useBlockEditContext,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from "@wordpress/block-editor";

/**
 *
 * @param {object} props - Color settings with gradients props
 * @param {string} props.label - Component Label
 * @param {string} props.attrBackgroundKey - Attribute key for background color
 * @param {string} props.attrGradientKey - Attribute key for gradient background color
 *
 */
function ColorSettingsWithGradient(props) {
	const { clientId } = useBlockEditContext();
	const { updateBlockAttributes } = useDispatch("core/block-editor");

	const attributes = useSelect((select) => {
		return select("core/block-editor").getBlockAttributes(clientId);
	});
	const setAttributes = (newAttributes) =>
		updateBlockAttributes(clientId, newAttributes);
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const { defaultColors, defaultGradients } = useSelect((select) => {
		return {
			defaultColors:
				select("core/block-editor")?.getSettings()?.__experimentalFeatures
					?.color?.palette?.default,

			defaultGradients:
				select("core/block-editor")?.getSettings()?.__experimentalFeatures
					?.color?.gradients?.default,
		};
	});

	return (
		<ColorGradientSettingsDropdown
			{...colorGradientSettings}
			enableAlpha
			panelId={clientId}
			title={__("Color Settings", "ultimate-blocks-pro")}
			popoverProps={{
				placement: "left start",
			}}
			settings={[
				{
					clearable: true,
					resetAllFilter: () =>
						setAttributes({
							[props.attrBackgroundKey]: null,
							[props.attrGradientKey]: null,
						}),
					colorValue: attributes[props.attrBackgroundKey],
					gradientValue: attributes[props.attrGradientKey],
					colors: defaultColors,
					gradients: defaultGradients,
					label: props.label,
					onColorChange: (newValue) =>
						setAttributes({
							[props.attrBackgroundKey]: newValue,
						}),
					onGradientChange: (newValue) =>
						setAttributes({
							[props.attrGradientKey]: newValue,
						}),
				},
			]}
		/>
	);
}

export default ColorSettingsWithGradient;
