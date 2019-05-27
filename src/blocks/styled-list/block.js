const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;
const { RichText, BlockControls, InspectorControls, ColorPalette } = wp.editor;
const { Toolbar, IconButton, Dropdown, PanelBody } = wp.components;
const { withState } = wp.compose;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import icon, { decreaseIndentIcon, increaseIndentIcon } from './icon';

import './editor.scss';
import './style.scss';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas, fab);

const allIcons = Object.assign(fas, fab);

const dashesToCamelcase = str =>
	str
		.split('-')
		.map(s => s[0].toUpperCase() + s.slice(1))
		.join('');

const generateIcon = (selectedIcon, size, color = 'currentColor') => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height={size}
		width={size}
		viewBox={`0, 0, ${selectedIcon.icon[0]}, ${selectedIcon.icon[1]}`}
	>
		<path fill={color} d={selectedIcon.icon[4]} />
	</svg>
);

const placeItem = (arr, item) => {
	if (arr.length === 0 || arr[0].indent === item.indent) {
		arr.push(Object.assign({}, item));
	} else if (arr[arr.length - 1].indent < item.indent) {
		if (!arr[arr.length - 1].children) {
			arr[arr.length - 1].children = [Object.assign({}, item)];
		} else placeItem(arr[arr.length - 1].children, item);
	}
};

