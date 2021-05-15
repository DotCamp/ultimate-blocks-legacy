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

import { Component } from "react";

export default class Circle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			indicator: 0,
			isActive: false,
		};
	}
	componentDidMount() {
		setTimeout(
			() =>
				this.setState({
					indicator: this.props.percent,
					isActive: true,
				}),
			1000
		);
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.isActive && this.props.percent !== nextProps.percent) {
			this.setState({ indicator: nextProps.percent });
		}
		
	}
	render() {
		const { barColor, barThickness, percent, labelColor, alignment } =
			this.props;
		const { indicator, isActive } = this.state;
		const circleRadius = 50 - (barThickness + 3) / 2;
		const circlePathLength = circleRadius * Math.PI * 2;
		const strokeArcLength = (circlePathLength * indicator) / 100;
		const progressBarPath = `M 50,50 m 0,${-circleRadius} a ${circleRadius},${circleRadius} 0 1 1 0,${
			circleRadius * 2
		} a ${circleRadius},${circleRadius} 0 1 1 0,${-circleRadius * 2}`;
		const size = 150;

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
						: { margin: "auto" }
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
						strokeWidth={3}
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
				<div
					className="ub_progress-bar-label"
					style={{
						visibility: isActive ? "visible" : "hidden",
						color: labelColor || "inherit",
					}}
				>
					{percent}%
				</div>
			</div>
		);
	}
}
