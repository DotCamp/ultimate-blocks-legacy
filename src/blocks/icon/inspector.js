/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import { InspectorControls, HeightControl } from "@wordpress/block-editor";
/**
 * Custom Imports
 */
import ColorSettings from "./components/ColorSettings";

function CustomInspectorControls(props) {
	const {
		setAttributes,
		attributes: { size },
	} = props;
	return (
		<>
			<InspectorControls>
				<PanelBody>
					<HeightControl
						value={size}
						label={__("Icon Size", "ultimate-blocks")}
						onChange={(newSize) => setAttributes({ size: newSize })}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorSettings />
			</InspectorControls>
		</>
	);
}
export default CustomInspectorControls;
