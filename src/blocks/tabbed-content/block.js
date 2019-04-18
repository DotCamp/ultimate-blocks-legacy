/**
 * BLOCK: tabbed-content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from 'react-sortable-hoc';
import Inspector from './components/inspector';
import { Component } from 'react';
import icon from './icons/icon';
import { version_1_1_2 } from './oldVersions';

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { withState, compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { RichText, InnerBlocks } = wp.editor;

const attributes = {
	id: {
		type: 'number',
		default: -1
	},
	activeControl: {
		type: 'string'
	},
	activeTab: {
		type: 'number',
		default: 0
	},
	timestamp: {
		type: 'number',
		default: 0
	},
	theme: {
		type: 'string',
		default: '#eeeeee'
	},
	titleColor: {
		type: 'string',
		default: '#000000'
	},
	tabsContent: {
		source: 'query',
		selector: '.wp-block-ub-tabbed-content-tab-content-wrap',
		query: {
			content: {
				type: 'array',
				source: 'children',
				selector: '.wp-block-ub-tabbed-content-tab-content'
			}
		}
	},
	tabsTitle: {
		source: 'query',
		selector: '.wp-block-ub-tabbed-content-tab-title-wrap',
		query: {
			content: {
				type: 'array',
				source: 'children',
				selector: '.wp-block-ub-tabbed-content-tab-title'
			}
		}
	}
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     ub/tabbed-content.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

class TabHolder extends Component {
	constructor(props) {
		super(props);
		this.getTabs = this.getTabs.bind(this);
		this.getTabTemplate = this.getTabTemplate.bind(this);
	}
	getTabs() {
		return this.props.block.innerBlocks;
	}
	getTabTemplate() {
		let result = [];

		this.props.attributes.tabsTitle.forEach(() => {
			result.push(['ub/tab']);
		});

		return JSON.stringify(result) === '[]' ? [['ub/tab']] : result;
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
			insertBlock
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

		const tabs = this.getTabs();

		const updateTimeStamp = () => {
			setAttributes({ timestamp: new Date().getTime() });
		};

		const showControls = (type, index) => {
			setAttributes({ activeControl: type + '-' + index });
			setAttributes({ activeTab: index });

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, {
					isActive: index === i
				});
			});
		};

		const onChangeTabTitle = (content, i) => {
			attributes.tabsTitle[i].content = content;

			updateTimeStamp();
		};

		const addTab = i => {
			attributes.tabsTitle[i] = { content: 'Tab Title' };
			setAttributes({ tabsTitle: attributes.tabsTitle });

			setAttributes({ activeTab: i });

			showControls('tab-title', i);

			updateTimeStamp();
		};

		const removeTab = i => {
			setAttributes({
				tabsTitle: [
					...attributes.tabsTitle.slice(0, i),
					...attributes.tabsTitle.slice(i + 1)
				]
			});

			removeBlock(
				tabs.filter(tab => tab.attributes.index === i)[0].clientId
			);

			setAttributes({ activeTab: 0 });
			showControls('tab-title', 0);

			updateTimeStamp();
		};

		const onThemeChange = value => setAttributes({ theme: value });
		const onTitleColorChange = value =>
			setAttributes({ titleColor: value });

		if (attributes.tabsTitle.length === 0) {
			addTab(0);
		}

		const onSortEnd = ({ oldIndex, newIndex }) => {
			const titleItems = attributes.tabsTitle.slice(0);

			setAttributes({
				tabsTitle: arrayMove(titleItems, oldIndex, newIndex)
			});

			moveBlockToPosition(
				tabs.filter(tab => tab.attributes.index === oldIndex)[0]
					.clientId,
				this.props.block.clientId,
				this.props.block.clientId,
				newIndex
			);
			setAttributes({ activeTab: newIndex });

			showControls('tab-title', newIndex);
		};

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
				}) => {
					return (
						<div
							className={
								propz.className +
								'-tab-title-wrap SortableItem' +
								(propz.attributes.activeTab === i
									? ' active'
									: '')
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
							<div class="tab-actions">
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
					);
				}
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
				}) => {
					return (
						<div className={className + '-tabs-title SortableList'}>
							{items.map((value, index) => {
								return (
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
								);
							})}
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
					);
				}
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
		} else {
			if (
				attributes.tabsContent &&
				JSON.stringify(attributes.tabsContent) !== '[]'
			) {
				tabs.forEach(tab => {
					insertBlock(
						createBlock('core/paragraph', {
							content:
								attributes.tabsContent[tab.attributes.index]
									.content
						}),
						0,
						tab.clientId
					);
				});
				setAttributes({ tabsContent: [] });
			}
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
			isSelected && (
				<Inspector
					{...{ attributes, onThemeChange, onTitleColorChange }}
				/>
			),
			<div className={className}>
				<div className={className + '-holder'}>
					{
						<block.SortableList
							axis="x"
							propz={this.props}
							items={attributes.tabsTitle}
							onSortEnd={onSortEnd}
							useDragHandle={true}
							onChangeTitle={onChangeTabTitle}
							onRemoveTitle={removeTab}
							toggleTitle={showControls}
							onAddTab={addTab}
						/>
					}
					<div className={className + '-tabs-content'}>
						<InnerBlocks
							template={this.getTabTemplate()}
							templateLock={'all'}
							allowedBlocks={['ub/tab']}
						/>
					</div>
				</div>
			</div>
		];
	}
}

registerBlockType('ub/tabbed-content', {
	title: __('Tabbed Content'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Tabbed Content'), __('Tabs'), __('Ultimate Blocks')],
	attributes,

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getSelectedBlock } = select('core/editor');

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				selectedBlock: getSelectedBlock()
			};
		}),
		withDispatch(dispatch => {
			const {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				moveBlockToPosition,
				selectBlock
			} = dispatch('core/editor');

			return {
				updateBlockAttributes,
				insertBlock,
				removeBlock,
				moveBlockToPosition,
				selectBlock
			};
		}),
		withState({ oldArrangement: '' })
	])(TabHolder),

	save: function(props) {
		const className = 'wp-block-ub-tabbed-content';

		const { activeTab, theme, titleColor } = props.attributes;

		return (
			<div data-id={props.attributes.id}>
				<div className={className + '-holder'}>
					<div className={className + '-tabs-title'}>
						{props.attributes.tabsTitle.map((value, i) => {
							return (
								<div
									className={
										className +
										'-tab-title-wrap' +
										(activeTab === i ? ' active' : '')
									}
									style={{
										backgroundColor:
											activeTab === i ? theme : 'initial',
										borderColor:
											activeTab === i
												? theme
												: 'lightgrey',
										color:
											activeTab === i
												? titleColor
												: '#000000'
									}}
									key={i}
								>
									<RichText.Content
										tagName="div"
										className={className + '-tab-title'}
										value={value.content}
									/>
								</div>
							);
						})}
					</div>
					<div className={className + '-tabs-content'}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes,
			save: version_1_1_2
		}
	]
});
