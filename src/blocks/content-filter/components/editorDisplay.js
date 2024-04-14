import { __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
	RichText,
	useBlockProps,
	BlockControls,
	JustifyContentControl,
} from "@wordpress/block-editor";

import {
	PanelBody,
	ToggleControl,
	RadioControl,
	ToolbarGroup,
} from "@wordpress/components";

import { SpacingControl } from "../../components";
import { useEffect } from "react";
import { upgradeButtonLabel } from "../../../common";
import { getStyles } from "./get-styles";

export function OldPanelContent(props) {
	function editFilterArray(item, pos) {
		const { attributes, setAttributes } = props;

		const { filterArray } = attributes;

		const newFilterArray = [
			...filterArray.slice(0, pos),
			item,
			...filterArray.slice(pos + 1),
		];

		setAttributes({
			filterArray: newFilterArray,
		});
	}

	function editAvailableFilters(item, pos) {
		const { block, attributes, updateBlockAttributes } = props;

		const { filterArray } = attributes;

		block.innerBlocks.forEach((panel) =>
			updateBlockAttributes(panel.clientId, {
				availableFilters: [
					...filterArray.slice(0, pos),
					item,
					...filterArray.slice(pos + 1),
				],
			}),
		);
	}

	function deleteFilterArrayItem(pos) {
		const { block, attributes, setAttributes, updateBlockAttributes } = props;
		const { filterArray } = attributes;

		const newFilterArray = [
			...filterArray.slice(0, pos),
			...filterArray.slice(pos + 1),
		];
		setAttributes({
			filterArray: newFilterArray,
		});

		block.innerBlocks.forEach((panel) =>
			updateBlockAttributes(panel.clientId, {
				availableFilters: newFilterArray,
			}),
		);
	}

	const {
		isSelected,
		attributes,
		setAttributes,
		block,
		updateBlockAttributes,
		insertBlock,
		replaceBlock,
	} = props;
	const {
		filterArray,
		buttonColor,
		buttonTextColor,
		activeButtonColor,
		activeButtonTextColor,
		//,allowReset,resetButtonLabel
	} = attributes;

	const newChildBlock = createBlock("ub/content-filter-entry", {
		availableFilters: filterArray,
		selectedFilters: filterArray.map((category) =>
			category.canUseMultiple ? Array(category.filters.length).fill(false) : -1,
		),
		buttonTextColor: buttonTextColor,
		buttonColor: buttonColor,
	});

	const newAvailableFilters = (item, pos) => [
		...filterArray.slice(0, pos),
		item,
		...filterArray.slice(pos + 1),
	];

	const newSelectedFilters = (
		selectedFilterArr,
		currentSelection,
		filterCategoryIndex,
		deletedFilterPos,
	) => [
		...selectedFilterArr.slice(0, filterCategoryIndex),
		currentSelection.canUseMultiple
			? [
					...selectedFilterArr[filterCategoryIndex].slice(0, deletedFilterPos),
					...selectedFilterArr[filterCategoryIndex].slice(deletedFilterPos + 1),
				]
			: selectedFilterArr[filterCategoryIndex] === deletedFilterPos
				? -1
				: selectedFilterArr[filterCategoryIndex] > deletedFilterPos
					? (selectedFilterArr[filterCategoryIndex] - 1).toString()
					: selectedFilterArr[filterCategoryIndex],
		...selectedFilterArr.slice(filterCategoryIndex + 1),
	];

	return [
		isSelected && (
			<InspectorControls>
				<PanelColorSettings
					title={__("Filter Colors")}
					initialOpen={false}
					colorSettings={[
						{
							value: buttonColor,
							onChange: (colorValue) => {
								setAttributes({
									buttonColor: colorValue,
								});
								block.innerBlocks.forEach((panel) =>
									updateBlockAttributes(panel.clientId, {
										buttonColor: colorValue,
									}),
								);
							},
							label: __("Filter Tag Color"),
						},
						{
							value: buttonTextColor,
							onChange: (colorValue) => {
								setAttributes({
									buttonTextColor: colorValue,
								});
								block.innerBlocks.forEach((panel) =>
									updateBlockAttributes(panel.clientId, {
										buttonTextColor: colorValue,
									}),
								);
							},
							label: __("Filter Tag Text Color"),
						},
						{
							value: activeButtonColor,
							onChange: (colorValue) => {
								setAttributes({
									activeButtonColor: colorValue,
								});
							},
							label: __("Active Filter Tag Color"),
						},
						{
							value: activeButtonTextColor,
							onChange: (colorValue) => {
								setAttributes({
									activeButtonTextColor: colorValue,
								});
							},
							label: __("Active Filter Tag Text Color"),
						},
					]}
				/>
				{/*<PanelBody title="Reset Button" initialOpen={false}>
						<CheckboxControl
							label={__('Allow Resetting of Filter Selection')}
							checked={allowReset}
							onChange={() =>
								setAttributes({ allowReset: !allowReset })
							}
						/>
						{allowReset && (
							<TextControl
								label={__('Reset button text')}
								placeholder="Reset button text"
								value={resetButtonLabel}
								onChange={value =>
									setAttributes({ resetButtonLabel: value })
								}
							/>
						)}
					</PanelBody>*/}
			</InspectorControls>
		),
		<div className="ub-content-filter-main">
			<button
				onClick={() => {
					replaceBlock(
						block.clientId,
						createBlock(
							"ub/content-filter-block",
							{
								filterArray,
								buttonColor,
								buttonTextColor,
								activeButtonColor,
								activeButtonTextColor,
							},
							block.innerBlocks.map((innerBlock) =>
								createBlock(
									"ub/content-filter-entry-block",
									{
										availableFilters: filterArray,
										selectedFilters: innerBlock.attributes.selectedFilters,
										buttonColor,
										buttonTextColor,
									},
									innerBlock.innerBlocks,
								),
							),
						),
					);
				}}
			>
				{upgradeButtonLabel}
			</button>
			{filterArray.length > 0 &&
				filterArray.map((f, i) => (
					<div className="ub-content-filter-category">
						<div className="ub-content-filter-category-top">
							<span
								title={__("Delete This Filter Category")}
								onClick={() => {
									deleteFilterArrayItem(i);
									block.innerBlocks.forEach((panel) =>
										updateBlockAttributes(panel.clientId, {
											selectedFilters: [
												...panel.attributes.selectedFilters.slice(0, i),
												...panel.attributes.selectedFilters.slice(i + 1),
											],
										}),
									);
								}}
								class="dashicons dashicons-dismiss"
							/>
						</div>
						<div>
							<RichText
								className="ub-content-filter-category-name"
								placeholder="Category name"
								value={f.category}
								onChange={(newVal) => {
									let current = Object.assign({}, f);
									current.category = newVal;
									editFilterArray(current, i);
									editAvailableFilters(current, i);
								}}
							/>
						</div>
						{f.filters.map((filter, j) => (
							<div
								className="ub-content-filter-tag"
								style={{
									backgroundColor: buttonColor,
									color: buttonTextColor,
								}}
							>
								<div className="ub-content-filter-tag-top">
									<span
										title={__("Delete This Filter")}
										onClick={() => {
											let current = Object.assign({}, f);
											current.filters = [
												...current.filters.slice(0, j),
												...current.filters.slice(j + 1),
											];
											editFilterArray(current, i);
											block.innerBlocks.forEach((panel) => {
												updateBlockAttributes(panel.clientId, {
													availableFilters: newAvailableFilters(current, i),
													selectedFilters: newSelectedFilters(
														panel.attributes.selectedFilters,
														current,
														i,
														j,
													),
												});
											});
										}}
										class="dashicons dashicons-dismiss"
									/>
								</div>
								<RichText
									placeholder="filter name"
									value={filter}
									onChange={(newVal) => {
										let current = Object.assign({}, f);
										current.filters = [
											...current.filters.slice(0, j),
											newVal,
											...current.filters.slice(j + 1),
										];

										editFilterArray(current, i);
										editAvailableFilters(current, i);
									}}
								/>
							</div>
						))}
						<button
							style={{
								backgroundColor: buttonColor,
								color: buttonTextColor,
							}}
							onClick={() => {
								let current = Object.assign({}, f);
								current.filters.push("");
								editFilterArray(current, i);
								block.innerBlocks.forEach((panel) => {
									let childBlockAttributes = {
										availableFilters: newAvailableFilters(current, i),
									};

									if (current.canUseMultiple) {
										childBlockAttributes.selectedFilters = [
											...panel.attributes.selectedFilters.slice(0, i),
											[...panel.attributes.selectedFilters[i], false],
											...panel.attributes.selectedFilters.slice(i + 1),
										];
									}

									updateBlockAttributes(panel.clientId, childBlockAttributes);
								});
							}}
						>
							+
						</button>
						<br />
						<label className="ub-content-filter-checkbox">
							<input
								type="checkbox"
								checked={f.canUseMultiple}
								onClick={() => {
									let current = Object.assign({}, f);
									current.canUseMultiple = !current.canUseMultiple;
									editFilterArray(current, i);
									block.innerBlocks.forEach((panel) =>
										updateBlockAttributes(panel.clientId, {
											availableFilters: newAvailableFilters(current, i),
											selectedFilters: [
												...panel.attributes.selectedFilters.slice(0, i),
												current.canUseMultiple
													? Array(current.filters.length).fill(false)
													: -1,
												...panel.attributes.selectedFilters.slice(i + 1),
											],
										}),
									);
								}}
							/>
							{__("Allow multiple selections")}
						</label>
					</div>
				))}
			<button
				onClick={() => {
					setAttributes({
						filterArray: [
							...filterArray,
							{
								category: "",
								filters: [],
								canUseMultiple: false,
							},
						],
					});

					block.innerBlocks.forEach((panel) =>
						updateBlockAttributes(panel.clientId, {
							selectedFilters: [...panel.attributes.selectedFilters, -1],
						}),
					);
				}}
			>
				{__("Add New Category")}
			</button>
			<br />
			<InnerBlocks
				templateLock={false}
				allowedBlocks={["ub/content-filter-entry"]}
			/>
			{filterArray.length > 0 &&
				filterArray.filter((f) => f.filters.length > 0).length > 0 && (
					<button
						onClick={() =>
							insertBlock(
								newChildBlock,
								block.innerBlocks.length,
								block.clientId,
							)
						}
					>
						{__("Add new content")}
					</button>
				)}
		</div>,
	];
}

