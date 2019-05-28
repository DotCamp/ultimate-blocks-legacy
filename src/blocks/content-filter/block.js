import './editor.scss';
import './style.scss';

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const {
	InnerBlocks,
	InspectorControls,
	RichText,
	PanelColorSettings
} = wp.editor;

const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

const { CheckboxControl, TextControl, PanelBody } = wp.components;

import icon from './icon';
import { Component } from 'react';

class PanelContent extends Component {
	constructor(props) {
		super(props);

		this.editFilterArray = this.editFilterArray.bind(this);
		this.deleteFilterArrayItem = this.deleteFilterArrayItem.bind(this);
		this.editAvailableFilters = this.editAvailableFilters.bind(this);
	}
	editFilterArray(item, pos) {
		const { attributes, setAttributes } = this.props;

		const { filterArray } = attributes;

		const newFilterArray = [
			...filterArray.slice(0, pos),
			item,
			...filterArray.slice(pos + 1)
		];

		setAttributes({
			filterArray: newFilterArray
		});
	}

	editAvailableFilters(item, pos) {
		const { block, attributes, updateBlockAttributes } = this.props;

		const { filterArray } = attributes;

		block.innerBlocks.forEach(panel =>
			updateBlockAttributes(panel.clientId, {
				availableFilters: [
					...filterArray.slice(0, pos),
					item,
					...filterArray.slice(pos + 1)
				]
			})
		);
	}

	deleteFilterArrayItem(pos) {
		const {
			block,
			attributes,
			setAttributes,
			updateBlockAttributes
		} = this.props;
		const { filterArray } = attributes;

		const newFilterArray = [
			...filterArray.slice(0, pos),
			...filterArray.slice(pos + 1)
		];
		setAttributes({
			filterArray: newFilterArray
		});

		block.innerBlocks.forEach(panel =>
			updateBlockAttributes(panel.clientId, {
				availableFilters: newFilterArray
			})
		);
	}

