import { Component } from "react";

function delay(ms) {
	//adapted from from https://stackoverflow.com/a/39496056
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function breakIntoDigits(num) {
	//taken from https://stackoverflow.com/a/7784664
	let digits = [];
	while (num > 0) {
		digits.push(num % 10);
		num = parseInt(num / 10);
	}
	return digits.reverse();
}

function integerArray(limit1, limit2) {
	if (limit1 === limit2) {
		return [limit1];
	} else if (limit1 < limit2) {
		return [...Array(limit2 - limit1 + 1).keys()].map((a) => a + limit1);
	} else {
		return [...Array(limit1 - limit2 + 1).keys()].map((a) => limit1 - a);
	}
}

class MovingDigits extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAnimating: false,
			currentAnimation: null,
		};
	}
	componentDidMount() {
		//display the lowest number to prepare for downward movement

		if (this.props.dir === "decrease") {
			this.setState({
				currentAnimation: `translateY(${
					100 * (1 / this.props.digits.length - 1)
				}%)`,
			});
		}

		this.setState({ isAnimating: true });
	}
	componentDidUpdate() {
		const setNewTransform = (newTransform) => {
			if (this.state.currentAnimation !== newTransform) {
				delay(40)
					.then(() => {
						this.setState({
							currentAnimation: newTransform,
						});
						return delay(300);
					})
					.then(() => {
						this.props.dismountEvent();
					});
			}
		};
		if (this.state.isAnimating) {
			if (this.props.dir === "decrease") {
				//animate scrolling to top number
				setNewTransform("translateY(0)");
			}
			if (this.props.dir === "increase") {
				//animate scrolling to bottom number
				setNewTransform(
					`translateY(${100 * (1 / this.props.digits.length - 1)}%)`
				);
			}
		}
	}
	render() {
		return (
			<div
				className="moving-digit"
				style={{
					transform: this.state.currentAnimation,
					transition: this.state.isAnimating ? "all 0.3s" : null,
				}}
			>
				{this.props.digits.map((d, j) => (
					<div key={j} className="digit">
						{d}
					</div>
				))}
			</div>
		);
	}
}

export class DigitDisplay extends Component {
	constructor(props) {
		super(props);

		this.state = {
			displayValue: 0,
			digits: [0, 0],
			incomingDigits: [],
			digitChange: "none",
		};
	}
	static defaultProps = {
		value: 0,
		minDisplay: 0,
		maxDisplay: 0,
		numberChange: "none",
	};

	componentDidMount() {
		const { value, maxDisplay } = this.props;

		const digitCount = maxDisplay
			? Math.floor(Math.log10(maxDisplay)) + 1
			: value === 0
			? 1
			: Math.floor(Math.log10(value)) + 1;
		let currentDigits = breakIntoDigits(value);
		if (currentDigits.length < digitCount) {
			currentDigits.unshift(
				...Array(digitCount - currentDigits.length).fill(0)
			);
		}
		this.setState({ digits: currentDigits, displayValue: value });
	}

