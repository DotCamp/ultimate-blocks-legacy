export const oldAttributes = {
	ub_call_to_action_headline_text: {
		type: 'array',
		source: 'children',
		selector: '.ub_call_to_action_headline_text'
	},
	ub_cta_content_text: {
		type: 'array',
		source: 'children',
		selector: '.ub_cta_content_text'
	},
	ub_cta_button_text: {
		type: 'array',
		source: 'children',
		selector: '.ub_cta_button_text'
	},
	headFontSize: {
		type: 'number',
		default: 30
	},
	headColor: {
		type: 'string',
		default: '#444444'
	},
	headAlign: {
		type: 'string',
		default: 'center'
	},
	contentFontSize: {
		type: 'number',
		default: 15
	},
	contentColor: {
		type: 'string',
		default: '#444444'
	},
	buttonFontSize: {
		type: 'number',
		default: 14
	},
	buttonColor: {
		type: 'string',
		default: '#E27330'
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff'
	},
	buttonWidth: {
		type: 'number',
		default: 250
	},
	ctaBackgroundColor: {
		type: 'string',
		default: '#f8f8f8'
	},
	ctaBorderColor: {
		type: 'string',
		default: '#ECECEC'
	},
	ctaBorderSize: {
		type: 'number',
		default: 2
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href'
	},
	contentAlign: {
		type: 'string',
		default: 'center'
	},
	addNofollow: {
		type: 'boolean',
		default: false
	},
	openInNewTab: {
		type: 'boolean',
		default: false
	}
};

export const version_1_1_2 = props => {
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

export const version_1_1_4 = props => {
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
						<a href={url} target="_blank" rel="noopener noreferrer">
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

export const version_1_1_5 = props => {
	const {
		ctaBackgroundColor,
		ctaBorderSize,
		ctaBorderColor,
		headFontSize,
		headColor,
		headAlign,
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
							color: headColor,
							textAlign: headAlign
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
						<a href={url} target="_blank" rel="noopener noreferrer">
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

export const version_2_0_0 = props => {
	const {
		ctaBackgroundColor,
		ctaBorderSize,
		ctaBorderColor,
		headFontSize,
		headColor,
		headAlign,
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
		ub_cta_button_text,
		addNofollow,
		openInNewTab
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
							color: headColor,
							textAlign: headAlign
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
					<a
						href={url}
						target={openInNewTab ? '_blank' : '_self'}
						rel={`${
							addNofollow ? 'nofollow ' : ''
						}noopener noreferrer`}
						className={`wp-block-button ub_cta_button`}
						style={{
							backgroundColor: buttonColor,
							width: buttonWidth + 'px'
						}}
					>
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
				</div>
			</div>
		</div>
	);
};

export const updateFrom = oldVersion => {
	return { attributes: oldAttributes, save: oldVersion };
};