export function NewPanelContent(props) {
	function editFilterArray(item, pos) {
		const { attributes, setAttributes } = props;

		const { filterArray } = attributes;

		const newFilterArray = [
			...filterArray.slice(0, pos),
			item,
			...filterArray.slice(pos + 1),
		];

		setAttributes({ filterArray: newFilterArray });
	}

	function editAvailableFilters(item, pos) {
		const { block, attributes, updateBlockAttributes } = props;

		const { filterArray } = attributes;

		block?.innerBlocks?.forEach((panel) =>
			updateBlockAttributes(panel.clientId, {
				availableFilters: [
					...filterArray.slice(0, pos),
					item,
					...filterArray.slice(pos + 1),
				],
			}),
		);
	}

	function deleteFilterArrayItem(pos) {
		const { block, attributes, setAttributes, updateBlockAttributes } = props;
		const { filterArray } = attributes;

		const newFilterArray = [
			...filterArray.slice(0, pos),
			...filterArray.slice(pos + 1),
		];
		setAttributes({ filterArray: newFilterArray });

		block?.innerBlocks?.forEach((panel) =>
			updateBlockAttributes(panel.clientId, {
				availableFilters: newFilterArray,
			}),
		);
	}

	const { isSelected, attributes, setAttributes } = props;
	const {
		filterArray,
		buttonColor,
		buttonTextColor,
		activeButtonColor,
		activeButtonTextColor,
		blockID,
		initiallyShowAll,
		matchingOption,
		//,allowReset,resetButtonLabel
	} = attributes;
	const blockProps = useBlockProps();
	const { block, getBlock, parentID, getClientIdsWithDescendants, getBlocks } =
		useSelect((select) => {
			const {
				getBlock,
				getBlockRootClientId,
				getClientIdsWithDescendants,
				getBlocks,
			} = select("core/block-editor") || select("core/editor");

			return {
				getBlock,
				block: getBlock(props.clientId),
				parentID: getBlockRootClientId(props.clientId),
				getClientIdsWithDescendants,
				getBlocks,
			};
		});
	const newChildBlock = createBlock("ub/content-filter-entry-block", {
		availableFilters: filterArray,
		selectedFilters: filterArray.map((category) =>
			category.canUseMultiple ? Array(category.filters.length).fill(false) : -1,
		),
		buttonTextColor: buttonTextColor,
		buttonColor: buttonColor,
	});
	const { updateBlockAttributes, insertBlock } =
		useDispatch("core/block-editor");

	const newAvailableFilters = (item, pos) => [
		...filterArray.slice(0, pos),
		item,
		...filterArray.slice(pos + 1),
	];

	const newSelectedFilters = (
		selectedFilterArr,
		currentSelection,
		filterCategoryIndex,
		deletedFilterPos,
	) => [
		...selectedFilterArr.slice(0, filterCategoryIndex),
		currentSelection.canUseMultiple
			? [
					...selectedFilterArr[filterCategoryIndex].slice(0, deletedFilterPos),
					...selectedFilterArr[filterCategoryIndex].slice(deletedFilterPos + 1),
				]
			: selectedFilterArr[filterCategoryIndex] === deletedFilterPos
				? -1
				: selectedFilterArr[filterCategoryIndex] > deletedFilterPos
					? (selectedFilterArr[filterCategoryIndex] - 1).toString()
					: selectedFilterArr[filterCategoryIndex],
		...selectedFilterArr.slice(filterCategoryIndex + 1),
	];

	useEffect(() => {
		if (props.attributes.blockID === "") {
			setAttributes({
				blockID: block.clientId,
				matchingOption: "matchAny",
				activeButtonTextColor: "#ffffff",
			});
		}
	}, []);
	useEffect(() => {
		setAttributes({ blockID: block.clientId });
	}, [block.clientId]);
	const styles = getStyles(attributes);
	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup>
					<JustifyContentControl
						value={attributes.filterButtonAlignment}
						onChange={(next) => {
							setAttributes({ filterButtonAlignment: next });
						}}
					/>
				</ToolbarGroup>
			</BlockControls>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Panel Visibility")} initialOpen={false}>
							<ToggleControl
								label={__("Initially show all content panels")}
								checked={initiallyShowAll}
								onChange={() => {
									setAttributes({ initiallyShowAll: !initiallyShowAll });

									block.innerBlocks.forEach((panel) => {
										updateBlockAttributes(panel.clientId, {
											initiallyShow: !initiallyShowAll,
										});
									});
								}}
							/>
							<RadioControl
								label={__("Filter options")}
								selected={matchingOption}
								options={[
									{ label: __("Match all filters"), value: "matchAll" },
									{ label: __("Match any filter"), value: "matchAny" },
								]}
								onChange={(matchingOption) => setAttributes({ matchingOption })}
							/>
						</PanelBody>
						{/*<PanelBody title="Reset Button" initialOpen={false}>
							<CheckboxControl
								label={__('Allow Resetting of Filter Selection')}
								checked={allowReset}
								onChange={() =>
									setAttributes({ allowReset: !allowReset })
								}
							/>
							{allowReset && (
								<TextControl
									label={__('Reset button text')}
									placeholder="Reset button text"
									value={resetButtonLabel}
									onChange={value =>
										setAttributes({ resetButtonLabel: value })
									}
								/>
							)}
						</PanelBody>*/}
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelColorSettings
							title={__("Filter Colors")}
							initialOpen={false}
							colorSettings={[
								{
									value: buttonColor,
									onChange: (colorValue) => {
										setAttributes({ buttonColor: colorValue });
										block.innerBlocks.forEach((panel) =>
											updateBlockAttributes(panel.clientId, {
												buttonColor: colorValue,
											}),
										);
									},
									label: __("Filter Tag Color"),
								},
								{
									value: buttonTextColor,
									onChange: (colorValue) => {
										setAttributes({ buttonTextColor: colorValue });
										block.innerBlocks.forEach((panel) =>
											updateBlockAttributes(panel.clientId, {
												buttonTextColor: colorValue,
											}),
										);
									},
									label: __("Filter Tag Text Color"),
								},
								{
									value: activeButtonColor,
									onChange: (colorValue) =>
										setAttributes({ activeButtonColor: colorValue }),
									label: __("Active Filter Tag Color"),
								},
								{
									value: activeButtonTextColor,
									onChange: (colorValue) =>
										setAttributes({ activeButtonTextColor: colorValue }),
									label: __("Active Filter Tag Text Color"),
								},
							]}
						/>
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
			<div className="ub-content-filter-main" style={styles}>
				{filterArray.length > 0 &&
					filterArray.map((f, i) => (
						<div className="ub-content-filter-category">
							<div className="ub-content-filter-category-top">
								<span
									title={__("Delete This Filter Category")}
									onClick={() => {
										deleteFilterArrayItem(i);
										block.innerBlocks.forEach((panel) =>
											updateBlockAttributes(panel.clientId, {
												selectedFilters: [
													...panel.attributes.selectedFilters.slice(0, i),
													...panel.attributes.selectedFilters.slice(i + 1),
												],
											}),
										);
									}}
									class="dashicons dashicons-dismiss"
								/>
							</div>
							<div>
								<RichText
									className="ub-content-filter-category-name"
									placeholder="Category name"
									value={f.category}
									onChange={(newVal) => {
										let current = Object.assign({}, f);
										current.category = newVal;
										editFilterArray(current, i);
										editAvailableFilters(current, i);
									}}
								/>
							</div>
							<div className="ub-content-filter-buttons-wrapper">
								{f.filters.map((filter, j) => (
									<div
										className="ub-content-filter-tag"
										style={{
											backgroundColor: buttonColor,
											color: buttonTextColor || "inherit",
										}}
									>
										<div className="ub-content-filter-tag-top">
											<span
												title={__("Delete This Filter")}
												onClick={() => {
													let current = Object.assign({}, f);
													current.filters = [
														...current.filters.slice(0, j),
														...current.filters.slice(j + 1),
													];
													editFilterArray(current, i);
													block.innerBlocks.forEach((panel) => {
														updateBlockAttributes(panel.clientId, {
															availableFilters: newAvailableFilters(current, i),
															selectedFilters: newSelectedFilters(
																panel.attributes.selectedFilters,
																current,
																i,
																j,
															),
														});
													});
												}}
												class="dashicons dashicons-dismiss"
											/>
										</div>
										<RichText
											placeholder="filter name"
											value={filter}
											onChange={(newVal) => {
												let current = Object.assign({}, f);
												current.filters = [
													...current.filters.slice(0, j),
													newVal,
													...current.filters.slice(j + 1),
												];

												editFilterArray(current, i);
												editAvailableFilters(current, i);
											}}
										/>
									</div>
								))}
								<button
									style={{
										backgroundColor: buttonColor,
										color: buttonTextColor || "inherit",
										minWidth: "45px",
									}}
									onClick={() => {
										let current = Object.assign({}, f);
										current.filters.push("");
										editFilterArray(current, i);
										block.innerBlocks.forEach((panel) => {
											let childBlockAttributes = {
												availableFilters: newAvailableFilters(current, i),
											};

											if (current.canUseMultiple) {
												childBlockAttributes.selectedFilters = [
													...panel.attributes.selectedFilters.slice(0, i),
													[...panel.attributes.selectedFilters[i], false],
													...panel.attributes.selectedFilters.slice(i + 1),
												];
											}

											updateBlockAttributes(
												panel.clientId,
												childBlockAttributes,
											);
										});
									}}
								>
									+
								</button>
							</div>
							<br />
							<label className="ub-content-filter-checkbox">
								<input
									type="checkbox"
									checked={f.canUseMultiple}
									onClick={() => {
										let current = Object.assign({}, f);
										current.canUseMultiple = !current.canUseMultiple;
										editFilterArray(current, i);

										block.innerBlocks.forEach((panel) => {
											const { selectedFilters } = panel.attributes;

											updateBlockAttributes(panel.clientId, {
												availableFilters: newAvailableFilters(current, i),
												selectedFilters: [
													...selectedFilters.slice(0, i),
													current.canUseMultiple
														? Array(current.filters.length)
																.fill(false)
																.map((_, j) => j === selectedFilters[i])
														: selectedFilters[i].filter((f) => f === true)
																	.length > 1
															? -1
															: selectedFilters[i].findIndex((f) => f === true),
													...selectedFilters.slice(i + 1),
												],
											});
										});
									}}
								/>
								{__("Allow multiple selections")}
							</label>
						</div>
					))}
				<button
					onClick={() => {
						setAttributes({
							filterArray: [
								...filterArray,
								{
									category: "",
									filters: [],
									canUseMultiple: false,
								},
							],
						});

						block.innerBlocks.forEach((panel) =>
							updateBlockAttributes(panel.clientId, {
								selectedFilters: [...panel.attributes.selectedFilters, -1],
							}),
						);
					}}
				>
					{__("Add New Category")}
				</button>
				<br />
				<InnerBlocks
					templateLock={false}
					allowedBlocks={["ub/content-filter-entry-block"]}
				/>
				{filterArray.length > 0 &&
					filterArray.filter((f) => f.filters.length > 0).length > 0 && (
						<button
							onClick={() =>
								insertBlock(
									newChildBlock,
									block.innerBlocks.length,
									block.clientId,
								)
							}
						>
							{__("Add new content")}
						</button>
					)}
			</div>
		</div>
	);
}
