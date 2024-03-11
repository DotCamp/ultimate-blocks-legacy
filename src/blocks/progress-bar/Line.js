/*Line.js, derived from React-Component Progress Bar

The MIT License (MIT)

Copyright (c) 2014-present yiminghe

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { useState, useEffect } from "react";

export default function Line(props) {
	const [indicator, setIndicator] = useState(0);
	const [isActive, setIsActive] = useState(false);

	const {
		barColor,
		barBackgroundColor,
		barThickness,
		percent,
		labelColor,
		percentagePosition,
		isStripe,
		detailAlign,
		detail,
		setAttributes,
		alignment,
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

	const progressBarPath = `M ${barThickness / 2},${barThickness / 2} L ${
		100 - barThickness / 2
	},${barThickness / 2}`;

	const insideLabelClass =
		percentagePosition === "inside" ? " ub_progress-bar-label-inside" : "";
	const stripeStyleClass = isStripe ? " ub_progress-bar-stripe" : "";
	return (
		<div
			className={`ub_progress-bar-container${insideLabelClass}${stripeStyleClass}`}
		>
			<div
				className="ub_progress-detail-wrapper"
				style={{ justifyContent: alignment }}
			>
				<div className="ub_progress-bar-text">
					<RichText
						tagName="p"
						style={{ textAlign: detailAlign }}
						placeholder={__("Progress bar description")}
						value={detail}
						onChange={(text) => setAttributes({ detail: text })}
						keepPlaceholderOnFocus={true}
					/>
				</div>
				{showNumber && percentagePosition === "top" && (
					<div
						className="ub_progress-bar-label ub_progress-bar-label-top"
						style={{
							width: `${percent}%`,
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
			<svg
				className="ub_progress-bar-line"
				viewBox={`0 0 100 ${barThickness}`}
				preserveAspectRatio="none"
			>
				<path
					className="ub_progress-bar-line-trail"
					d={progressBarPath}
					stroke={barBackgroundColor}
					strokeWidth={barThickness}
				/>
				<path
					className="ub_progress-bar-line-path"
					d={progressBarPath}
					stroke={barColor}
					strokeWidth={barThickness}
					style={{ strokeDashoffset: `${100 - indicator}px` }}
				/>
				{isStripe && (
					<foreignObject width="100%" height="100%">
						<div className="ub_progress-bar-line-stripe" />
					</foreignObject>
				)}
				{showNumber && percentagePosition === "inside" && (
					<foreignObject
						width="100%"
						height="100%"
						viewBox="0 0 120 10"
						x="0"
						y="0"
					>
						<div
							className="ub_progress-bar-label"
							style={{
								width: `${percent}%`,
								visibility: isActive ? "visible" : "hidden",
								color: labelColor || "inherit",
							}}
						>
							<p>
								<span className="ub-progress-number-prefix">
									{numberPrefix}
								</span>
								<span className="ub-progress-number-value">{percent}</span>
								<span className="ub-progress-number-suffix">
									{numberSuffix}
								</span>
							</p>
						</div>
					</foreignObject>
				)}
			</svg>
			{showNumber && percentagePosition === "bottom" && (
				<div
					className="ub_progress-bar-label"
					style={{
						width: `${percent}%`,
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
