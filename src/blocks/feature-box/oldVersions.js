const version_1_1_2 = props => {
	const {
		column,
		columnOneTitle,
		columnTwoTitle,
		columnThreeTitle,
		columnOneBody,
		columnTwoBody,
		columnThreeBody,
		imgOneURL,
		imgOneID,
		imgOneAlt,
		imgTwoURL,
		imgTwoID,
		imgTwoAlt,
		imgThreeURL,
		imgThreeID,
		imgThreeAlt
	} = props.attributes;

	return (
		<div className={props.className}>
			<div className={`ub_feature_box column_${column}`}>
				<div class="ub_feature_1">
					<img
						className="ub_feature_one_img"
						src={imgOneURL}
						alt={imgOneAlt}
					/>
					<p className="ub_feature_one_title">{columnOneTitle}</p>
					<p className="ub_feature_one_body">{columnOneBody}</p>
				</div>
				<div class="ub_feature_2">
					<img
						className="ub_feature_two_img"
						src={imgTwoURL}
						alt={imgTwoAlt}
					/>
					<p className="ub_feature_two_title">{columnTwoTitle}</p>
					<p className="ub_feature_two_body">{columnTwoBody}</p>
				</div>
				<div class="ub_feature_3">
					<img
						className="ub_feature_three_img"
						src={imgThreeURL}
						alt={imgThreeAlt}
					/>
					<p className="ub_feature_three_title">{columnThreeTitle}</p>
					<p className="ub_feature_three_body">{columnThreeBody}</p>
				</div>
			</div>
		</div>
	);
};

export { version_1_1_2 };
