import { EmptyStar, FullStar } from './icons';

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
