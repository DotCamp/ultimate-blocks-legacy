import icon from './icon';
import './style.scss';

import { Stars, ReviewBody } from './components';
import { version_1_1_2, version_1_1_4, version_1_1_5 } from './oldVersions';
import { JSONLD, Generic } from 'react-structured-data';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	RichText,
	BlockControls,
	InspectorControls,
	PanelColorSettings
} = wp.editor;

const { Toolbar, IconButton } = wp.components;
const { withState } = wp.compose;

const attributes = {
	ID: {
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
	edit: withState({ editable: '' })(function(props) {
		const { setAttributes, isSelected, editable, setState } = props;
		const {
			ID,
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

		if (ID === '') {
			setAttributes({
				ID: Math.random()
					.toString(36)
					.replace(/[^a-z0-9]+/g, '')
					.substr(1, 10)
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
				ID={ID}
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
	save(props) {
		const {
			ID,
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
			titleAlign,
			authorAlign
		} = props.attributes;

		const average =
			Math.round(
				(JSON.parse(items)
					.map(i => i.value)
					.reduce((total, v) => total + v) /
					JSON.parse(items).length) *
					10
			) / 10;

		return (
			<div className="ub_review_block">
				<p
					className="ub_review_item_name"
					style={{ textAlign: titleAlign }}
				>
					<RichText.Content value={itemName} />
				</p>
				<p style={{ textAlign: authorAlign }}>
					<RichText.Content value={authorName} />
				</p>
				{JSON.parse(items).map((j, i) => (
					<div className="ub_review_entry">
						<RichText.Content key={i} value={j.label} />
						<Stars
							style={{ marginLeft: 'auto' }}
							id={`${ID}-${i}`}
							key={i}
							value={j.value}
							limit={starCount}
							inactiveStarColor={inactiveStarColor}
							activeStarColor={activeStarColor}
						/>
					</div>
				))}
				<div className="ub_review_summary">
					<RichText.Content
						className="ub_review_summary_title"
						tagName="p"
						value={summaryTitle}
					/>
					<div className="ub_review_overall_value">
						<p>
							<RichText.Content value={summaryDescription} />
						</p>
						<span className="ub_review_rating">{average}</span>
					</div>
					<div className="ub_review_cta_panel">
						<div className="ub_review_cta_main">
							<a
								style={{ color: callToActionForeColor }}
								href={callToActionURL ? callToActionURL : '#'}
								target="_blank"
								rel="nofollow noopener noreferrer"
							>
								<button
									className="ub_review_cta_btn"
									style={{
										backgroundColor: callToActionBackColor,
										border: `1px solid ${callToActionForeColor}`
									}}
								>
									<RichText.Content
										style={{ color: callToActionForeColor }}
										value={
											callToActionText
												? callToActionText
												: 'Click here'
										}
									/>
								</button>
							</a>
						</div>
						<Stars
							id={`${ID}-average`}
							className="ub_review_average_stars"
							onHover={() => null}
							setValue={() => null}
							value={average}
							limit={starCount}
							inactiveStarColor={inactiveStarColor}
							activeStarColor={activeStarColor}
						/>
					</div>
				</div>
				<JSONLD>
					<Generic
						type="review"
						jsonldtype="Review"
						schema={{ reviewBody: summaryDescription }}
					>
						<Generic
							type="itemReviewed"
							jsonldtype="Product"
							schema={{ name: itemName }}
						/>
						<Generic
							type="reviewRating"
							jsonldtype="Rating"
							schema={{ ratingValue: average, bestRating: 5 }}
						/>
						<Generic
							type="author"
							jsonldtype="Person"
							schema={{ name: authorName }}
						/>
					</Generic>
				</JSONLD>
			</div>
		);
	},
	deprecated: [
		{
			attributes,
			save: version_1_1_2
		},
		{
			attributes,
			save: version_1_1_4
		},
		{
			attributes,
			save: version_1_1_5
		}
	]
});
