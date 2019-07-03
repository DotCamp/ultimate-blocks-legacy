export const version_1_1_2 = props => {
	const {
		borderSize,
		borderStyle,
		borderColor,
		borderHeight
	} = props.attributes;

	return (
		<div className={props.className}>
			<div
				className="ub_divider"
				style={{
					borderTop: `${borderSize}px ${borderStyle} ${borderColor}`,
					marginTop: borderHeight + 'px',
					marginBottom: borderHeight + 'px'
				}}
			/>
		</div>
	);
};
