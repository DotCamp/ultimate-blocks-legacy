export const version_1_1_2 = props => {
	const {
		buttonText,
		align,
		url,
		size,
		buttonColor,
		buttonTextColor,
		buttonRounded
	} = props.attributes;

	return (
		<div className={props.className}>
			<div className={'ub-button-container' + ' align-button-' + align}>
				<a
					href={url}
					target="_blank"
					className={'ub-button-block-btn' + ' ub-button-' + size}
					style={{
						backgroundColor: buttonColor,
						color: buttonTextColor,
						borderRadius: buttonRounded ? '60px' : '0px'
					}}
				>
					{buttonText}
				</a>
			</div>
		</div>
	);
};

export const version_1_1_4 = props => {
	const {
		buttonText,
		align,
		url,
		size,
		buttonColor,
		buttonTextColor,
		buttonRounded
	} = props.attributes;

	return (
		<div className={props.className}>
			<div className={'ub-button-container' + ' align-button-' + align}>
				<a
					href={url}
					target="_blank"
					className={'ub-button-block-btn' + ' ub-button-' + size}
					style={{
						backgroundColor: buttonColor,
						color: buttonTextColor,
						borderRadius: buttonRounded ? '60px' : '0px'
					}}
					rel="noopener noreferrer"
				>
					{buttonText}
				</a>
			</div>
		</div>
	);
};

export const version_1_1_5 = props => {
	const {
		buttonText,
		align,
		url,
		size,
		buttonColor,
		buttonTextColor,
		buttonRounded
	} = props.attributes;

	return (
		<div className={props.className}>
			<div className={'ub-button-container' + ' align-button-' + align}>
				<a
					href={url}
					target="_blank"
					className={'ub-button-block-btn' + ' ub-button-' + size}
					style={{
						backgroundColor: buttonColor,
						color: buttonTextColor,
						borderRadius: buttonRounded ? '60px' : '0px'
					}}
					rel="noopener noreferrer"
				>
					{buttonText}
				</a>
			</div>
		</div>
	);
};
