import { EmptyStar, FullStar } from './icons';

export const oldAttributes = {
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

export const version_1_1_2 = props => {
	const {
		starCount,
		starSize,
		starColor,
		selectedStars,
		reviewText
	} = props.attributes;
	return (
		<div className="ub-star-rating">
			<div className="ub-star-container">
				{[...Array(starCount)].map((e, i) => (
					<div key={i}>
						{i < selectedStars ? (
							<FullStar size={starSize} fillColor={starColor} />
						) : (
							<EmptyStar size={starSize} />
						)}
					</div>
				))}
			</div>
			<div className="ub-review-text">{reviewText}</div>
		</div>
	);
};

export const version_1_1_5 = props => {
	const {
		starCount,
		starSize,
		starColor,
		selectedStars,
		reviewText,
		reviewTextAlign
	} = props.attributes;
	return (
		<div className="ub-star-rating">
			<div className="ub-star-container">
				{[...Array(starCount)].map((e, i) => (
					<div key={i}>
						{i < selectedStars ? (
							<FullStar size={starSize} fillColor={starColor} />
						) : (
							<EmptyStar size={starSize} />
						)}
					</div>
				))}
			</div>
			<div
				className="ub-review-text"
				style={{ textAlign: reviewTextAlign }}
			>
				{reviewText}
			</div>
		</div>
	);
};

export const version_2_0_0 = props => {
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
							: `flex-${starAlign === 'left' ? 'start' : 'end'}`
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
};

export const updateFrom = oldVersion => ({
	attributes: oldAttributes,
	save: oldVersion
});
