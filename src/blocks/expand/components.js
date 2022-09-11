import { useEffect } from "react";
import { getDescendantBlocks } from "../../common";

const { __ } = wp.i18n;
const { InnerBlocks, InspectorControls } = wp.blockEditor || wp.editor;

const {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	TextControl,
	ToggleControl,
} = wp.components;
const { useSelect } = wp.data;

export function ExpandRoot(props) {
	const {
		block,
		updateBlockAttributes,
		attributes,
		setAttributes,
		isSelected,
		getBlock,
		getClientIdsWithDescendants,
	} = props;

	const {
		blockID,
		allowScroll,
		scrollOption,
		scrollOffset,
		scrollTarget,
		scrollTargetType,
	} = attributes;

	const selectedBlockID = useSelect((select) => {
		return (
			select("core/block-editor") || select("core/editor")
		).getSelectedBlockClientId();
	}, []);

	useEffect(() => {
		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					ID !== block.clientId &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

	const showPreviewText = __("show more");

	const hidePreviewText = __("show less");

	const fullVersionVisibility =
		selectedBlockID === block.clientId ||
		getDescendantBlocks(block)
			.map((b) => b.clientId)
			.includes(selectedBlockID);

	if (
		block.innerBlocks[1] &&
		block.innerBlocks[1].attributes.isVisible !== fullVersionVisibility
	) {
		updateBlockAttributes(block.innerBlocks[1].clientId, {
			isVisible: fullVersionVisibility,
		});
	}

	return (
		<>
			{isSelected && (
				<InspectorControls>
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
												"Relative to first available fixed/sticky element"
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
										onChange={(scrollOffset) => setAttributes({ scrollOffset })}
										min={0}
										max={200}
										allowReset
									/>
								)}
							</>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			<div className="ub-expand">
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
		</>
	);
}
