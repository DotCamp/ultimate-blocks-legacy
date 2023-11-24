import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { desktop } from "@wordpress/icons";
import { ToggleControl, PanelBody } from "@wordpress/components";

function Inspector(props) {
	const { attributes, setAttributes } = props;
	const { isHideOnDesktop, isHideOnTablet, isHideOnMobile } = attributes;
	return (
		<InspectorControls>
			<PanelBody title={__("Responsive Control")} icon={desktop}>
				<ToggleControl
					checked={isHideOnDesktop}
					label={__("Hide On Desktop", "ultimate-blocks")}
					onChange={() => setAttributes({ isHideOnDesktop: !isHideOnDesktop })}
				/>
				<ToggleControl
					checked={isHideOnTablet}
					label={__("Hide On Tablet", "ultimate-blocks")}
					onChange={() => setAttributes({ isHideOnTablet: !isHideOnTablet })}
				/>
				<ToggleControl
					checked={isHideOnMobile}
					label={__("Hide On Mobile", "ultimate-blocks")}
					onChange={() => setAttributes({ isHideOnMobile: !isHideOnMobile })}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
export default Inspector;
