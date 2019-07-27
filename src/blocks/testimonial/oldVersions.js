export const oldAttributes = {
	ub_testimonial_text: {
		type: 'array',
		source: 'children',
		selector: '.ub_testimonial_text'
	},
	textAlign: {
		type: 'string',
		default: 'justify'
	},
	ub_testimonial_author: {
		type: 'array',
		source: 'children',
		selector: '.ub_testimonial_author'
	},
	authorAlign: {
		type: 'string',
		default: 'right'
	},
	ub_testimonial_author_role: {
		type: 'array',
		source: 'children',
		selector: '.ub_testimonial_author_role'
	},
	authorRoleAlign: {
		type: 'string',
		default: 'right'
	},
	imgURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: 'img'
	},
	imgID: {
		type: 'number'
	},
	imgAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: 'img'
	},
	backgroundColor: {
		type: 'string',
		default: '#f4f6f6'
	},
	textColor: {
		type: 'string',
		default: '#444444'
	},
	textSize: {
		type: 'number',
		default: 17
	}
};

export const version_1_1_2 = props => {
	const {
		backgroundColor,
		textColor,
		textSize,
		imgURL,
		imgAlt,
		ub_testimonial_author,
		ub_testimonial_author_role,
		ub_testimonial_text
	} = props.attributes;
	return (
		<div className={props.className}>
			<div
				className="ub_testimonial"
				style={{
					backgroundColor: backgroundColor,
					color: textColor
				}}
			>
				<div className="ub_testimonial_img">
					<img src={imgURL} alt={imgAlt} height={100} width={100} />
				</div>
				<div className="ub_testimonial_content">
					<p
						className="ub_testimonial_text"
						style={{
							fontSize: textSize
						}}
					>
						{ub_testimonial_text}
					</p>
				</div>
				<div className="ub_testimonial_sign">
					<p className="ub_testimonial_author">
						{ub_testimonial_author}
					</p>
					<i className="ub_testimonial_author_role">
						{ub_testimonial_author_role}
					</i>
				</div>
			</div>
		</div>
	);
};

export const version_1_1_5 = props => {
	const {
		backgroundColor,
		textColor,
		textSize,
		imgURL,
		imgAlt,
		ub_testimonial_author,
		ub_testimonial_author_role,
		ub_testimonial_text,
		textAlign,
		authorAlign,
		authorRoleAlign
	} = props.attributes;
	return (
		<div className={props.className}>
			<div
				className="ub_testimonial"
				style={{
					backgroundColor: backgroundColor,
					color: textColor
				}}
			>
				<div className="ub_testimonial_img">
					<img src={imgURL} alt={imgAlt} height={100} width={100} />
				</div>
				<div className="ub_testimonial_content">
					<p
						className="ub_testimonial_text"
						style={{
							fontSize: textSize,
							textAlign: textAlign
						}}
					>
						{ub_testimonial_text}
					</p>
				</div>
				<div className="ub_testimonial_sign">
					<p
						className="ub_testimonial_author"
						style={{ textAlign: authorAlign }}
					>
						{ub_testimonial_author}
					</p>
					<p
						className="ub_testimonial_author_role"
						style={{ textAlign: authorRoleAlign }}
					>
						{ub_testimonial_author_role}
					</p>
				</div>
			</div>
		</div>
	);
};

export const updateFrom = oldVersion => ({
	attributes: oldAttributes,
	save: oldVersion
});
