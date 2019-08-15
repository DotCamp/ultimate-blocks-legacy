import icon from './icon';
import './style.scss';
import './editor.scss';

import { ReviewBody } from './components';
import {
	version_1_1_2,
	version_1_1_4,
	version_1_1_5,
	updateFrom
} from './oldVersions';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { BlockControls, InspectorControls, PanelColorSettings } = wp.editor;

const { Toolbar, IconButton } = wp.components;
const { withState, compose } = wp.compose;
const { withSelect } = wp.data;

const attributes = {
	ID: {
		type: 'string',
		default: ''
	},
	blockID: {
		type: 'string',
		default: ''
	},
	authorName: {
		type: 'string',
		default: ''
	},
	itemName: {
		type: 'string'
	},
	items: {
		type: 'string',
		default: '[{"label": "", "value": 0}]'
	},
	starCount: {
		type: 'number',
		default: 5
	},
	summaryTitle: {
		type: 'string',
		default: 'Summary'
	},
	summaryDescription: {
		type: 'string'
	},
	callToActionText: {
		type: 'string'
	},
	callToActionURL: {
		type: 'string',
		default: ''
	},
	callToActionBackColor: {
		type: 'string',
		default: '#f63d3d'
	},
	callToActionForeColor: {
		type: 'string',
		default: '#ffffff'
	},
	inactiveStarColor: {
		type: 'string',
		default: '#888888'
	},
	activeStarColor: {
		type: 'string',
		default: '#eeee00'
	},
	selectedStarColor: {
		type: 'string',
		default: '#ffff00'
	},
	titleAlign: {
		type: 'string',
		default: 'left'
	},
	authorAlign: {
		type: 'string',
		default: 'left'
	}
};

registerBlockType('ub/review', {
	title: __('Review'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Review'), __('Ultimate Blocks')],
	attributes,
	edit: compose([
		withState({ editable: '' }),
		withSelect((select, ownProps) => ({
			block: select('core/editor').getBlock(ownProps.clientId)
		}))
	])(function(props) {
		const { setAttributes, isSelected, editable, setState, block } = props;
		const {
			blockID,
			authorName,
			itemName,
			items,
			starCount,
			summaryTitle,
			summaryDescription,
			callToActionText,
			callToActionURL,
			callToActionBackColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor,
			selectedStarColor,
			titleAlign,
			authorAlign
		} = props.attributes;

		if (blockID !== block.clientId) {
			setAttributes({
				blockID: block.clientId
			});
		}

		const setAlignment = (target, value) => {
			switch (target) {
				case 'reviewTitle':
					setAttributes({ titleAlign: value });
					break;
				case 'reviewAuthor':
					setAttributes({ authorAlign: value });
					break;
			}
		};

		const getCurrentAlignment = target => {
			switch (target) {
				case 'reviewTitle':
					return titleAlign;
				case 'reviewAuthor':
					return authorAlign;
			}
		};

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__('Star Colors')}
						initialOpen={true}
						colorSettings={[
							{
								value: activeStarColor,
								onChange: colorValue =>
									setAttributes({
										activeStarColor: colorValue
									}),
								label: __('Active Star Color')
							},
							{
								value: inactiveStarColor,
								onChange: colorValue =>
									setAttributes({
										inactiveStarColor: colorValue
									}),
								label: __('Inactive Star Color')
							},
							{
								value: selectedStarColor,
								onChange: colorValue =>
									setAttributes({
										selectedStarColor: colorValue
									}),
								label: __('Selected Star Color')
							}
						]}
					/>
					<PanelColorSettings
						title={__('Button Colors')}
						initialOpen={false}
						colorSettings={[
							{
								value: callToActionBackColor,
								onChange: colorValue =>
									setAttributes({
										callToActionBackColor: colorValue
									}),
								label: __('Button Background')
							},
							{
								value: callToActionForeColor,
								onChange: colorValue =>
									setAttributes({
										callToActionForeColor: colorValue
									}),
								label: __('Button Text Color')
							}
						]}
					/>
				</InspectorControls>
			),
			isSelected && (
				<BlockControls>
					{editable !== '' && (
						<Toolbar>
							{['left', 'center', 'right', 'justify'].map(a => (
								<IconButton
									icon={`editor-${
										a === 'justify' ? a : 'align' + a
									}`}
									label={__(
										(a !== 'justify' ? 'Align ' : '') +
											a[0].toUpperCase() +
											a.slice(1)
									)}
									isActive={
										getCurrentAlignment(editable) === a
									}
									onClick={() => setAlignment(editable, a)}
								/>
							))}
						</Toolbar>
					)}
				</BlockControls>
			),
			<ReviewBody
				authorName={authorName}
				itemName={itemName}
				ID={blockID}
				items={JSON.parse(items)}
				starCount={starCount}
				summaryTitle={summaryTitle}
				summaryDescription={summaryDescription}
				callToActionText={callToActionText}
				callToActionURL={callToActionURL}
				callToActionBackColor={callToActionBackColor}
				callToActionForeColor={callToActionForeColor}
				inactiveStarColor={inactiveStarColor}
				activeStarColor={activeStarColor}
				selectedStarColor={selectedStarColor}
				setAuthorName={newValue =>
					setAttributes({ authorName: newValue })
				}
				setItemName={newValue => setAttributes({ itemName: newValue })}
				setItems={newValue =>
					setAttributes({ items: JSON.stringify(newValue) })
				}
				setSummaryTitle={newValue =>
					setAttributes({ summaryTitle: newValue })
				}
				setSummaryDescription={newValue =>
					setAttributes({ summaryDescription: newValue })
				}
				setCallToActionText={newValue =>
					setAttributes({ callToActionText: newValue })
				}
				setCallToActionURL={newValue =>
					setAttributes({ callToActionURL: newValue })
				}
				hasFocus={isSelected}
				setEditable={newValue => setState({ editable: newValue })}
				alignments={{ titleAlign, authorAlign }}
			/>
		];
	}),
	save: () => null,
	deprecated: [
		updateFrom(version_1_1_2),
		updateFrom(version_1_1_4),
		updateFrom(version_1_1_5)
	]
});
