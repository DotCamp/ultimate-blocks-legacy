const version_1_1_2 = props => {
	const {
		ctaBackgroundColor,
		ctaBorderSize,
		ctaBorderColor,
		headFontSize,
		headColor,
		ub_call_to_action_headline_text,
		contentFontSize,
		contentColor,
		contentAlign,
		ub_cta_content_text,
		buttonColor,
		buttonWidth,
		url,
		buttonTextColor,
		buttonFontSize,
		ub_cta_button_text
	} = props.attributes;
	return (
		<div className={props.className}>
			<div
				className="ub_call_to_action"
				style={{
					backgroundColor: ctaBackgroundColor,
					border: ctaBorderSize + 'px solid',
					borderColor: ctaBorderColor
				}}
			>
				<div className="ub_call_to_action_headline">
					<p
						className="ub_call_to_action_headline_text"
						style={{
							fontSize: headFontSize + 'px',
							color: headColor
						}}
					>
						{ub_call_to_action_headline_text}
					</p>
				</div>
				<div className="ub_call_to_action_content">
					<p
						className="ub_cta_content_text"
						style={{
							fontSize: contentFontSize + 'px',
							color: contentColor,
							textAlign: contentAlign
						}}
					>
						{ub_cta_content_text}
					</p>
				</div>
				<div className="ub_call_to_action_button">
					<span
						className={`wp-block-button ub_cta_button`}
						style={{
							backgroundColor: buttonColor,
							width: buttonWidth + 'px'
						}}
					>
						<a href={url} target="_blank">
							<p
								className="ub_cta_button_text"
								style={{
									color: buttonTextColor,
									fontSize: buttonFontSize + 'px'
								}}
							>
								{ub_cta_button_text}
							</p>
						</a>
					</span>
				</div>
			</div>
		</div>
	);
};

export { version_1_1_2 };
