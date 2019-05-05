import icon from '../icon';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { InnerBlocks } = wp.editor;

const { withState, compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

registerBlockType('ub/content-filter-entry', {
	title: __('Content Filter Entry'),
	parent: __('ub/content-filter'),
	description: __('entry in content filter'),
	icon: icon,
	category: 'ultimateblocks',
	attributes: {
		index: {
			type: 'number',
			default: 0
		},
		availableFilters: {
			type: 'array',
			default: [] //get list of filters from parent block
		},
		selectedFilters: {
			type: 'array',
			default: []
		},
		newBlockPosition: {
			type: 'string',
			default: 'none' //may change to above or below
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
	supports: {
		inserter: false,
		reusable: false
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId, getSelectedBlock } = select(
				'core/editor'
			);
			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				blockParentId: getBlockRootClientId(clientId),
				selectedBlock: getSelectedBlock()
			};
		}),
		withDispatch(dispatch => {
			const { removeBlock, selectBlock } = dispatch('core/editor');

			return { removeBlock, selectBlock };
		}),
		withState({ showDropdown: false, selectedCategory: -1 })
	])(function(props) {
		const {
			setAttributes,
			block,
			removeBlock,
			showDropdown,
			selectedCategory,
			setState,
			selectedBlock
		} = props;

		const {
			availableFilters,
			selectedFilters,
			buttonColor,
			buttonTextColor
		} = props.attributes;

		if (availableFilters.length > 0 && selectedFilters.length === 0) {
			let newSelectedFilters = [];
			availableFilters.forEach(category => {
				newSelectedFilters.push(
					category.canUseMultiple
						? Array(category.filters.length).fill(false)
						: -1
				);
			});

			setAttributes({ selectedFilters: newSelectedFilters });
		}

		let tagList = [];

		selectedFilters.forEach((selection, i) => {
			if (Array.isArray(selection)) {
				selection
					.map((a, i) => {
						return { val: a, index: i };
					})
					.filter(a => a.val === true)
					.forEach(a =>
						tagList.push({
							name: availableFilters[i].filters[a.index],
							categoryIndex: i,
							tagIndex: a.index
						})
					);
			} else
				tagList.push(
					selection > -1
						? {
								name: availableFilters[i].filters[selection],
								categoryIndex: i,
								tagIndex: selection
						  }
						: null
				);
		});

		let defaultDropdown = [];

		availableFilters.forEach((category, i) => {
			if (
				category.filters.length > 0 &&
				(selectedFilters[i] === -1 ||
					(Array.isArray(selectedFilters[i]) &&
						selectedFilters[i].filter(s => s == false).length > 0))
			) {
				defaultDropdown.push(Object.assign(category, { index: i }));
			}
		});

		if (
			selectedBlock === null ||
			block.clientId !== selectedBlock.clientId
		) {
			if (showDropdown) {
				setState({ showDropdown: false, selectedCategory: -1 });
			}
		}

		return (
			<div className="ub-content-filter-panel">
				<div style={{ display: 'inline-block', zIndex: '1' }}>
					{tagList
						.filter(
							tag => tag != null && tag.hasOwnProperty('name')
						)
						.map(tag => (
							<button
								className="ub-content-filter-tag"
								style={{
									backgroundColor: buttonColor,
									color: buttonTextColor
								}}
							>
								<div className="ub-content-filter-tag-top">
									<span
										title={__('Deselect This Filter')}
										onClick={() => {
											const {
												categoryIndex: i,
												tagIndex: j
											} = tag;
											let newSelectedFilters = [
												...selectedFilters.slice(0, i),
												Array.isArray(
													selectedFilters[i]
												)
													? [
															...selectedFilters[
																i
															].slice(0, j),
															false,
															...selectedFilters[
																i
															].slice(j + 1)
													  ]
													: -1,
												...selectedFilters.slice(i + 1)
											];

											setAttributes({
												selectedFilters: newSelectedFilters
											});
										}}
										class="dashicons dashicons-dismiss"
									/>
								</div>
								{tag.name}
							</button>
						))}
					<div
						style={{
							display: 'inline-block',
							position: 'relative',
							zIndex: '7'
						}}
					>
						<button
							style={{
								display: 'inline-block',
								backgroundColor: buttonColor,
								color: buttonTextColor,
								height: '32px',
								width: '32px',
								margin: '5px',
								padding: '5px',
								textAlign: 'center'
							}}
							onClick={() => {
								setState({
									showDropdown: !showDropdown,
									selectedCategory: -1
								});
							}}
						>
							+
						</button>
						{showDropdown && (
							<div
								style={{
									overflowY: 'scroll',
									maxHeight: '75px',
									border: '1px solid black',
									top: '45px',
									position: 'absolute'
								}}
							>
								{selectedCategory === -1
									? defaultDropdown.map(input => (
											<div
												onClick={() => {
													setState({
														selectedCategory:
															input.index
													});
												}}
												style={{
													cursor: 'pointer',
													backgroundColor: '#ffffff',
													border: '1px solid #dddddd'
												}}
											>
												{input.category}
											</div>
									  ))
									: availableFilters[selectedCategory].filters
											.map((f, i) => {
												return { name: f, index: i };
											})
											.filter(
												(f, i) =>
													!availableFilters[
														selectedCategory
													].canUseMultiple ||
													(availableFilters[
														selectedCategory
													].canUseMultiple &&
														!selectedFilters[
															selectedCategory
														][i])
											)
											.map(filter => (
												<div
													style={{
														cursor: 'pointer',
														backgroundColor:
															'#ffffff',
														border:
															'1px solid #dddddd'
													}}
													onClick={() => {
														setAttributes({
															selectedFilters: [
																...selectedFilters.slice(
																	0,
																	selectedCategory
																),
																availableFilters[
																	selectedCategory
																].canUseMultiple
																	? [
																			...selectedFilters[
																				selectedCategory
																			].slice(
																				0,
																				filter.index
																			),
																			!selectedFilters[
																				selectedCategory
																			][
																				filter
																					.index
																			],
																			...selectedFilters[
																				selectedCategory
																			].slice(
																				filter.index +
																					1
																			)
																	  ]
																	: filter.index,
																...selectedFilters.slice(
																	selectedCategory +
																		1
																)
															]
														});
														setState({
															showDropdown: false,
															selectedCategory: -1
														});
													}}
												>
													{filter.name}
												</div>
											))}
							</div>
						)}
					</div>
				</div>
				<InnerBlocks templateLock={false} />

				<div className="ub-content-filter-top">
					<span
						title={__('Insert New Toggle Above')}
						onClick={() => {
							setAttributes({ newBlockPosition: 'above' });
						}}
						className="dashicons dashicons-plus-alt"
					/>
					<span
						title={__('Delete This Toggle')}
						onClick={() => removeBlock(block.clientId)}
						class="dashicons dashicons-dismiss"
					/>
				</div>
				<div className="ub-content-filter-bottom">
					<span
						title={__('Insert New Toggle Below')}
						onClick={() => {
							setAttributes({ newBlockPosition: 'below' });
						}}
						className="dashicons dashicons-plus-alt"
					/>
				</div>
			</div>
		);
	}),
	save() {
		return (
			<div>
				<InnerBlocks.Content />
			</div>
		);
	}
});
