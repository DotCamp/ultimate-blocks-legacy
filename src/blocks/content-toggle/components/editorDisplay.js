import Inspector from './inspector';
import { Component } from 'react';
import { upgradeButtonLabel, getDescendantBlocks } from '../../../common';

const { __ } = wp.i18n;
const { createBlock } = wp.blocks;

const { InnerBlocks, InspectorControls, PanelColorSettings } =
	wp.blockEditor || wp.editor;
const { PanelBody, PanelRow, FormToggle } = wp.components;

export class OldPanelContent extends Component {
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
			removeBlock,
			selectedBlock,
			parentOfSelectedBlock,
			block,
			replaceBlock
		} = this.props;

		const { collapsed, theme, titleColor } = attributes;

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
		} else if (mainBlockSelected) {
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
				<button
					onClick={() => {
						replaceBlock(
							block.clientId,
							createBlock(
								'ub/content-toggle-block',
								{ collapsed, theme, titleColor },
								block.innerBlocks.map((innerBlock, i) =>
									createBlock(
										'ub/content-toggle-panel-block',
										{
											index: i,
											theme,
											collapsed,
											titleColor,
											panelTitle:
												innerBlock.attributes
													.panelTitle,
											newBlockPosition:
												innerBlock.attributes
													.newBlockPosition
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
				<InnerBlocks
					template={[['ub/content-toggle-panel']]} //initial content
					templateLock={false}
					allowedBlocks={['ub/content-toggle-panel']}
				/>
			</div>
		];
	}
}

export class PanelContent extends Component {
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
			removeBlock,
			selectedBlock,
			block
		} = this.props;

		const {
			collapsed,
			theme,
			titleColor,
			blockID,
			hasFAQSchema
		} = attributes;

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

		//Detect if one of the child blocks has received a command to add another child block
		if (JSON.stringify(newBlockTarget) !== '[]') {
			const { index, newBlockPosition } = newBlockTarget[0].attributes;
			insertBlock(
				createBlock('ub/content-toggle-panel-block', {
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
			if (oldArrangement === '' && newArrangement === '[]') {
				insertBlock(
					createBlock('ub/content-toggle-panel-block', {
						theme: theme,
						collapsed: collapsed,
						titleColor: titleColor
					}),
					0,
					block.clientId
				);
			} else if (oldArrangement === '[0]' && newArrangement === '[]') {
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
		} else if (mainBlockSelected) {
			if (
				selectedBlock !== block.clientId &&
				getDescendantBlocks(this.props.block)
					.map(d => d.clientId)
					.includes(selectedBlock)
			) {
				setState({ mainBlockSelected: false });
			}
		} else {
			let childBlocks = this.props.block.innerBlocks
				.filter(block => block.name === 'ub/content-toggle-panel-block')
				.map(panels => panels.clientId);

			if (childBlocks.includes(selectedBlock) && !wp.data.useDispatch) {
				//useDispatch is only present in Gutenberg v5.9, together with clickthrough selection feature
				setState({ mainBlockSelected: true });
				selectBlock(this.props.block.clientId);
			}
		}

		if (blockID !== block.clientId) {
			setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__('Color Scheme')}
						initialOpen={false}
						colorSettings={[
							{
								value: theme,
								onChange: onThemeChange,
								label: __('Container Color')
							},
							{
								value: titleColor,
								onChange: onTitleColorChange,
								label: __('Title Color')
							}
						]}
					/>
					<PanelBody title={__('Initial State')} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub-content-toggle-state">
								{__('Collapsed')}
							</label>
							<FormToggle
								id="ub-content-toggle-state"
								label={__('Collapsed')}
								checked={collapsed}
								onChange={onCollapseChange}
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody title={__('FAQ Schema')} initialOpen={true}>
						<PanelRow>
							<label htmlFor="ub-content-toggle-faq-schema">
								{__('Enable FAQ Schema')}
							</label>
							<FormToggle
								id="ub-content-toggle-faq-schema"
								label={__('Enable FAQ Schema')}
								checked={hasFAQSchema}
								onChange={() =>
									setAttributes({
										hasFAQSchema: !hasFAQSchema
									})
								}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			),
			<div className={className}>
				<InnerBlocks
					templateLock={false}
					allowedBlocks={['ub/content-toggle-panel-block']}
				/>
			</div>
		];
	}
}
