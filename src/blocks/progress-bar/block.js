import icon, { CircProgressIcon, LinearProgressIcon } from './icons';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;
const { BlockControls, InspectorControls, PanelColorSettings, RichText } =
	wp.blockEditor || wp.editor;

const { withSelect } = wp.data;

import Circle from './Circle';
import Line from './Line';
import { useEffect } from 'react';
import ActivateBlockOnStartup from '$Development/components/ActivateBlockOnStartup';
import {
	TextControl,
	Button,
	ButtonGroup,
	ToolbarGroup,
	ToolbarButton,
	RangeControl,
	PanelBody,
	PanelRow,
	ToolbarDropdownMenu,
} from '@wordpress/components';

function ProgressBarMain(props) {
	const {
		attributes: {
			blockID,
			percentage,
			barType,
			detail,
			detailAlign,
			barColor,
			barBackgroundColor,
			barThickness,
			circleSize,
			labelColor,
		},
		isSelected,
		setAttributes,
		block,
		getBlock,
		getClientIdsWithDescendants,
	} = props;

	useEffect(() => {
		if (blockID === '') {
			setAttributes({ blockID: block.clientId, percentage: 75 });
		} else {
			if (percentage === -1) {
				setAttributes({ percentage: 25 });
			}
			if (
				getClientIdsWithDescendants().some(
					(ID) =>
						'blockID' in getBlock(ID).attributes &&
						getBlock(ID).attributes.blockID === blockID
				)
			) {
				setAttributes({ blockID: block.clientId });
			}
		}
	}, []);

	const progressBarAttributes = {
		percent: percentage,
		barColor,
		barBackgroundColor,
		barThickness,
		labelColor,
	};

	return (
		<>
			{isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							isPressed={barType === 'linear'}
							showTooltip={true}
							label={__('Horizontal')}
							onClick={() => setAttributes({ barType: 'linear' })}
						>
							<LinearProgressIcon />
						</ToolbarButton>
						<ToolbarButton
							isPressed={barType === 'circular'}
							showTooltip={true}
							label={__('Circular')}
							onClick={() =>
								setAttributes({ barType: 'circular' })
							}
						>
							<CircProgressIcon />
						</ToolbarButton>
					</ToolbarGroup>
					<ToolbarGroup>
						<div
							className={'ub_progress_bar_range_toolbar_wrapper'}
						>
							<RangeControl
								className="ub_progress_bar_value"
								value={percentage}
								onChange={(value) =>
									setAttributes({ percentage: value })
								}
								min={0}
								max={100}
							/>
							<TextControl
								className={'ub_progress_bar_range_number_input'}
								value={percentage}
								type={'number'}
								onChange={(value) =>
									setAttributes({
										percentage: Number.parseInt(value),
									})
								}
								min={0}
								max={100}
							/>
						</div>
					</ToolbarGroup>
					<ToolbarDropdownMenu
						icon={`editor-${
							detailAlign === 'justify'
								? detailAlign
								: 'align' + detailAlign
						}`}
						controls={['left', 'center', 'right', 'justify'].map(
							(a) => ({
								icon: `editor-${
									a === 'justify' ? a : 'align' + a
								}`,
								onClick: () =>
									setAttributes({ detailAlign: a }),
							})
						)}
					/>
				</BlockControls>
			)}
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__('General')}>
							<PanelRow>
								<p>{__('Progress Bar Type')}</p>
								<ButtonGroup>
									<Button
										isPressed={barType === 'linear'}
										showTooltip={true}
										label={__('Horizontal')}
										onClick={() =>
											setAttributes({ barType: 'linear' })
										}
									>
										<LinearProgressIcon size={30} />
									</Button>
									<Button
										isPressed={barType === 'circular'}
										showTooltip={true}
										label={__('Circular')}
										onClick={() =>
											setAttributes({
												barType: 'circular',
											})
										}
									>
										<CircProgressIcon size={30} />
									</Button>
								</ButtonGroup>
							</PanelRow>
						</PanelBody>
						<PanelBody title={__('Value')} initialOpen={false}>
							<RangeControl
								className="ub_progress_bar_value"
								value={percentage}
								onChange={(value) =>
									setAttributes({ percentage: value })
								}
								min={0}
								max={100}
								allowReset
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody title={__('Style')}>
							<RangeControl
								label={__('Thickness')}
								value={barThickness}
								onChange={(value) =>
									setAttributes({ barThickness: value })
								}
								min={1}
								max={5}
								allowReset
							/>
							{barType === 'circular' && (
								<RangeControl
									label={__('Circle size')}
									value={circleSize}
									onChange={(value) =>
										setAttributes({ circleSize: value })
									}
									min={50}
									max={600}
									allowReset
								/>
							)}
							<PanelColorSettings
								title={__('Color')}
								initialOpen={false}
								colorSettings={[
									{
										value: barColor,
										onChange: (barColor) =>
											setAttributes({ barColor }),
										label: 'Progress Bar Color',
									},
									{
										value: barBackgroundColor,
										onChange: (barBackgroundColor) =>
											setAttributes({
												barBackgroundColor,
											}),
										label: 'Background Bar Color',
									},
									{
										value: labelColor,
										onChange: (labelColor) =>
											setAttributes({ labelColor }),
										label: 'Label Color',
									},
								]}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			)}
			<div className="ub_progress-bar">
				<div className="ub_progress-bar-text">
					<RichText
						tagName="p"
						style={{ textAlign: detailAlign }}
						placeholder={__('Progress bar description')}
						value={detail}
						onChange={(text) => setAttributes({ detail: text })}
						keepPlaceholderOnFocus={true}
					/>
				</div>
				{percentage > -1 && //linear progress bar fails to render properly unless a value of 0 or greater is inputted
					(barType === 'linear' ? (
						<Line {...progressBarAttributes} />
					) : (
						<Circle
							{...progressBarAttributes}
							alignment={detailAlign}
							size={circleSize}
						/>
					))}
			</div>
		</>
	);
}

registerBlockType('ub/progress-bar', {
	title: __('Progress Bar'),
	description: __(
		'Add Cirle/Line Progress bar with this blocks. Comes with options to change thickness, color.',
		'ultimate-blocks'
	),
	icon,
	category: 'ultimateblocks',
	keywords: [__('Progress Bar'), __('Ultimate Blocks')],

	attributes: {
		blockID: {
			type: 'string',
			default: '',
		},
		percentage: {
			type: 'number',
			default: -1,
		},
		barType: {
			type: 'string',
			default: 'linear', //choose between linear and circular
		},
		detail: {
			type: 'string',
			default: '',
		},
		detailAlign: {
			type: 'string',
			default: 'left',
		},
		barColor: {
			type: 'string',
			default: '#2DB7F5',
		},
		barBackgroundColor: {
			type: 'string',
			default: '#d9d9d9',
		},
		barThickness: {
			type: 'number',
			default: 1,
		},
		circleSize: {
			type: 'number',
			default: 150,
		},
		labelColor: {
			type: 'string',
			default: '',
		},
	},
	example: {
		attributes: {
			barColor: '#f63d3d',
			barThickness: 2,
		},
	},
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select('core/block-editor') || select('core/editor');

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(ProgressBarMain),

	save: () => null,
});
