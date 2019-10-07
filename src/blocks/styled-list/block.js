const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;
const { RichText, BlockControls, InspectorControls, ColorPalette } = wp.editor;
const {
	Toolbar,
	IconButton,
	Dropdown,
	PanelBody,
	RangeControl
} = wp.components;
const { withState, compose } = wp.compose;
const { withSelect } = wp.data;

import { dashesToCamelcase } from '../../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import icon, { decreaseIndentIcon, increaseIndentIcon } from './icon';
import { Component } from 'react';

import './editor.scss';
import './style.scss';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas, fab);

const cloneObject = obj => JSON.parse(JSON.stringify(obj));

class StyledList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			list,
			updateList,
			iconColor,
			updateSelectedItem,
			increaseIndent,
			decreaseIndent,
			edits,
			iconSize
		} = this.props;

		const deleteItem = i => {
			let newList = cloneObject(list);
			let j = i + 1;
			while (
				j < newList.length &&
				newList[j].indent > newList[j - 1].indent
			) {
				newList[j].indent--;
				j++;
			}
			updateList([...newList.slice(0, i), ...newList.slice(i + 1)]);
		};

		return (
			<ul className="fa-ul" key={edits}>
				{list.map((item, i) => (
					<li
						style={{
							left: `${item.indent + 0.5}em`,
							width: `calc(100% - ${item.indent + 0.5}em)`
						}}
						onKeyDown={e => {
							switch (e.key) {
								case 'Tab':
									e.preventDefault();
									if (i > 0) {
										if (e.shiftKey) {
											decreaseIndent(i);
										} else {
											increaseIndent(i);
										}
									}
									break;
								case 'Backspace':
								case 'Delete':
									if (
										item.text.length === 0 &&
										list.length > 1
									) {
										deleteItem(i);
									}
									break;
								default:
									break;
							}
						}}
					>
						<div>
							<span
								className="fa-li"
								style={{
									fontSize: `${0.4 + iconSize * 0.1}em`,
									lineHeight:
										iconSize < 5
											? 4 - (iconSize - 1) * 0.6
											: 2 - (iconSize - 5) * 0.2
								}}
							>
								<FontAwesomeIcon
									icon={
										Object.keys(fas)
											.filter(
												iconName =>
													fas[iconName].prefix ===
													'fas'
											)
											.includes(
												`fa${dashesToCamelcase(
													item.selectedIcon
												)}`
											)
											? item.selectedIcon
											: ['fab', item.selectedIcon]
									}
									color={iconColor}
								/>
							</span>
							<RichText
								className={'styled-list-item'}
								style={{
									width: `calc(100% - ${item.indent + 0.5}em)`
								}}
								placeholder={__('List item')}
								value={item.text}
								multiline={false}
								onChange={newValue => {
									let newList = cloneObject(list);
									newList[i].text = newValue;
									updateList(newList);
								}}
								unstableOnFocus={_ => updateSelectedItem(i)}
								onSplit={(before, after) => {
									updateList([
										...list.slice(0, i),
										Object.assign(cloneObject(list[i]), {
											text: before
										}),
										Object.assign(cloneObject(list[i]), {
											text: after
										}),
										...list.slice(i + 1)
									]);
								}}
							/>
							<div
								className="dashicons dashicons-trash"
								onClick={_ => deleteItem(i)}
							/>
						</div>
					</li>
				))}
			</ul>
		);
	}
}

const allIcons = Object.assign(fas, fab);

