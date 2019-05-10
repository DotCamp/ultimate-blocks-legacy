/**
 * BLOCK: Content Toggle
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';

//  Import CSS.
import './style.scss';
import './editor.scss';
import Inspector from './components/inspector';
import { Component } from 'react';

import { version_1_1_2 } from './oldVersions';

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { withState, compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { InnerBlocks } = wp.editor;

const attributes = {
	accordions: {
		source: 'query',
		selector: '.wp-block-ub-content-toggle-accordion',
		query: {
			title: {
				type: 'array',
				source: 'children',
				selector: '.wp-block-ub-content-toggle-accordion-title'
			},
			content: {
				type: 'array',
				source: 'children',
				selector: '.wp-block-ub-content-toggle-accordion-content'
			}
		}
	},
	accordionsState: {
		type: 'string',
		default: '[]'
	},
	timestamp: {
		type: 'number',
		default: 0
	},
	activeControl: {
		type: 'string',
		default: ''
	},
	theme: {
		type: 'string',
		default: '#f63d3d'
	},
	collapsed: {
		type: 'boolean',
		default: false
	},
	titleColor: {
		type: 'string',
		default: '#ffffff'
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
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

class PanelContent extends Component {
	constructor(props) {
		super(props);
		this.getPanels = this.getPanels.bind(this);
	}
	getPanels() {
		return this.props.block.innerBlocks;
	}
	render() {
		const {
			attributes,
			setAttributes,
			className,
			isSelected,
			updateBlockAttributes,
			oldArrangement,
			mainBlockSelected,
			setState,
			selectBlock,
			insertBlock,
			insertBlocks,
			removeBlock,
			selectedBlock,
			parentOfSelectedBlock,
			block
		} = this.props;

		const { accordions, collapsed, theme, titleColor } = attributes;

		if (!accordions) {
			attributes.accordions = [];
		}

		const panels = this.getPanels();

		const newArrangement = JSON.stringify(
			panels.map(panel => panel.attributes.index)
		);

		const newBlockTarget = panels.filter(
			panel => panel.attributes.newBlockPosition !== 'none'
		);

		const onThemeChange = value => {
			setAttributes({ theme: value });

			panels.forEach(panel =>
				updateBlockAttributes(panel.clientId, { theme: value })
			);
		};

		const onTitleColorChange = value => {
			setAttributes({ titleColor: value });

			panels.forEach(panel =>
				updateBlockAttributes(panel.clientId, { titleColor: value })
			);
		};

		const onCollapseChange = () => {
			setAttributes({ collapsed: !collapsed });
			panels.forEach(panel =>
				updateBlockAttributes(panel.clientId, {
					collapsed: !panel.attributes.collapsed
				})
			);
		};

		const richTextToHTML = elem => {
			let outputString = '';
			outputString += `<${
				elem.type === 'a'
					? `${elem.type} href='${elem.href}'`
					: elem.type
			}>`;
			elem.props.children.forEach(child => {
				outputString +=
					typeof child === 'string' ? child : richTextToHTML(child);
			});
			outputString += `</${elem.type}>`;

			return outputString;
		};

		//Detect if one of the child blocks has received a command to add another child block
		if (JSON.stringify(newBlockTarget) !== '[]') {
			const { index, newBlockPosition } = newBlockTarget[0].attributes;
			insertBlock(
				createBlock('ub/content-toggle-panel', {
					theme: theme,
					collapsed: collapsed,
					titleColor: titleColor
				}),
				newBlockPosition === 'below' ? index + 1 : index,
				block.clientId
			);
			updateBlockAttributes(newBlockTarget[0].clientId, {
				newBlockPosition: 'none'
			});
		}

		//Fix indexes in case of rearrangments

		if (newArrangement !== oldArrangement) {
			if (oldArrangement === '[0]' && newArrangement === '[]') {
				removeBlock(block.clientId);
			} else {
				panels.forEach((panel, i) =>
					updateBlockAttributes(panel.clientId, {
						index: i,
						parent: block.clientId
					})
				);
				setState({ oldArrangement: newArrangement });
			}
		} else {
			//Look for data intended for the old version
			if (
				JSON.stringify(accordions) !== '[]' &&
				oldArrangement ===
					JSON.stringify([...Array(accordions.length).keys()])
			) {
				panels.forEach((panel, i) => {
					updateBlockAttributes(panel.clientId, {
						panelTitle: accordions[i].title,
						theme: theme,
						collapsed: collapsed,
						titleColor: titleColor
					});

					if (
						accordions[i].content.filter(a => a.type === 'br')
							.length > 0
					) {
						let paragraphs = [];

						accordions[i].content.forEach((item, j) => {
							const part =
								typeof item === 'string'
									? item
									: richTextToHTML(item);
							if (
								paragraphs.length === 0 ||
								accordions[i].content[j - 1].type === 'br'
							) {
								paragraphs.push(
									item.type === 'br' ? item : part
								);
							} else if (item.type !== 'br') {
								paragraphs[paragraphs.length - 1] += part;
							}
						});

						const newParagraphs = paragraphs.map(part => {
							return createBlock(
								'core/paragraph',
								typeof part === 'object'
									? { type: part.type, content: part.content }
									: {
											content: part
									  }
							);
						});

						insertBlocks(newParagraphs, 0, panel.clientId);
					} else {
						insertBlock(
							createBlock('core/paragraph', {
								content: accordions[i].content
							}),
							0,
							panel.clientId
						);
					}
				});
				setAttributes({ accordions: [] }); //clear old data after successful transfer
			}
			if (mainBlockSelected) {
				const childBlocks = this.getPanels()
					.filter(block => block.name === 'ub/content-toggle-panel')
					.map(panels => panels.clientId);
				if (
					selectedBlock !== block.clientId &&
					childBlocks.includes(selectedBlock)
				) {
					setState({ mainBlockSelected: false });
				}
			} else {
				selectBlock(parentOfSelectedBlock);
				setState({ mainBlockSelected: true });
			}
		}

		return [
			isSelected && (
				<Inspector
					{...{
						attributes,
						onThemeChange,
						onCollapseChange,
						onTitleColorChange
					}}
				/>
			),
			<div className={className}>
				<InnerBlocks
					template={
						Array.isArray(accordions) &&
						Array(
							JSON.stringify(accordions) !== '[]'
								? accordions.length
								: 1
						).fill(['ub/content-toggle-panel'])
					} //initial content
					templateLock={false}
					allowedBlocks={['ub/content-toggle-panel']}
				/>
			</div>
		];
	}
}

registerBlockType('ub/content-toggle', {
	title: __('Content Toggle'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [
		__('Content Accordion'),
		__('Toggle Collapse'),
		__('Ultimate Blocks')
	],

	attributes,

	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getSelectedBlockClientId,
				getBlockRootClientId
			} = select('core/editor');

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				selectedBlock: getSelectedBlockClientId(),
				parentOfSelectedBlock: getBlockRootClientId(
					getSelectedBlockClientId()
				)
			};
		}),
		withDispatch(dispatch => {
			const {
				updateBlockAttributes,
				insertBlock,
				insertBlocks,
				removeBlock,
				selectBlock
			} = dispatch('core/editor');

			return {
				updateBlockAttributes,
				insertBlock,
				insertBlocks,
				removeBlock,
				selectBlock
			};
		}),
		withState({ oldArrangement: '', mainBlockSelected: true })
	])(PanelContent),

	save(props) {
		return (
			<div>
				<InnerBlocks.Content />
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
