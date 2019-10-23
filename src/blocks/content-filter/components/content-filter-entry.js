import icon from '../icon';

import { Component } from 'react';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { InnerBlocks } = wp.blockEditor || wp.editor;

class Dropdown extends Component {
	//adapted from Ben Bud, https://stackoverflow.com/a/42234988
	constructor(props) {
		super(props);

		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.state = { showDropdown: false };
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.setState({ showDropdown: false });
		}
	}

	render() {
		const { showDropdown } = this.state;
		const { attributes, setAttributes } = this.props;
		const {
			buttonColor,
			buttonTextColor,
			availableFilters,
			selectedFilters
		} = attributes;

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

		return (
			<div
				ref={this.setWrapperRef}
				className="ub-content-filter-dropdown-container"
			>
				<button
					className="ub-content-assigned-filter-tag"
					onClick={() => {
						if (dropdownContent.length > 0) {
							this.setState({
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
											availableFilters[item.category]
												.canUseMultiple
												? [
														...selectedFilters[
															item.category
														].slice(0, item.index),
														!selectedFilters[
															item.category
														][item.index],
														...selectedFilters[
															item.category
														].slice(item.index + 1)
												  ]
												: item.index,
											...selectedFilters.slice(
												item.category + 1
											)
										]
									});
									this.setState({ showDropdown: false });
								}}
							>
								{item.name}
							</li>
						))}
					</ul>
				)}
			</div>
		);
	}
}

registerBlockType('ub/content-filter-entry', {
	title: __('Content Filter Entry'),
	parent: __('ub/content-filter'),
	icon: icon,
	category: 'ultimateblocks',
	attributes: {
		availableFilters: {
			type: 'array',
			default: [] //get list of filters from parent block
		},
		selectedFilters: {
			type: 'array',
			default: []
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
	edit(props) {
		const { setAttributes, attributes } = props;

		const {
			availableFilters,
			selectedFilters,
			buttonColor,
			buttonTextColor
		} = attributes;

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
					.map((a, i) => ({ val: a, index: i }))
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

		return (
			<div className="ub-content-filter-panel">
				<InnerBlocks templateLock={false} />
				<div className="ub-content-assigned-filter-tag-area">
					{tagList
						.filter(
							tag => tag != null && tag.hasOwnProperty('name')
						)
						.map(tag => (
							<div className="ub-content-assigned-filter-tag">
								<div className="ub-content-filter-tag-deselect">
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
							</div>
						))}
					<Dropdown
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</div>
			</div>
		);
	},
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
					.map((a, i) => ({ val: a, index: i }))
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
				{/*<p>
					Categories:{' '}
					{tagList.map((filter, i) => (
						<span>{`${filter.name}${
							tagList.length - 1 > i ? ', ' : ''
						}`}</span>
					))}
				</p>*/}
				<InnerBlocks.Content />
			</div>
		);
	}
});

registerBlockType('ub/content-filter-entry-block', {
	title: __('Content Filter Entry'),
	parent: __('ub/content-filter-block'),
	icon: icon,
	category: 'ultimateblocks',
	attributes: {
		availableFilters: {
			type: 'array',
			default: [] //get list of filters from parent block
		},
		selectedFilters: {
			type: 'array',
			default: []
		},
		buttonColor: {
			type: 'string',
			default: '#aaaaaa'
		},
		buttonTextColor: {
			type: 'string',
			default: '#000000'
		},
		initiallyShow: {
			type: 'boolean',
			default: true
		}
	},
	supports: {
		inserter: false,
		reusable: false
	},
	edit(props) {
		const { setAttributes, attributes } = props;

		const {
			availableFilters,
			selectedFilters,
			buttonColor,
			buttonTextColor
		} = attributes;

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
					.map((a, i) => ({ val: a, index: i }))
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

		return (
			<div className="ub-content-filter-panel">
				<InnerBlocks templateLock={false} />
				<div className="ub-content-assigned-filter-tag-area">
					{tagList
						.filter(
							tag => tag != null && tag.hasOwnProperty('name')
						)
						.map(tag => (
							<div className="ub-content-assigned-filter-tag">
								<div className="ub-content-filter-tag-deselect">
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
							</div>
						))}
					<Dropdown
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</div>
			</div>
		);
	},
	save: () => <InnerBlocks.Content />
});
