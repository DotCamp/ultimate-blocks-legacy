import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	JustifyContentControl,
	BlockControls,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { getStyles } from "./get-styles";
import { CustomToggleGroupControl, SpacingControl } from "../components";
import { AVAILABLE_JUSTIFICATIONS, AVAILABLE_ORIENTATION } from "../../common";

const ALLOWED_BLOCKS = ["ub/single-button"];
const template = [["ub/single-button", {}, []]];
function Edit(props) {
	const { attributes, setAttributes } = props;
	const { align, orientation, isFlexWrap } = attributes;
	const flexWrapClass = isFlexWrap ? " ub-flex-wrap" : "";

	const blockProps = useBlockProps({
		className: `ub-buttons align-button-${align} orientation-button-${orientation}${flexWrapClass}`,
		style: getStyles(props.attributes),
	});

	return (
		<>
			<BlockControls group="block">
				<JustifyContentControl
					value={align}
					onChange={(next) => {
						setAttributes({ align: next });
					}}
				/>
			</BlockControls>
			<>
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
						<SpacingControl
							showByDefault
							sides={["all"]}
							attrKey="blockSpacing"
							label={__("Block Spacing", "ultimate-blocks")}
						/>
					</PanelBody>
				</InspectorControls>
				<InspectorControls>
					<PanelBody title={__("Layout", "ultimate-blocks")}>
						<div className="ub-justification-control">
							<CustomToggleGroupControl
								options={AVAILABLE_JUSTIFICATIONS}
								attributeKey="align"
								label={__("Justification", "ultimate-blocks")}
							/>
							<CustomToggleGroupControl
								options={AVAILABLE_ORIENTATION}
								attributeKey="orientation"
								label={__("Orientation", "ultimate-blocks")}
							/>
						</div>
						<ToggleControl
							checked={isFlexWrap}
							label={__("Allow to wrap to multiple lines", "ultimate-blocks")}
							onChange={() => setAttributes({ isFlexWrap: !isFlexWrap })}
						/>
					</PanelBody>
				</InspectorControls>
			</>
			<div {...blockProps}>
				<InnerBlocks template={template} allowedBlocks={ALLOWED_BLOCKS} />
			</div>
		</>
	);
}

export default Edit;