import React, { useState, useEffect } from "react";

export default function HalfCircle(props) {
	const [indicator, setIndicator] = useState(0);
	const [isActive, setIsActive] = useState(false);

	const {
		barColor,
		barBackgroundColor,
		barThickness,
		percent,
		labelColor,
		alignment,
		size,
		showNumber,
		numberPrefix,
		numberSuffix,
	} = props;

	useEffect(() => {
		setTimeout(() => {
			setIndicator(percent);
			setIsActive(true);
		}, 1000);
	}, []);

	useEffect(() => {
		if (isActive) {
			setIndicator(percent);
		}
	}, [percent]);

	const circleRadius = 50 - (barThickness + 2) / 2;
	const circlePathLength = circleRadius * Math.PI;
	const strokeArcLength = (circlePathLength * indicator) / 100;
	const progressBarPath = `M 50,50 m -${circleRadius},0 a ${circleRadius},${circleRadius} 0 1 1 ${
		circleRadius * 2
	},0`;

	return (
		<div
			className="ub_progress-bar-container"
			style={Object.assign(
				{
					height: `${size}px`,
					width: `${size}px`,
				},
				["left", "right"].includes(alignment)
					? { float: alignment }
					: { margin: "auto" },
			)}
		>
			<svg
				className="ub_progress-bar-circle"
				height={size}
				width={size}
				viewBox="0 0 100 100"
			>
				<path
					className="ub_progress-bar-circle-trail"
					d={progressBarPath}
					stroke={barBackgroundColor}
					strokeWidth={barThickness + 2}
					style={{
						strokeDasharray: `${circlePathLength}px, ${circlePathLength}px`,
					}}
				/>
				<path
					className="ub_progress-bar-circle-path"
					d={progressBarPath}
					stroke={barColor}
					strokeWidth={barThickness + 2}
					strokeLinecap={indicator === 0 ? "butt" : "round"}
					style={{
						strokeDasharray: `${strokeArcLength}px, ${circlePathLength}px`,
					}}
				/>
			</svg>
			{showNumber && (
				<div
					className="ub_progress-bar-label"
					style={{
						visibility: isActive ? "visible" : "hidden",
						color: labelColor || "inherit",
					}}
				>
					<span className="ub-progress-number-prefix">{numberPrefix}</span>
					<span className="ub-progress-number-value">{percent}</span>
					<span className="ub-progress-number-suffix">{numberSuffix}</span>
				</div>
			)}
		</div>
	);
}
