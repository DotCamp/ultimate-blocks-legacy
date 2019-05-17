import icon from '../icon';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { InnerBlocks } = wp.editor;

const { withState, compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

registerBlockType('ub/content-filter-entry', {
	title: __('Content Filter Entry'),
	parent: __('ub/content-filter'),
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
		withState({ showDropdown: false })
	])(function(props) {
		const {
			setAttributes,
			block,
			removeBlock,
			showDropdown,
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

		let dropdownContent = [];
		availableFilters.forEach((category, i) => {
			if (category.filters.length > 0) {
				if (Array.isArray(selectedFilters[i])) {
					selectedFilters[i].forEach((f, j) => {
						if (f === false) {
							dropdownContent.push({
								name: availableFilters[i].filters[j],
								category: i,
								index: j
							});
						}
					});
				} else {
					if (selectedFilters[i] === -1) {
						availableFilters[i].filters.forEach((f, j) => {
							dropdownContent.push({
								name: f,
								category: i,
								index: j
							});
						});
					}
				}
			}
		});

		if (
			showDropdown &&
			(selectedBlock === null ||
				block.clientId !== selectedBlock.clientId)
		) {
			setState({ showDropdown: false });
		}

		return (
			<div className="ub-content-filter-panel">
				<div>
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
					<div className="ub-content-filter-dropdown-container">
						<button
							style={{
								backgroundColor: buttonColor,
								color: buttonTextColor
							}}
							onClick={() => {
								if (dropdownContent.length > 0) {
									setState({
										showDropdown: !showDropdown
									});
								}
							}}
						>
							+
						</button>
						{showDropdown && (
							<ul className="ub-content-filter-dropdown-content">
								{dropdownContent.map(item => (
									<li
										onClick={() => {
											setAttributes({
												selectedFilters: [
													...selectedFilters.slice(
														0,
														item.category
													),
													availableFilters[
														item.category
													].canUseMultiple
														? [
																...selectedFilters[
																	item
																		.category
																].slice(
																	0,
																	item.index
																),
																!selectedFilters[
																	item
																		.category
																][item.index],
																...selectedFilters[
																	item
																		.category
																].slice(
																	item.index +
																		1
																)
														  ]
														: item.index,
													...selectedFilters.slice(
														item.category + 1
													)
												]
											});
											setState({ showDropdown: false });
										}}
									>
										{item.name}
									</li>
								))}
							</ul>
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
	save(props) {
		const {
			availableFilters,
			selectedFilters,
			buttonColor,
			buttonTextColor
		} = props.attributes;

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
			} else if (selection > -1) {
				tagList.push({
					name: availableFilters[i].filters[selection],
					categoryIndex: i,
					tagIndex: selection
				});
			}
		});

		return (
			<div
				className="ub-content-filter-panel"
				data-selectedFilters={JSON.stringify(selectedFilters)}
				style={{ display: 'block' }} //to be turned into none when frontend script doesn't see any of the main block's selected filters on the child block's tags
			>
				<p>
					Categories:{' '}
					{tagList.map((filter, i) => (
						<span>{`${filter.name}${
							tagList.length - 1 > i ? ', ' : ''
						}`}</span>
					))}
				</p>
				<InnerBlocks.Content />
			</div>
		);
	}
});