registerBlockType('ub/styled-list', {
	title: __('Styled List'),
	icon: icon,
	category: 'ultimateblocks',
	attributes: {
		listItem: {
			type: 'array',
			default: [] //each item is an object with text, selectedIcon, and indent properties
		},
		iconColor: {
			type: 'string',
			default: '#000000'
		}
	},
	keywords: [__('List'), __('Styled List'), __('Ultimate Blocks')],
	edit: withState({
		selectedItem: -1,
		availableIcons: [],
		iconSearchTerm: '',
		recentSelection: ''
	})(function(props) {
		const {
			isSelected,
			attributes,
			setAttributes,
			setState,
			selectedItem,
			availableIcons,
			recentSelection,
			iconSearchTerm
		} = props;
		const { listItem, iconColor } = attributes;
		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map(name => allIcons[name]) });
		}

		let sortedList = [];

		listItem.forEach(item => {
			placeItem(sortedList, item);
		});

		const parseList = list => {
			return list.map(item => (
				<li>
					<span class="fa-li">
						<i
							className={`${
								Object.keys(fas)
									.filter(
										iconName =>
											fas[iconName].prefix === 'fas'
									)
									.includes(
										`fa${dashesToCamelcase(
											item.selectedIcon
										)}`
									)
									? 'fas'
									: 'fab'
							} fa-${item.selectedIcon}`}
							style={{ color: iconColor }}
						/>
					</span>
					<RichText
						placeholder={__('Add text')}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() =>
							setState({ selectedItem: item.index })
						}
						onChange={newValue => {
							let newListItem = JSON.parse(
								JSON.stringify(listItem)
							);
							newListItem[item.index].text = newValue;
							setAttributes({ listItem: newListItem });
						}}
						value={item.text}
					/>
					{item.children && (
						<ul className="fa-ul">{parseList(item.children)}</ul>
					)}
				</li>
			));
		};

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						<IconButton
							icon={decreaseIndentIcon}
							label={__('Decrease indent')}
							onClick={() => {
								if (selectedItem > 0) {
									let newListItem = JSON.parse(
										JSON.stringify(listItem)
									);
									if (newListItem[selectedItem].indent > 0) {
										newListItem[selectedItem].indent--;
									}
									setAttributes({ listItem: newListItem });
								}
							}}
						/>
						<IconButton
							icon={increaseIndentIcon}
							label={__('Increase indent')}
							onClick={() => {
								if (selectedItem > 0) {
									let newListItem = JSON.parse(
										JSON.stringify(listItem)
									);
									if (
										newListItem[selectedItem].indent <=
										newListItem[selectedItem - 1].indent
									) {
										newListItem[selectedItem].indent++;
									}
									setAttributes({ listItem: newListItem });
								}
							}}
						/>
					</Toolbar>
				</BlockControls>
			),
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Icon Options')}>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '5fr 1fr'
							}}
						>
							<p>{__('Selected icon')}</p>
							{listItem.length > 0 && (
								<Dropdown
									position="bottom right"
									renderToggle={({ isOpen, onToggle }) => (
										<IconButton
											icon={generateIcon(
												allIcons[
													`fa${dashesToCamelcase(
														listItem[0].selectedIcon
													)}`
												],
												20,
												iconColor
											)}
											label={__('Select icon for list')}
											onClick={onToggle}
											aria-expanded={isOpen}
										/>
									)}
									renderContent={() => (
										<div>
											<input
												type="text"
												value={iconSearchTerm}
												onChange={e =>
													setState({
														iconSearchTerm:
															e.target.value
													})
												}
											/>
											<br />
											{availableIcons.length > 0 &&
												availableIcons
													.filter(i =>
														i.iconName.includes(
															iconSearchTerm
														)
													)
													.map(i => (
														<IconButton
															className="ub-styled-list-available-icon"
															icon={generateIcon(
																i,
																20
															)}
															label={i.iconName}
															onClick={() => {
																let newListItem = JSON.parse(
																	JSON.stringify(
																		listItem
																	)
																);
																newListItem.forEach(
																	item => {
																		item.selectedIcon =
																			i.iconName;
																	}
																);
																setState({
																	recentSelection:
																		i.iconName
																});

																setAttributes({
																	listItem: newListItem
																});
															}}
														/>
													))}
										</div>
									)}
								/>
							)}
						</div>
						<p>{__('Icon color')}</p>
						<ColorPalette
							value={iconColor}
							onChange={colorValue =>
								setAttributes({ iconColor: colorValue })
							}
						/>
					</PanelBody>
				</InspectorControls>
			),
			<div className="ub-styled-list">
				{/*listItem.map((item, i) => (
					<div
						className="ub-styled-list-item-container"
						style={{
							paddingLeft: `${item.indent * 30}px`
						}}
					>
						<div>
							<FontAwesomeIcon
								icon={
									Object.keys(fas)
										.filter(
											iconName =>
												fas[iconName].prefix === 'fas'
										)
										.includes(
											`fa${dashesToCamelcase(
												item.selectedIcon
											)}`
										)
										? item.selectedIcon
										: ['fab', item.selectedIcon]
								}
							/>
						</div>
						<RichText
							placeholder={__('Add text')}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={() =>
								setState({ selectedItem: i })
							}
							onChange={newValue => {
								let newListItem = JSON.parse(
									JSON.stringify(listItem)
								);
								newListItem[i].text = newValue;
								setAttributes({ listItem: newListItem });
							}}
							value={item.text}
						/>
						<span
							title={__('Delete item')}
							className="dashicons dashicons-dismiss"
							onClick={() => {
								let newListItem = JSON.parse(
									JSON.stringify(listItem)
								);
								for (
									let j = i + 1;
									j < newListItem.length;
									j++
								) {
									if (j === 1) {
										newListItem[j].indent = 0;
									} else if (
										newListItem[j].indent >
										newListItem[j - 1].indent
									) {
										newListItem[j].indent--;
									} else break;
								}

								setAttributes({
									listItem: [
										...newListItem.slice(0, i),
										...newListItem.slice(i + 1)
									]
								});
							}}
						/>
					</div>
                        ))*/}

				<ul className="fa-ul">{parseList(sortedList)}</ul>
				<button
					onClick={() => {
						let newListItem = JSON.parse(JSON.stringify(listItem));
						newListItem.push({
							text: '',
							indent: 0,
							selectedIcon:
								listItem.length > 0
									? listItem[listItem.length - 1].selectedIcon
									: recentSelection !== ''
									? recentSelection
									: 'circle',
							index: listItem.length
						});
						setAttributes({ listItem: newListItem });
					}}
				>
					Add item
				</button>
			</div>
		];
	}),
	save(props) {
		const { listItem, iconColor } = props.attributes;

		let sortedList = [];

		listItem.forEach(item => {
			placeItem(sortedList, item);
		});

		const parseList = list => {
			return list.map(item => (
				<li>
					<span class="fa-li">
						<i
							className={`${
								Object.keys(fas)
									.filter(
										iconName =>
											fas[iconName].prefix === 'fas'
									)
									.includes(
										`fa${dashesToCamelcase(
											item.selectedIcon
										)}`
									)
									? 'fas'
									: 'fab'
							} fa-${item.selectedIcon}`}
							style={{ color: iconColor }}
						/>
					</span>
					<RichText.Content value={item.text} />
					{item.children && (
						<ul className="fa-ul">{parseList(item.children)}</ul>
					)}
				</li>
			));
		};

		return (
			<div>
				<ul className="fa-ul">{parseList(sortedList)}</ul>
			</div>
		);
	}
});
