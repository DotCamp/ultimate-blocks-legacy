/*Circle.js, derived from React-Component Progress Bar

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

import { useEffect, useState } from "react";

function Circle(props) {
	const { amount, total, color, size } = props;
	const circleRadius = 35;
	const circlePathLength = circleRadius * Math.PI * 2;
	const strokeArcLength = (circlePathLength * indicator) / total;
	const progressBarPath = `M 50,50 m 0,${-circleRadius} a ${circleRadius},${circleRadius} 0 1 1 0,${
		circleRadius * 2
	} a ${circleRadius},${circleRadius} 0 1 1 0,${-circleRadius * 2}`;
	const [indicator, setIndicator] = useState(0);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIndicator(props.amount);
			setIsActive(true);
		}, 1000);
	}, []);

	useEffect(() => {
		if (isActive) {
			setIndicator(amount);
		}
	}, [amount]);

	return (
		<div
			style={{
				height: `${size}px`,
				width: `${size}px`,
			}}
		>
			<svg height={size} width={size} viewBox="0 0 100 100">
				<path
					className="ub_countdown_circle_trail"
					d={progressBarPath}
					strokeWidth={3}
					style={{
						strokeDasharray: `${circlePathLength}px, ${circlePathLength}px`,
					}}
				/>
				<path
					className="ub_countdown_circle_path"
					d={progressBarPath}
					stroke={color}
					strokeWidth={3}
					strokeLinecap={indicator === 0 ? "butt" : "round"}
					style={{
						strokeDasharray: `${strokeArcLength}px, ${circlePathLength}px`,
					}}
				/>
			</svg>
			<div
				className="ub_countdown_circle_label ub-countdown-digit"
				style={{ visibility: isActive ? "visible" : "hidden" }}
			>
				{amount}
			</div>
		</div>
	);
}

export default Circle;
