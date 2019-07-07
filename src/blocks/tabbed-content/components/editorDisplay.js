import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from 'react-sortable-hoc';
import Inspector from './inspector';
import { Component } from 'react';
import { upgradeButtonLabel, mergeRichTextArray } from '../../../common';
const { createBlock } = wp.blocks;
const { RichText, InnerBlocks } = wp.editor;

export class OldTabHolder extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			className,
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			oldArrangement,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			replaceBlock
		} = this.props;

		window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

		let block = null;

		for (const bl of window.ubTabbedContentBlocks) {
			if (bl.id === attributes.id) {
				block = bl;
				break;
			}
		}

		if (!block) {
			block = {
				id: window.ubTabbedContentBlocks.length,
				SortableItem: null,
				SortableList: null
			};
			window.ubTabbedContentBlocks.push(block);
			setAttributes({ id: block.id });
		}

		if (!attributes.tabsTitle) {
			attributes.tabsTitle = [];
		}

		const tabs = this.props.block.innerBlocks;

		const showControls = (type, index) => {
			setAttributes({ activeControl: type + '-' + index });
			setAttributes({ activeTab: index });

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, {
					isActive: index === i
				});
			});
		};

		const addTab = i => {
			insertBlock(
				createBlock('ub/tab', {}),
				i,
				this.props.block.clientId
			);
			attributes.tabsTitle[i] = { content: 'Tab Title' };
			setAttributes({ tabsTitle: attributes.tabsTitle });

			setAttributes({ activeTab: i });

			showControls('tab-title', i);
		};

		if (attributes.tabsTitle.length === 0) {
			addTab(0);
		}

		const DragHandle = SortableHandle(() => (
			<span className="dashicons dashicons-move drag-handle" />
		));

		if (!block.SortableItem) {
			block.SortableItem = SortableElement(
				({
					value,
					i,
					propz,
					onChangeTitle,
					onRemoveTitle,
					toggleTitle
				}) => (
					<div
						className={
							propz.className +
							'-tab-title-wrap SortableItem' +
							(propz.attributes.activeTab === i ? ' active' : '')
						}
						style={{
							backgroundColor:
								propz.attributes.activeTab === i
									? propz.attributes.theme
									: 'initial',
							color:
								propz.attributes.activeTab === i
									? propz.attributes.titleColor
									: '#000000'
						}}
						onClick={() => toggleTitle('tab-title', i)}
					>
						<RichText
							tagName="div"
							className={propz.className + '-tab-title '}
							value={value.content}
							formattingControls={['bold', 'italic']}
							isSelected={
								propz.attributes.activeControl ===
									'tab-title-' + i && propz.isSelected
							}
							onChange={content => onChangeTitle(content, i)}
							placeholder="Tab Title"
						/>
						<div className="tab-actions">
							<DragHandle />
							<span
								className={
									'dashicons dashicons-minus remove-tab-icon' +
									(propz.attributes.tabsTitle.length === 1
										? ' ub-hide'
										: '')
								}
								onClick={() => onRemoveTitle(i)}
							/>
						</div>
					</div>
				)
			);
		}

		if (!block.SortableList) {
			block.SortableList = SortableContainer(
				({
					items,
					propz,
					onChangeTitle,
					onRemoveTitle,
					toggleTitle,
					onAddTab
				}) => (
					<div className={className + '-tabs-title SortableList'}>
						{items.map((value, index) => (
							<block.SortableItem
								propz={propz}
								key={`item-${index}`}
								i={index}
								index={index}
								value={value}
								onChangeTitle={onChangeTitle}
								onRemoveTitle={onRemoveTitle}
								toggleTitle={toggleTitle}
							/>
						))}
						<div
							className={className + '-tab-title-wrap'}
							key={propz.attributes.tabsTitle.length}
							onClick={() =>
								onAddTab(propz.attributes.tabsTitle.length)
							}
						>
							<span className="dashicons dashicons-plus-alt" />
						</div>
					</div>
				)
			);
		}

		const newArrangement = JSON.stringify(
			tabs.map(tab => tab.attributes.index)
		);

		if (newArrangement !== oldArrangement) {
			tabs.forEach((tab, i) =>
				updateBlockAttributes(tab.clientId, {
					index: i,
					isActive: attributes.activeTab === i
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		if (
			selectedBlock &&
			selectedBlock.clientId !== this.props.block.clientId
		) {
			if (
				tabs.filter(innerblock => innerblock.attributes.isActive)
					.length === 0
			) {
				showControls('tab-title', tabs.length - 1);
			}
			if (
				tabs.filter(tab => tab.clientId === selectedBlock.clientId)
					.length > 0 &&
				!selectedBlock.attributes.isActive
			) {
				selectBlock(this.props.block.clientId);
			}
		}

		return [
			isSelected && <Inspector {...{ attributes, setAttributes }} />,
			<div className={className}>
				<button
					onClick={() => {
						const {
							activeControl,
							activeTab,
							theme,
							titleColor,
							tabsTitle
						} = this.props.block.attributes;
						replaceBlock(
							this.props.block.clientId,
							createBlock(
								'ub/tabbed-content-block',
								{
									activeControl,
									activeTab,
									theme,
									titleColor,
									tabsTitle: tabsTitle
										.map(title => title.content)
										.map(title =>
											Array.isArray(title)
												? mergeRichTextArray(title)
												: title
										)
								},
								this.props.block.innerBlocks.map(
									(innerBlock, i) =>
										createBlock(
											'ub/tab-block',
											{
												index: i,
												isActive:
													innerBlock.attributes
														.isActive
											},
											innerBlock.innerBlocks
										)
								)
							)
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				<div className={className + '-holder'}>
					<block.SortableList
						axis="x"
						propz={this.props}
						items={attributes.tabsTitle}
						onSortEnd={({ oldIndex, newIndex }) => {
							const titleItems = attributes.tabsTitle.slice(0);

							setAttributes({
								tabsTitle: arrayMove(
									titleItems,
									oldIndex,
									newIndex
								)
							});

							moveBlockToPosition(
								tabs.filter(
									tab => tab.attributes.index === oldIndex
								)[0].clientId,
								this.props.block.clientId,
								this.props.block.clientId,
								newIndex
							);

							showControls('tab-title', oldIndex);
							setAttributes({ activeTab: newIndex });
						}}
						useDragHandle={true}
						onChangeTitle={(content, i) => {
							attributes.tabsTitle[i].content = content;
						}}
						onRemoveTitle={i => {
							setAttributes({
								tabsTitle: [
									...attributes.tabsTitle.slice(0, i),
									...attributes.tabsTitle.slice(i + 1)
								]
							});

							removeBlock(
								tabs.filter(
									tab => tab.attributes.index === i
								)[0].clientId
							);

							setAttributes({ activeTab: 0 });
							showControls('tab-title', 0);
						}}
						toggleTitle={showControls}
						onAddTab={addTab}
					/>

					<div className={className + '-tabs-content'}>
						<InnerBlocks
							templateLock={false}
							allowedBlocks={['ub/tab']}
						/>
					</div>
				</div>
			</div>
		];
	}
}

export class TabHolder extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			oldArrangement,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			block
		} = this.props;

		const {
			tabsTitle,
			activeTab,
			theme,
			titleColor,
			activeControl
		} = attributes;

		const className = 'wp-block-ub-tabbed-content';
		const tabs = block.innerBlocks;

		const showControls = (type, index) => {
			setAttributes({
				activeControl: `${type}-${index}`,
				activeTab: index
			});

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, {
					isActive: index === i
				});
			});
		};

		const addTab = i => {
			insertBlock(createBlock('ub/tab-block', {}), i, block.clientId);
			setAttributes({
				tabsTitle: [...tabsTitle, 'Tab Title'],
				activeTab: i
			});

			showControls('tab-title', i);
		};

		if (tabsTitle.length === 0) {
			addTab(0);
		}

		const DragHandle = SortableHandle(() => (
			<span className="dashicons dashicons-move drag-handle" />
		));

		const SortableItem = SortableElement(({ value, i }) => (
			<div
				className={
					className +
					'-tab-title-wrap SortableItem' +
					(activeTab === i ? ' active' : '')
				}
				style={{
					backgroundColor: activeTab === i ? theme : 'initial',
					color: activeTab === i ? titleColor : '#000000'
				}}
				onClick={() => showControls('tab-title', i)}
			>
				<RichText
					tagName="div"
					className={className + '-tab-title '}
					value={value}
					formattingControls={['bold', 'italic']}
					isSelected={
						activeControl === `tab-title-${i}` && isSelected
					}
					onChange={content => {
						attributes.tabsTitle[i] = content;
					}}
					placeholder="Tab Title"
				/>
				<div className="tab-actions">
					<DragHandle />
					<span
						className={
							'dashicons dashicons-minus remove-tab-icon' +
							(tabsTitle.length === 1 ? ' ub-hide' : '')
						}
						onClick={() => {
							setAttributes({
								tabsTitle: [
									...tabsTitle.slice(0, i),
									...tabsTitle.slice(i + 1)
								],
								activeTab: 0
							});

							removeBlock(
								tabs.filter(
									tab => tab.attributes.index === i
								)[0].clientId
							);

							showControls('tab-title', 0);
						}}
					/>
				</div>
			</div>
		));

		const SortableList = SortableContainer(({ items }) => (
			<div className={className + '-tabs-title SortableList'}>
				{items.map((value, index) => (
					<SortableItem
						key={`item-${index}`}
						i={index}
						index={index}
						value={value}
					/>
				))}
				<div
					className={className + '-tab-title-wrap'}
					key={tabsTitle.length}
					onClick={() => addTab(tabsTitle.length)}
				>
					<span className="dashicons dashicons-plus-alt" />
				</div>
			</div>
		));

		const newArrangement = JSON.stringify(
			tabs.map(tab => tab.attributes.index)
		);

		if (newArrangement !== oldArrangement) {
			tabs.forEach((tab, i) =>
				updateBlockAttributes(tab.clientId, {
					index: i,
					isActive: activeTab === i
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		if (selectedBlock && selectedBlock.clientId !== block.clientId) {
			if (
				tabs.filter(innerblock => innerblock.attributes.isActive)
					.length === 0
			) {
				showControls('tab-title', tabs.length - 1);
			}
			if (
				tabs.filter(tab => tab.clientId === selectedBlock.clientId)
					.length > 0 &&
				!selectedBlock.attributes.isActive
			) {
				selectBlock(block.clientId);
			}
		}

		return [
			isSelected && <Inspector {...{ attributes, setAttributes }} />,
			<div className={className}>
				<div className={className + '-holder'}>
					<SortableList
						axis="x"
						items={tabsTitle}
						onSortEnd={({ oldIndex, newIndex }) => {
							const titleItems = tabsTitle.slice(0);

							setAttributes({
								tabsTitle: arrayMove(
									titleItems,
									oldIndex,
									newIndex
								)
							});

							moveBlockToPosition(
								tabs.filter(
									tab => tab.attributes.index === oldIndex
								)[0].clientId,
								block.clientId,
								block.clientId,
								newIndex
							);

							showControls('tab-title', oldIndex);
							setAttributes({ activeTab: newIndex });
						}}
						useDragHandle={true}
					/>
					<div className={className + '-tabs-content'}>
						<InnerBlocks
							templateLock={false}
							allowedBlocks={['ub/tab-block']}
						/>
					</div>
				</div>
			</div>
		];
	}
}