registerBlockType('ub/styled-list', {
	title: __('Styled List'),
	icon: icon,
	category: 'ultimateblocks',
	attributes: {
		blockID: {
			type: 'string',
			default: ''
		},
		listItem: {
			type: 'array',
			default: Array(3).fill({
				text: '',
				selectedIcon: 'check',
				indent: 0
			})
		},
		iconColor: {
			type: 'string',
			default: '#000000'
		},
		iconSize: {
			type: 'number',
			default: 5
		}
	},
	keywords: [__('List'), __('Styled List'), __('Ultimate Blocks')],
	edit: compose([
		withState({
			selectedItem: -1,
			availableIcons: [],
			iconSearchTerm: '',
			recentSelection: '',
			edits: 0
		}),
		withSelect((select, ownProps) => ({
			block: select('core/editor').getBlock(ownProps.clientId)
		}))
	])(function(props) {
		const {
			block,
			isSelected,
			attributes,
			setAttributes,
			setState,
			selectedItem,
			availableIcons,
			iconSearchTerm,
			edits
		} = props;
		const { listItem, iconColor, iconSize, blockID } = attributes;

		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map(name => allIcons[name]) });
		}

		const increaseIndent = itemNumber => {
			let newListItem = cloneObject(listItem);
			if (
				newListItem[itemNumber].indent <=
				newListItem[itemNumber - 1].indent
			) {
				newListItem[itemNumber].indent++;
			}
			setAttributes({ listItem: newListItem });
			setState({ edits: edits + 1 });
		};

		const decreaseIndent = itemNumber => {
			let newListItem = cloneObject(listItem);
			if (newListItem[itemNumber].indent > 0) {
				newListItem[itemNumber].indent--;
				let i = itemNumber + 1;

				while (
					i < newListItem.length &&
					newListItem[i - 1].indent + 1 < newListItem[i].indent
				) {
					newListItem[i].indent--;
					i++;
				}
			}
			setAttributes({ listItem: newListItem });
			setState({ edits: edits + 1 });
		};

		if (blockID !== block.clientId) {
			setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						<IconButton
							icon={decreaseIndentIcon}
							label={__('Decrease indent')}
							onClick={() => {
								if (selectedItem > 0) {
									decreaseIndent(selectedItem);
								}
							}}
						/>
						<IconButton
							icon={increaseIndentIcon}
							label={__('Increase indent')}
							onClick={() => {
								if (selectedItem > 0) {
									increaseIndent(selectedItem);
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
											icon={
												<FontAwesomeIcon
													icon={
														Object.keys(fas)
															.filter(
																iconName =>
																	fas[
																		iconName
																	].prefix ===
																	'fas'
															)
															.includes(
																`fa${dashesToCamelcase(
																	listItem[0]
																		.selectedIcon
																)}`
															)
															? listItem[0]
																	.selectedIcon
															: [
																	'fab',
																	listItem[0]
																		.selectedIcon
															  ]
													}
													color={iconColor}
													size="lg"
												/>
											}
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
															icon={
																<FontAwesomeIcon
																	icon={i}
																	size="lg"
																/>
															}
															label={i.iconName}
															onClick={() => {
																let newListItem = cloneObject(
																	listItem
																);
																newListItem.forEach(
																	item => {
																		item.selectedIcon =
																			i.iconName;
																	}
																);
																setState({
																	recentSelection:
																		i.iconName,
																	edits:
																		edits +
																		1
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
						<p>{__('Icon size')}</p>
						<RangeControl
							value={iconSize}
							onChange={iconSize => setAttributes({ iconSize })}
							min={1}
							max={10}
						/>
					</PanelBody>
				</InspectorControls>
			),
			<div className="ub-styled-list">
				<StyledList
					edits={edits}
					list={listItem}
					updateList={newList => {
						setAttributes({ listItem: newList });
						if (newList.length !== listItem.length) {
							setState({ edits: edits + 1 });
						}
					}}
					iconSize={iconSize}
					iconColor={iconColor}
					updateSelectedItem={newSelectedItem => {
						setState({ selectedItem: newSelectedItem });
					}}
					increaseIndent={itemNumber => increaseIndent(itemNumber)}
					decreaseIndent={itemNumber => decreaseIndent(itemNumber)}
				/>
				<button
					onClick={_ =>
						setAttributes({
							listItem: [
								...listItem,
								{
									text: '',
									selectedIcon:
										listItem[listItem.length - 1]
											.selectedIcon,
									indent: listItem[listItem.length - 1].indent
								}
							]
						})
					}
				>
					Add new item
				</button>
			</div>
		];
	}),

	save: () => null
});
