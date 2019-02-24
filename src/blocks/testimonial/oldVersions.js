const version_1_1_2 = props => {
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

export { version_1_1_2 };
