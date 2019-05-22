import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

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

export const version_2_0_0 = props => {
	const {
		buttonText,
		align,
		url,
		size,
		buttonColor,
		buttonTextColor,
		buttonHoverColor,
		buttonTextHoverColor,
		buttonRounded,
		chosenIcon,
		iconPosition,
		buttonIsTransparent,
		addNofollow,
		openInNewTab
	} = props.attributes;

	const dashesToCamelcase = str =>
		str
			.split('-')
			.map(s => s[0].toUpperCase() + s.slice(1))
			.join('');

	const generateIcon = (selectedIcon, size) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height={size}
			width={size}
			viewBox={`0, 0, ${selectedIcon.icon[0]}, ${selectedIcon.icon[1]}`}
		>
			<path fill={'currentColor'} d={selectedIcon.icon[4]} />
		</svg>
	);

	const iconSize = { small: 25, medium: 30, large: 35, larger: 40 };

	const allIcons = Object.assign(fas, fab);

	return (
		<div
			className={`${
				props.className
			} ub-button-container align-button-${align}`}
		>
			<a
				href={url}
				target={openInNewTab ? '_blank' : '_self'}
				rel={`noopener noreferrer${addNofollow ? ' nofollow' : ''}`}
				className={`ub-button-block-main ub-button-${size}`}
				data-defaultColor={buttonColor}
				data-defaultTextColor={buttonTextColor}
				data-hoverColor={buttonHoverColor}
				data-hoverTextColor={buttonTextHoverColor}
				data-buttonIsTransparent={buttonIsTransparent}
				style={{
					backgroundColor: buttonIsTransparent
						? 'transparent'
						: buttonColor,
					color: buttonIsTransparent ? buttonColor : buttonTextColor,
					borderRadius: buttonRounded ? '60px' : '0px',
					border: buttonIsTransparent
						? `3px solid ${buttonColor}`
						: 'none'
				}}
			>
				<div
					className="ub-button-content-holder"
					style={{
						flexDirection:
							iconPosition === 'left' ? 'row' : 'row-reverse'
					}}
				>
					{chosenIcon !== '' &&
						allIcons.hasOwnProperty(
							`fa${dashesToCamelcase(chosenIcon)}`
						) && (
							<span className="ub-button-icon-holder">
								{generateIcon(
									allIcons[
										`fa${dashesToCamelcase(chosenIcon)}`
									],
									iconSize[size]
								)}
							</span>
						)}
					<span className={'ub-button-block-btn'}>{buttonText}</span>
				</div>
			</a>
		</div>
	);
};
