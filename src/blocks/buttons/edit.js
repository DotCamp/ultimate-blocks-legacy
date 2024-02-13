import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	JustifyContentControl,
	BlockControls,
} from "@wordpress/block-editor";
import { useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { getStyles } from "./get-styles";
import { CustomToggleGroupControl } from "../components";
import { AVAILABLE_JUSTIFICATIONS, AVAILABLE_ORIENTATION } from "../../common";
import { createBlock } from "@wordpress/blocks";

const ALLOWED_BLOCKS = ["ub/single-button"];
const template = [["ub/single-button", {}, []]];
function Edit(props) {
	const { attributes, setAttributes, clientId } = props;
	const { align, orientation, isFlexWrap, buttons } = attributes;
	const flexWrapClass = isFlexWrap ? " ub-flex-wrap" : "";

	const blockProps = useBlockProps({
		className: `ub-buttons align-button-${align} orientation-button-${orientation}${flexWrapClass}`,
		style: getStyles(props.attributes),
	});
	const { replaceBlock } = useDispatch("core/block-editor");
	useEffect(() => {
		if (buttons.length > 0) {
			const singleButtonBlocks = buttons.map((b) => {
				return createBlock("ub/single-button", b, []);
			});
			replaceBlock(
				clientId,
				createBlock(
					"ub/button",
					{ ...attributes, buttons: [] },
					singleButtonBlocks,
				),
			);
		}
	}, []);
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
			<div {...blockProps}>
				<InnerBlocks template={template} allowedBlocks={ALLOWED_BLOCKS} />
			</div>
		</>
	);
}

export default Edit;
