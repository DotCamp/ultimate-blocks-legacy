const { __ } = wp.i18n;
const {
	InspectorControls,
	PanelColorSettings,
	RichText,
	BlockControls
} = wp.editor;
const { registerBlockType } = wp.blocks;
const { PanelBody, RangeControl, Toolbar, IconButton } = wp.components;

import './style.scss';
import './editor.scss';

import { EmptyStar, HalfStar, FullStar } from './icons';
import { version_1_1_2, version_1_1_5 } from './oldVersions';

const attributes = {
	starCount: {
		type: 'number',
		default: 5
	},
	starSize: {
		type: 'number',
		default: 20
	},
	starColor: {
		type: 'string',
		default: '#ffff00'
	},
	selectedStars: {
		type: 'number',
		default: 0
	},
	reviewText: {
		type: 'array',
		source: 'children',
		selector: '.ub-review-text'
	},
	reviewTextAlign: {
		type: 'string',
		default: 'text'
	},
	starAlign: {
		type: 'string',
		default: 'left'
	}
};

registerBlockType('ub/star-rating', {
	title: __('Star Rating'),
	icon: HalfStar,
	category: 'ultimateblocks',

	attributes,

	edit(props) {
		const { isSelected, setAttributes } = props;

		const {
			starCount,
			starSize,
			starColor,
			selectedStars,
			reviewText,
			reviewTextAlign,
			starAlign
		} = props.attributes;

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						{['left', 'center', 'right'].map(a => (
							<IconButton
								icon={`align-${a}`}
								label={__(`Align stars ${a}`)}
								onClick={() => setAttributes({ starAlign: a })}
							/>
						))}
					</Toolbar>
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
								isActive={reviewTextAlign === a}
								onClick={() =>
									setAttributes({ reviewTextAlign: a })
								}
							/>
						))}
					</Toolbar>
				</BlockControls>
			),
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Star Settings')}>
						<PanelColorSettings
							title={__('Color')}
							initialOpen={false}
							colorSettings={[
								{
									value: starColor,
									onChange: colorValue =>
										setAttributes({
											starColor: colorValue
										}),
									label: __('')
								}
							]}
						/>
						<RangeControl
							label={__('Star size')}
							value={starSize}
							onChange={value =>
								setAttributes({ starSize: value })
							}
							min={10}
							max={30}
							beforeIcon="editor-contract"
							afterIcon="editor-expand"
							allowReset
						/>
						<RangeControl
							label={__('Number of stars')}
							value={starCount}
							onChange={value =>
								setAttributes({
									starCount: value,
									selectedStars:
										value < selectedStars
											? value
											: selectedStars
								})
							}
							min={5}
							max={10}
							beforeIcon="star-empty"
							allowReset
						/>
						<RangeControl
							label={__('Number of selected stars')}
							value={selectedStars}
							onChange={value =>
								setAttributes({ selectedStars: value })
							}
							min={0}
							max={starCount}
							beforeIcon="star-filled"
							allowReset
						/>
					</PanelBody>
				</InspectorControls>
			),
			<div className="ub-star-rating">
				<div
					className="ub-star-outer-container"
					style={{
						justifyContent:
							starAlign === 'center'
								? 'center'
								: `flex-${
										starAlign === 'left' ? 'start' : 'end'
								  }`
					}}
				>
					<div className="ub-star-inner-container">
						{[...Array(starCount)].map((e, i) => (
							<div key={i}>
								{i < selectedStars ? (
									<FullStar
										size={starSize}
										fillColor={starColor}
									/>
								) : (
									<EmptyStar size={starSize} />
								)}
							</div>
						))}
					</div>
				</div>
				<div className="ub-review-text">
					<RichText
						tagName="div"
						placeholder={__('The text of the review goes here')}
						value={reviewText}
						style={{ textAlign: reviewTextAlign }}
						onChange={text => setAttributes({ reviewText: text })}
						keepPlaceholderOnFocus={true}
						formattingControls={[
							'bold',
							'italic',
							'strikethrough',
							'link'
						]}
					/>
				</div>
			</div>
		];
	},

	save(props) {
		const {
			starCount,
			starSize,
			starColor,
			selectedStars,
			reviewText,
			reviewTextAlign,
			starAlign
		} = props.attributes;
		return (
			<div className="ub-star-rating">
				<div
					className="ub-star-outer-container"
					style={{
						justifyContent:
							starAlign === 'center'
								? 'center'
								: `flex-${
										starAlign === 'left' ? 'start' : 'end'
								  }`
					}}
				>
					<div className="ub-star-inner-container">
						{[...Array(starCount)].map((e, i) => (
							<div key={i}>
								{i < selectedStars ? (
									<FullStar
										size={starSize}
										fillColor={starColor}
									/>
								) : (
									<EmptyStar size={starSize} />
								)}
							</div>
						))}
					</div>
				</div>
				<div
					className="ub-review-text"
					style={{ textAlign: reviewTextAlign }}
				>
					{reviewText}
				</div>
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
			save: version_1_1_5
		}
	]
});
