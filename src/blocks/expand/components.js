import { useEffect } from "react";
import { getDescendantBlocks, getParentBlock } from "../../common";

import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import { SpacingControl } from "../components";
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	TextControl,
	ToggleControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { getStyles } from "./get-styles";
export function ExpandRoot(props) {
	const {
		block,
		updateBlockAttributes,
		attributes,
		setAttributes,
		isSelected,
		rootBlockClientId,
	} = props;

	const {
		blockID,
		allowScroll,
		scrollOption,
		scrollOffset,
		scrollTarget,
		scrollTargetType,
	} = attributes;
	const blockProps = useBlockProps();
	const rootBlock = getParentBlock(rootBlockClientId, "core/block");

	const selectedBlockID = useSelect((select) => {
		return (
			select("core/block-editor") || select("core/editor")
		).getSelectedBlockClientId();
	}, []);

	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}
	}, []);
	useEffect(() => {
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);

	const showPreviewText = __("show more");

	const hidePreviewText = __("show less");

	const fullVersionVisibility =
		selectedBlockID === block.clientId ||
		getDescendantBlocks(block)
			.map((b) => b.clientId)
			.includes(selectedBlockID);

	if (
		block.innerBlocks[1] &&
		block.innerBlocks[1].attributes.isVisible !== fullVersionVisibility &&
		!rootBlock
	) {
		updateBlockAttributes(block.innerBlocks[1].clientId, {
			isVisible: fullVersionVisibility,
		});
	}
	const styles = getStyles(attributes);
	return (
		<div {...blockProps}>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Scroll Settings")}>
							<PanelRow>
								<label htmlFor="ub_expand_toggle_display">
									{__("Allow scrolling")}
								</label>
								<ToggleControl
									id="ub_expand_toggle_display"
									checked={allowScroll}
									onChange={() => setAttributes({ allowScroll: !allowScroll })}
								/>
							</PanelRow>
							{allowScroll && (
								<>
									<SelectControl
										label={__("Scroll offset adjustment")}
										value={scrollOption}
										options={[
											{
												label: __(
													"Relative to first available fixed/sticky element",
												),
												value: "auto",
											},
											{
												label: __("Relative to a specific element"),
												value: "namedelement",
											},
											{ label: __("Fixed height"), value: "fixedamount" },
										]}
										onChange={(scrollOption) => setAttributes({ scrollOption })}
									/>
									{scrollOption === "namedelement" && (
										<>
											<SelectControl
												label={__("Scroll reference name type")}
												value={scrollTargetType}
												options={["id", "class", "element"].map((a) => ({
													label: __(a),
													value: a,
												}))}
												onChange={(scrollTargetType) =>
													setAttributes({ scrollTargetType })
												}
											/>
											<TextControl
												label={__("Reference element for scroll offset")}
												value={scrollTarget}
												onChange={(scrollTarget) =>
													setAttributes({ scrollTarget })
												}
											/>
										</>
									)}
									{scrollOption === "fixedamount" && (
										<RangeControl
											label={__("Scroll offset (pixels)")}
											value={scrollOffset}
											onChange={(scrollOffset) =>
												setAttributes({ scrollOffset })
											}
											min={0}
											max={200}
											allowReset
										/>
									)}
								</>
							)}
						</PanelBody>
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
			)}
			<div className="ub-expand" style={styles}>
				<InnerBlocks
					templateLock={"all"}
					template={[
						[
							"ub/expand-portion",
							{
								displayType: "partial",
								clickText: showPreviewText,
								isVisible: true,
							},
						],
						[
							"ub/expand-portion",
							{
								displayType: "full",
								clickText: hidePreviewText,
								isVisible: false,
							},
						],
					]}
				/>
			</div>
		</div>
	);
}
