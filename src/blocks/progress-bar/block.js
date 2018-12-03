import icon, { CircProgressIcon, LinearProgressIcon } from './icons';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;
const {
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	RichText
} = wp.editor;

const { Toolbar, Button, RangeControl } = wp.components;

const { withState } = wp.compose;

import './style.scss';

import Circle from './Circle';
import Line from './Line';

registerBlockType('ub/progress-bar', {
	title: __('Progress Bar'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Progress Bar'), __('Ultimate Blocks')],

	attributes: {
		percentage: {
			type: 'number',
			default: 25
		},
		barType: {
			type: 'string',
			default: 'linear' //choose between linear and circular
		},
		detail: {
			type: 'string',
			default: ''
		},
		barColor: {
			type: 'string',
			default: '#2DB7F5'
		},
		barThickness: {
			type: 'number',
			default: 1
		}
	},

	edit: withState({ editable: 'content' })(function(props) {
		const { editable, isSelected, setAttributes, setState } = props;
		const {
			percentage,
			barType,
			detail,
			barColor,
			barThickness
		} = props.attributes;

		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};

		return [
			isSelected && <BlockControls key="controls" />,
			isSelected && (
				<BlockControls key="controls">
					<Toolbar>
						<Button
							onClick={() => setAttributes({ barType: 'linear' })}
						>
							{LinearProgressIcon}
						</Button>
						<Button
							onClick={() =>
								setAttributes({ barType: 'circular' })
							}
						>
							{CircProgressIcon}
						</Button>
					</Toolbar>
				</BlockControls>
			),
			isSelected && (
				<InspectorControls key="inspectors">
					<RangeControl
						label={__('Value')}
						value={percentage}
						onChange={value => setAttributes({ percentage: value })}
						min={0}
						max={100}
						allowReset
					/>
					<PanelColorSettings
						title={__('Progress Bar Color')}
						initialOpen={true}
						colorSettings={[
							{
								value: barColor,
								onChange: colorValue =>
									setAttributes({ barColor: colorValue }),
								label: ''
							}
						]}
					/>
					<RangeControl
						label={__('Progress Bar Thickness')}
						value={barThickness}
						onChange={value =>
							setAttributes({ barThickness: value })
						}
						min={1}
						max={5}
						allowReset
					/>
				</InspectorControls>
			),
			<div className="ub_progress-bar">
				<div key={'editable'} className="ub_progress-bar-text">
					<RichText
						tagName="p"
						placeholder={__('Progress bar description')}
						value={detail}
						onChange={text => setAttributes({ detail: text })}
						keepPlaceholderOnFocus={true}
						isSelected={
							isSelected && editable === 'progress_bar_text'
						}
						onFocus={onSetActiveEditable('progress_bar_text')}
					/>
				</div>
				{barType === 'linear' ? (
					<Line
						percent={percentage}
						barColor={barColor}
						barThickness={barThickness}
					/>
				) : (
					<Circle
						percent={percentage}
						barColor={barColor}
						barThickness={barThickness}
					/>
				)}
			</div>
		];
	}),

	save() {
		return null;
	}
});