	componentDidUpdate(prevProps) {
		const { displayValue } = this.state;

		const {
			maxDisplay,
			value,
			numberChange,
			forceRefresh,
			finishForceRefresh,
		} = this.props;

		if (prevProps.numberChange !== numberChange) {
			//begin animation
			const digitCount = maxDisplay
				? Math.floor(Math.log10(maxDisplay)) + 1
				: value === 0 && displayValue === 0
				? 1
				: Math.floor(Math.log10(Math.max(value, displayValue))) + 1;

			//currently displayed digits
			let currentDigits = breakIntoDigits(displayValue);
			if (currentDigits.length < digitCount) {
				currentDigits.unshift(
					...Array(digitCount - currentDigits.length).fill(0)
				);
			}

			//replacement digits
			let newDigits = breakIntoDigits(value);
			if (newDigits.length < digitCount) {
				newDigits.unshift(...Array(digitCount - newDigits.length).fill(0));
			}

			if (numberChange === "increase") {
				let maxDigits = breakIntoDigits(maxDisplay || value);
				if (maxDigits.length === 0) {
					maxDigits = [0];
				}

				let extraDigits = [];
				let prevDigits = [];

				newDigits = newDigits.map((d, i) => {
					let currentMax =
						currentDigits[i - 1] === maxDigits[i - 1] ? maxDigits[i] : 9;

					if (prevDigits.length > 1) {
						let prevDigits2 = prevDigits.slice(1, prevDigits.length - 1);
						let cycle = prevDigits2.map((p) =>
							integerArray(0, maxDigits[i - 1] === p ? maxDigits[i] : 9)
						);
						extraDigits = cycle.reduce((prev, curr) => prev.concat(curr), []);
					}

					if (d === currentDigits[i]) {
						if (value > displayValue) {
							prevDigits =
								prevDigits.length > 0
									? [
											...integerArray(d, currentMax),
											...extraDigits,
											...integerArray(0, d),
									  ]
									: [d];
						} else {
							prevDigits = [...extraDigits, ...integerArray(0, d)];
						}
					} else if (currentDigits[i] < d) {
						if (prevDigits.length > 1) {
							prevDigits = [
								...integerArray(currentDigits[i], currentMax),
								...extraDigits,
								...integerArray(0, d),
							];
						} else {
							prevDigits = integerArray(currentDigits[i], d);
						}
					} else {
						prevDigits = [
							...integerArray(currentDigits[i], currentMax),
							...extraDigits,
							...integerArray(0, d),
						];
					}
					return prevDigits.length > 1 ? prevDigits : d;
				});

				this.setState({ incomingDigits: newDigits });
			} else if (numberChange === "decrease") {
				let maxDigits = breakIntoDigits(maxDisplay || displayValue);

				if (maxDigits.length === 0) {
					maxDigits = [0];
				}

				let extraDigits = [];
				let prevDigits = [];

				newDigits = newDigits.map((d, i) => {
					let currentMax =
						newDigits[i - 1] === maxDigits[i - 1] ? maxDigits[i] : 9;

					if (prevDigits.length > 1) {
						let prevDigits2 = prevDigits.slice(1, prevDigits.length - 1);
						let cycle = prevDigits2.map((p) =>
							integerArray(0, maxDigits[i - 1] === p ? maxDigits[i] : 9)
						);
						extraDigits = cycle.reduce((prev, curr) => prev.concat(curr), []);
					}

					if (d === currentDigits[i]) {
						if (value < displayValue) {
							prevDigits =
								prevDigits.length > 0
									? [
											...integerArray(d, currentMax),
											...extraDigits,
											...integerArray(0, d),
									  ]
									: [d];
						} else {
							prevDigits = [
								...integerArray(d, currentMax),
								...extraDigits,
								...integerArray(0, d),
							];
						}
					} else if (currentDigits[i] > d) {
						if (prevDigits.length > 1) {
							prevDigits = [
								...integerArray(d, currentMax),
								...extraDigits,
								...integerArray(0, currentDigits[i]),
							];
						} else {
							prevDigits = integerArray(d, currentDigits[i]);
						}
					} else {
						prevDigits = [
							...integerArray(d, currentMax),
							...extraDigits,
							...integerArray(0, currentDigits[i]),
						];
					}
					return prevDigits.length > 1 ? prevDigits : d;
				});

				this.setState({ incomingDigits: newDigits });
			}
		}

		if (forceRefresh && !prevProps.forceRefresh) {
			const maxDigitCount = Math.floor(
				Math.log10(maxDisplay || value || 1) + 1
			);
			let newDigits = breakIntoDigits(value);
			const missingDigits = maxDigitCount - newDigits.length;

			if (missingDigits > 0) {
				newDigits = [...Array(missingDigits).fill(0), ...newDigits];
			}

			this.setState({ displayValue: value, digits: newDigits });
			finishForceRefresh();
		}
	}

	render() {
		const { digits, incomingDigits } = this.state;

		const { value, maxDisplay, numberChange } = this.props;

		return (
			<div className="ub-countdown-digit-container">
				{incomingDigits.length === 0 &&
					digits.map((d, i) => (
						<div key={i} className="digit">
							{d}
						</div>
					))}
				{incomingDigits.map((d, i) =>
					!Array.isArray(d) ? (
						<div key={i} className="digit">
							{d}
						</div>
					) : (
						<MovingDigits
							digits={d}
							key={i}
							dir={numberChange}
							dismountEvent={() => {
								let replacementDigits = incomingDigits.map((d) => {
									if (Array.isArray(d)) {
										return numberChange === "increase" ? d[d.length - 1] : d[0];
									} else {
										return d;
									}
								});

								if (
									maxDisplay === 0 &&
									numberChange !== "increase" &&
									replacementDigits.length > 1 &&
									replacementDigits[0] === 0
								) {
									replacementDigits = replacementDigits.slice(
										replacementDigits.length - Math.floor(Math.log10(value) + 1)
									);
								}

								this.setState({
									incomingDigits: [],
									digits: replacementDigits,
									displayValue: value,
								});
								this.props.stopAnimation();
							}}
						/>
					)
				)}
			</div>
		);
	}
}
