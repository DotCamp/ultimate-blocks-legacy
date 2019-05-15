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

const { withState, compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

import icon from './icon';
import { Component } from 'react';

class PanelContent extends Component {
	constructor(props) {
		super(props);

		this.editFilterArray = this.editFilterArray.bind(this);
		this.deleteFilterArrayItem = this.deleteFilterArrayItem.bind(this);
		this.editAvailableFilters = this.editAvailableFilters.bind(this);
		this.getPanelTemplate = this.getPanelTemplate.bind(this);
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

	getPanelTemplate() {
		const { itemTags } = this.props.attributes;

		let result = [];

		if (itemTags.length > 0) {
			itemTags.forEach(() => {
				result.push(['ub/content-filter-entry']);
			});
		}

		return result;
	}

	render() {
		const {
			isSelected,
			attributes,
			setAttributes,
			block,
			setState,
			oldArrangement,
			updateBlockAttributes,
			insertBlock
		} = this.props;
		const {
			filterArray,
			buttonColor,
			buttonTextColor,
			itemTags
		} = attributes;

		const newBlockTarget = block.innerBlocks.filter(
			panel => panel.attributes.newBlockPosition !== 'none'
		);

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

		if (JSON.stringify(newBlockTarget) !== '[]') {
			const { index, newBlockPosition } = newBlockTarget[0].attributes;
			insertBlock(
				newChildBlock,
				newBlockPosition === 'below' ? index + 1 : index,
				block.clientId
			);
			updateBlockAttributes(newBlockTarget[0].clientId, {
				newBlockPosition: 'none'
			});
		}

		const newArrangement = JSON.stringify(
			block.innerBlocks.map(panel => panel.attributes.index)
		);

		if (newArrangement !== oldArrangement) {
			block.innerBlocks.forEach((panel, i) =>
				updateBlockAttributes(panel.clientId, {
					index: i
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		const newSelection = JSON.stringify(
			block.innerBlocks.map(panel => panel.attributes.selectedFilters)
		);

		if (newSelection !== JSON.stringify(itemTags)) {
			setAttributes({ itemTags: JSON.parse(newSelection) });
		}

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
				? ''
				: selectedFilterArr[filterCategoryIndex] > deletedFilterPos
				? (selectedFilterArr[filterCategoryIndex] - 1).toString()
				: selectedFilterArr[filterCategoryIndex],
			...selectedFilterArr.slice(filterCategoryIndex + 1)
		];

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__('Button Colors')}
						initialOpen={true}
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
								label: __('Button Background')
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
								label: __('Button Text Color')
							}
						]}
					/>
				</InspectorControls>
			),
			<div>
				{filterArray.length > 0 &&
					filterArray.map((f, i) => (
						<div
							className="ub-content-filter-category"
							style={{ padding: '3px' }}
						>
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
										style={{ textAlign: 'center' }}
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
									display: 'inline-block',
									backgroundColor: buttonColor,
									color: buttonTextColor,
									height: '38px',
									width: '38px',
									margin: '5px',
									padding: '5px',
									textAlign: 'center'
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
							<input
								type="checkbox"
								checked={f.canUseMultiple}
								onClick={() => {
									let current = Object.assign({}, f);
									current.canUseMultiple = !current.canUseMultiple;
									this.editFilterArray(current, i);
									block.innerBlocks.forEach(panel =>
										updateBlockAttributes(panel.clientId, {
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
															current.filters
																.length
													  ).fill(false)
													: -1,
												...panel.attributes.selectedFilters.slice(
													i + 1
												)
											]
										})
									);
								}}
							/>
							Allow multiple selections
						</div>
					))}
				<button
					style={{ margin: '10px', padding: '10px', color: 'black' }}
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
					Add new category
				</button>

				{filterArray.length > 0 &&
					filterArray.filter(f => f.filters.length > 0).length >
						0 && (
						<button
							style={{
								margin: '10px',
								padding: '10px',
								color: 'black'
							}}
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

				<InnerBlocks
					templateLock={false}
					allowedBlocks={['ub/content-filter-entry']}
				/>
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
		itemTags: {
			type: 'array',
			default: [] //each element should be a subarray for every child block
		},
		buttonColor: {
			type: 'string',
			default: '#aaaaaa'
		},
		buttonTextColor: {
			type: 'string',
			default: '#000000'
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
		}),
		withState({ oldArrangement: '' })
	])(PanelContent),

	save() {
		return (
			<div>
				<InnerBlocks.Content />
			</div>
		);
	}
});
