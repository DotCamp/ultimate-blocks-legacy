export const oldAttributes = {
	column: {
		type: 'select',
		default: '2'
	},
	columnOneTitle: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_one_title',
		default: 'Title One'
	},
	title1Align: {
		type: 'string',
		default: 'center'
	},
	columnTwoTitle: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_two_title',
		default: 'Title Two'
	},
	title2Align: {
		type: 'string',
		default: 'center'
	},
	columnThreeTitle: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_three_title',
		default: 'Title Three'
	},
	title3Align: {
		type: 'string',
		default: 'center'
	},
	columnOneBody: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_one_body',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	body1Align: {
		type: 'string',
		default: 'left'
	},
	columnTwoBody: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_two_body',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	body2Align: {
		type: 'string',
		default: 'left'
	},
	columnThreeBody: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_three_body',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	body3Align: {
		type: 'string',
		default: 'left'
	},
	imgOneURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.ub_feature_one_img'
	},
	imgOneID: {
		type: 'number'
	},
	imgOneAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.ub_feature_one_img'
	},
	imgTwoURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.ub_feature_two_img'
	},
	imgTwoID: {
		type: 'number'
	},
	imgTwoAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.ub_feature_two_img'
	},
	imgThreeURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.ub_feature_three_img'
	},
	imgThreeID: {
		type: 'number'
	},
	imgThreeAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.ub_feature_three_img'
	}
};

export const version_1_1_2 = props => {
	const {
		column,
		columnOneTitle,
		columnTwoTitle,
		columnThreeTitle,
		columnOneBody,
		columnTwoBody,
		columnThreeBody,
		imgOneURL,
		imgOneAlt,
		imgTwoURL,
		imgTwoAlt,
		imgThreeURL,
		imgThreeAlt
	} = props.attributes;

	return (
		<div className={props.className}>
			<div className={`ub_feature_box column_${column}`}>
				<div className="ub_feature_1">
					<img
						className="ub_feature_one_img"
						src={imgOneURL}
						alt={imgOneAlt}
					/>
					<p className="ub_feature_one_title">{columnOneTitle}</p>
					<p className="ub_feature_one_body">{columnOneBody}</p>
				</div>
				<div className="ub_feature_2">
					<img
						className="ub_feature_two_img"
						src={imgTwoURL}
						alt={imgTwoAlt}
					/>
					<p className="ub_feature_two_title">{columnTwoTitle}</p>
					<p className="ub_feature_two_body">{columnTwoBody}</p>
				</div>
				<div className="ub_feature_3">
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

export const version_1_1_5 = props => {
	const {
		column,
		columnOneTitle,
		columnTwoTitle,
		columnThreeTitle,
		columnOneBody,
		columnTwoBody,
		columnThreeBody,
		imgOneURL,
		imgOneAlt,
		imgTwoURL,
		imgTwoAlt,
		imgThreeURL,
		imgThreeAlt,
		title1Align,
		title2Align,
		title3Align,
		body1Align,
		body2Align,
		body3Align
	} = props.attributes;

	return (
		<div className={props.className}>
			<div className={`ub_feature_box column_${column}`}>
				<div className="ub_feature_1">
					<img
						className="ub_feature_one_img"
						src={imgOneURL}
						alt={imgOneAlt}
					/>
					<p
						className="ub_feature_one_title"
						style={{ textAlign: title1Align }}
					>
						{columnOneTitle}
					</p>
					<p
						className="ub_feature_one_body"
						style={{ textAlign: body1Align }}
					>
						{columnOneBody}
					</p>
				</div>
				<div className="ub_feature_2">
					<img
						className="ub_feature_two_img"
						src={imgTwoURL}
						alt={imgTwoAlt}
					/>
					<p
						className="ub_feature_two_title"
						style={{ textAlign: title2Align }}
					>
						{columnTwoTitle}
					</p>
					<p
						className="ub_feature_two_body"
						style={{ textAlign: body2Align }}
					>
						{columnTwoBody}
					</p>
				</div>
				<div className="ub_feature_3">
					<img
						className="ub_feature_three_img"
						src={imgThreeURL}
						alt={imgThreeAlt}
					/>
					<p
						className="ub_feature_three_title"
						style={{ align: title3Align }}
					>
						{columnThreeTitle}
					</p>
					<p
						className="ub_feature_three_body"
						style={{ align: body3Align }}
					>
						{columnThreeBody}
					</p>
				</div>
			</div>
		</div>
	);
};
