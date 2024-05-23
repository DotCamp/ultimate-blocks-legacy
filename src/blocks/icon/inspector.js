/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { PanelBody, RangeControl } from "@wordpress/components";
import { InspectorControls, HeightControl } from "@wordpress/block-editor";
/**
 * Custom Imports
 */
import {
	BorderControl,
	ColorSettings,
	ColorSettingsWithGradient,
	SpacingControl,
	TabsPanelControl,
} from "../components";

function CustomInspectorControls(props) {
	const {
		setAttributes,
		attributes: { size, iconRotation, className },
	} = props;
	const blockClassName = className ?? props.attributes?.className ?? "";
	const isStyleCircleOutline = blockClassName
		?.split(" ")
		.includes("is-style-circle-outline");
	const isStyleSquareOutline = blockClassName
		?.split(" ")
		.includes("is-style-square-outline");
	const normalStateColors = (
		<>
			<ColorSettings attrKey="iconColor" label={__("Icon Color")} />
			{!isStyleCircleOutline && !isStyleSquareOutline && (
				<ColorSettingsWithGradient
					attrBackgroundKey="iconBackground"
					attrGradientKey="iconGradientBackground"
					label={__("Icon Background")}
				/>
			)}
		</>
	);
	const hoverStateColors = (
		<>
			<ColorSettings attrKey="iconHoverColor" label={__("Icon Color")} />
			{!isStyleCircleOutline && !isStyleSquareOutline && (
				<ColorSettingsWithGradient
					attrBackgroundKey="iconHoverBackground"
					attrGradientKey="iconHoverGradientBackground"
					label={__("Icon Background")}
				/>
			)}
		</>
	);
	return (
		<>
			<InspectorControls>
				<PanelBody>
					<HeightControl
						value={size}
						label={__("Icon Size", "ultimate-blocks")}
						onChange={(newSize) => setAttributes({ size: newSize })}
					/>
					<RangeControl
						max={180}
						min={-180}
						allowReset
						resetFallbackValue={0}
						value={iconRotation}
						defaultValue={0}
						label={__("Rotation", "ultimate-blocks")}
						onChange={(newSize) => setAttributes({ iconRotation: newSize })}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				<TabsPanelControl
					tabs={[
						{
							name: "normalState",
							title: __("Normal", "ultimate-blocks"),
							component: normalStateColors,
						},
						{
							name: "hoverState",
							title: __("Hover", "ultimate-blocks"),
							component: hoverStateColors,
						},
					]}
				/>
			</InspectorControls>
			<InspectorControls group="border">
				<BorderControl
					showDefaultBorder
					showDefaultBorderRadius
					attrBorderRadiusKey="borderRadius"
					attrBorderKey="border"
					borderLabel={__("Border", "ultimate-blocks")}
					borderRadiusLabel={__("Border Radius", "ultimate-blocks")}
				/>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody
					title={__("Dimension Settings", "ultimate-blocks")}
					initialOpen={false}
				>
					<SpacingControl
						showByDefault
						attrKey="padding"
						label={__("Padding", "ultimate-blocks")}
					/>
					<SpacingControl
						minimumCustomValue={-Infinity}
						showByDefault
						attrKey="margin"
						label={__("Margin", "ultimate-blocks")}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
export default CustomInspectorControls;
