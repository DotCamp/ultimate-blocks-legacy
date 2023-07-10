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

function ColorSettings() {
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
			panelId={clientId}
			title={__("Color Settings", "ultimate-blocks")}
			popoverProps={{
				placement: "left start",
			}}
			settings={[
				{
					colorValue: attributes.iconColor,
					colors: defaultColors,
					label: __("Icon Color", "ultimate-blocks"),
					onColorChange: (newValue) => setAttributes({ iconColor: newValue }),
				},
				{
					colorValue: attributes.iconHoverColor,
					colors: defaultColors,
					label: __("Icon Hover Color", "ultimate-blocks"),
					onColorChange: (newValue) =>
						setAttributes({ iconHoverColor: newValue }),
				},
				{
					colorValue: attributes.iconBackground,
					gradientValue: attributes.iconGradientBackground,
					colors: defaultColors,
					gradients: defaultGradients,
					label: __("Icon Background", "ultimate-blocks"),
					onColorChange: (newValue) =>
						setAttributes({ iconBackground: newValue }),
					onGradientChange: (newValue) =>
						setAttributes({ iconGradientBackground: newValue }),
				},
				{
					colorValue: attributes.iconHoverBackground,
					gradientValue: attributes.iconHoverGradientBackground,
					colors: defaultColors,
					gradients: defaultGradients,
					label: __("Icon Hover Background", "ultimate-blocks"),

					onColorChange: (newValue) => {
						setAttributes({ iconHoverBackground: newValue });
					},
					onGradientChange: (newValue) => {
						setAttributes({ iconHoverGradientBackground: newValue });
					},
				},
			]}
		/>
	);
}

export default ColorSettings;
