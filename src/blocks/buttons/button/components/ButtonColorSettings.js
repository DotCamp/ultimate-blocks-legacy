/**
 * WordPress Dependencies
 */

import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
	useBlockEditContext,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from "@wordpress/block-editor";

function ColorSettings(props) {
	const { clientId } = useBlockEditContext();

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const { defaultColors } = useSelect((select) => {
		return {
			defaultColors:
				select("core/block-editor")?.getSettings()?.__experimentalFeatures
					?.color?.palette?.default,
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
					resetAllFilter: () => props.onValueReset(),
					colorValue: props.value,
					colors: defaultColors,
					label: props.label,
					onColorChange: (newValue) => props.onValueChange(newValue),
				},
			]}
		/>
	);
}

export default ColorSettings;