	render() {
		const {
			isSelected,
			attributes,
			setAttributes,
			block,
			updateBlockAttributes,
			insertBlock
		} = this.props;
		const {
			filterArray,
			buttonColor,
			buttonTextColor,
			activeButtonColor,
			activeButtonTextColor,
			allowReset,
			resetButtonLabel
		} = attributes;

		const newChildBlock = createBlock('ub/content-filter-entry', {
			availableFilters: filterArray,
			selectedFilters: filterArray.map(category =>
				category.canUseMultiple
					? Array(category.filters.length).fill(false)
					: -1
			),
			buttonTextColor: buttonTextColor,
			buttonColor: buttonColor
		});

		const newAvailableFilters = (item, pos) => [
			...filterArray.slice(0, pos),
			item,
			...filterArray.slice(pos + 1)
		];

		const newSelectedFilters = (
			selectedFilterArr,
			currentSelection,
			filterCategoryIndex,
			deletedFilterPos
		) => [
			...selectedFilterArr.slice(0, filterCategoryIndex),
			currentSelection.canUseMultiple
				? [
						...selectedFilterArr[filterCategoryIndex].slice(
							0,
							deletedFilterPos
						),
						...selectedFilterArr[filterCategoryIndex].slice(
							deletedFilterPos + 1
						)
				  ]
				: selectedFilterArr[filterCategoryIndex] === deletedFilterPos
				? -1
				: selectedFilterArr[filterCategoryIndex] > deletedFilterPos
				? (selectedFilterArr[filterCategoryIndex] - 1).toString()
				: selectedFilterArr[filterCategoryIndex],
			...selectedFilterArr.slice(filterCategoryIndex + 1)
		];

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__('Filter Colors')}
						initialOpen={false}
						colorSettings={[
							{
								value: buttonColor,
								onChange: colorValue => {
									setAttributes({
										buttonColor: colorValue
									});
									block.innerBlocks.forEach(panel =>
										updateBlockAttributes(panel.clientId, {
											buttonColor: colorValue
										})
									);
								},
								label: __('Filter Tag Color')
							},
							{
								value: buttonTextColor,
								onChange: colorValue => {
									setAttributes({
										buttonTextColor: colorValue
									});
									block.innerBlocks.forEach(panel =>
										updateBlockAttributes(panel.clientId, {
											buttonTextColor: colorValue
										})
									);
								},
								label: __('Filter Tag Text Color')
							},
							{
								value: activeButtonColor,
								onChange: colorValue => {
									setAttributes({
										activeButtonColor: colorValue
									});
								},
								label: __('Active Filter Tag Color')
							},
							{
								value: activeButtonTextColor,
								onChange: colorValue => {
									setAttributes({
										activeButtonTextColor: colorValue
									});
								},
								label: __('Active Filter Tag Text Color')
							}
						]}
					/>
					<PanelBody title="Reset Button" initialOpen={false}>
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
					</PanelBody>
				</InspectorControls>
			),
			<div className="ub-content-filter-main">
				{filterArray.length > 0 &&
					filterArray.map((f, i) => (
						<div className="ub-content-filter-category">
							<div className="ub-content-filter-category-top">
								<span
									title={__('Delete This Filter Category')}
									onClick={() => {
										this.deleteFilterArrayItem(i);
										block.innerBlocks.forEach(panel =>
											updateBlockAttributes(
												panel.clientId,
												{
													selectedFilters: [
														...panel.attributes.selectedFilters.slice(
															0,
															i
														),
														...panel.attributes.selectedFilters.slice(
															i + 1
														)
													]
												}
											)
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
									onChange={newVal => {
										let current = Object.assign({}, f);
										current.category = newVal;
										this.editFilterArray(current, i);
										this.editAvailableFilters(current, i);
									}}
								/>
							</div>
							{f.filters.map((filter, j) => (
								<div
									className="ub-content-filter-tag"
									style={{
										backgroundColor: buttonColor,
										color: buttonTextColor
									}}
								>
									<div className="ub-content-filter-tag-top">
										<span
											title={__('Delete This Filter')}
											onClick={() => {
												let current = Object.assign(
													{},
													f
												);
												current.filters = [
													...current.filters.slice(
														0,
														j
													),
													...current.filters.slice(
														j + 1
													)
												];
												this.editFilterArray(
													current,
													i
												);
												block.innerBlocks.forEach(
													panel => {
														updateBlockAttributes(
															panel.clientId,
															{
																availableFilters: newAvailableFilters(
																	current,
																	i
																),
																selectedFilters: newSelectedFilters(
																	panel
																		.attributes
																		.selectedFilters,
																	current,
																	i,
																	j
																)
															}
														);
													}
												);
											}}
											class="dashicons dashicons-dismiss"
										/>
									</div>
									<RichText
										placeholder="filter name"
										value={filter}
										onChange={newVal => {
											let current = Object.assign({}, f);
											current.filters = [
												...current.filters.slice(0, j),
												newVal,
												...current.filters.slice(j + 1)
											];

											this.editFilterArray(current, i);
											this.editAvailableFilters(
												current,
												i
											);
										}}
									/>
								</div>
							))}
							<button
								style={{
									backgroundColor: buttonColor,
									color: buttonTextColor
								}}
								onClick={() => {
									let current = Object.assign({}, f);
									current.filters.push('');
									this.editFilterArray(current, i);
									block.innerBlocks.forEach(panel => {
										let childBlockAttributes = {
											availableFilters: newAvailableFilters(
												current,
												i
											)
										};

										if (current.canUseMultiple) {
											childBlockAttributes.selectedFilters = [
												...panel.attributes.selectedFilters.slice(
													0,
													i
												),
												[
													...panel.attributes
														.selectedFilters[i],
													false
												],
												...panel.attributes.selectedFilters.slice(
													i + 1
												)
											];
										}

										updateBlockAttributes(
											panel.clientId,
											childBlockAttributes
										);
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
										this.editFilterArray(current, i);
										block.innerBlocks.forEach(panel =>
											updateBlockAttributes(
												panel.clientId,
												{
													availableFilters: newAvailableFilters(
														current,
														i
													),
													selectedFilters: [
														...panel.attributes.selectedFilters.slice(
															0,
															i
														),
														current.canUseMultiple
															? Array(
																	current
																		.filters
																		.length
															  ).fill(false)
															: -1,
														...panel.attributes.selectedFilters.slice(
															i + 1
														)
													]
												}
											)
										);
									}}
								/>
								Allow multiple selections
							</label>
						</div>
					))}
				<button
					onClick={() => {
						setAttributes({
							filterArray: [
								...filterArray,
								{
									category: '',
									filters: [],
									canUseMultiple: false
								}
							]
						});

						block.innerBlocks.forEach(panel =>
							updateBlockAttributes(panel.clientId, {
								selectedFilters: [
									...panel.attributes.selectedFilters,
									-1
								]
							})
						);
					}}
				>
					Add New Category
				</button>
				<br />
				<InnerBlocks
					templateLock={false}
					allowedBlocks={['ub/content-filter-entry']}
				/>
				{filterArray.length > 0 &&
					filterArray.filter(f => f.filters.length > 0).length >
						0 && (
						<button
							onClick={() =>
								insertBlock(
									newChildBlock,
									block.innerBlocks.length,
									block.clientId
								)
							}
						>
							Add new content
						</button>
					)}
			</div>
		];
	}
}

registerBlockType('ub/content-filter', {
	title: __('Content Filter'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Filtering')],
	attributes: {
		filterArray: {
			type: 'array',
			default: [] // new objects should be { category: '', filters: [], canUseMultiple: false }
		},
		buttonColor: {
			type: 'string',
			default: '#eeeeee'
		},
		buttonTextColor: {
			type: 'string',
			default: '#000000'
		},
		activeButtonColor: {
			type: 'string',
			default: '#fcb900'
		},
		activeButtonTextColor: {
			type: 'string',
			default: '#ffffff'
		},
		allowReset: {
			type: 'boolean',
			default: false
		},
		resetButtonLabel: {
			type: 'string',
			default: 'Reset'
		}
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock } = select('core/editor');

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId)
			};
		}),
		withDispatch(dispatch => {
			const { updateBlockAttributes, insertBlock } = dispatch(
				'core/editor'
			);

			return {
				updateBlockAttributes,
				insertBlock
			};
		})
	])(PanelContent),

	save(props) {
		const {
			filterArray,
			buttonColor,
			buttonTextColor,
			activeButtonColor,
			activeButtonTextColor,
			allowReset,
			resetButtonLabel
		} = props.attributes;

		const currentSelection = filterArray.map(f =>
			f.canUseMultiple ? Array(f.filters.length).fill(false) : -1
		);
		return (
			<div data-currentSelection={JSON.stringify(currentSelection)}>
				{filterArray.length > 0 &&
					filterArray.map((f, i) => (
						<div
							className="ub-content-filter-category"
							data-canUseMultiple={f.canUseMultiple}
						>
							<RichText.Content
								tagName="div"
								className="ub-content-filter-category-name"
								value={f.category}
							/>
							{f.filters.map((filter, j) => (
								<div
									data-tagIsSelected={'false'} //can be updated
									data-categoryNumber={i}
									data-filterNumber={j}
									data-normalColor={buttonColor}
									data-normalTextColor={buttonTextColor}
									data-activeColor={activeButtonColor}
									data-activeTextColor={activeButtonTextColor}
									className="ub-content-filter-tag"
									style={{
										backgroundColor: buttonColor,
										color: buttonTextColor
									}}
								>
									<RichText.Content value={filter} />
								</div>
							))}
						</div>
					))}
				{allowReset && (
					<button className="ub-content-filter-reset">
						{resetButtonLabel}
					</button>
				)}
				<InnerBlocks.Content />
			</div>
		);
	}
});
