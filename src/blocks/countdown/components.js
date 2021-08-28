import { Component } from "react";

import Circle from "./CircularCountdown";
import { DigitDisplay } from "./odometer";

const { __ } = wp.i18n;

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeLeft: this.remainingTime(),
			numberChange: Array(5).fill("none"), //one for each of the following: week, day, hour, minute, second
			forceRefresh: false,
		};
	}
	remainingTime = () => this.props.deadline - Math.floor(Date.now() / 1000);

	componentDidMount() {
		if (this.props.deadline - Math.floor(Date.now() / 1000) > 0) {
			this.tick = setInterval(this.ticker, 1000);
		}
	}
	ticker = () => {
		this.setState({ timeLeft: this.remainingTime() });
	};
	componentWillReceiveProps(newProps) {
		if (newProps.deadline !== this.props.deadline) {
			clearInterval(this.tick);
			let timeLeft = newProps.deadline - Math.floor(Date.now() / 1000);
			this.setState({ timeLeft: timeLeft });
			if (timeLeft > 0) {
				this.tick = setInterval(this.ticker, 1000);
			}
		}
	}
	componentDidUpdate(prevProps, prevState) {
		const { timeLeft, numberChange } = this.state;
		const { largestUnit, forceUpdate, finishForcedUpdate } = this.props;
		if (timeLeft <= -1) {
			clearInterval(this.tick);
		}

		if (timeLeft !== prevState.timeLeft) {
			const timeUnits = ["week", "day", "hour", "minute", "second"];
			//begin old values
			const oldSeconds = prevState.timeLeft % 60;
			const oldMinutes = ((prevState.timeLeft - oldSeconds) % 3600) / 60;

			let oldHours = (prevState.timeLeft - oldMinutes * 60 - oldSeconds) / 3600;
			if (timeUnits.indexOf(largestUnit) < 2) {
				oldHours %= 24;
			}

			let oldDays =
				(prevState.timeLeft - oldHours * 3600 - oldMinutes * 60 - oldSeconds) /
				86400;
			if (largestUnit === "week") {
				oldDays %= 7;
			}

			const oldWeeks =
				(prevState.timeLeft -
					oldDays * 86400 -
					oldHours * 3600 -
					oldMinutes * 60 -
					oldSeconds) /
				604800;

			const oldValues = [oldWeeks, oldDays, oldHours, oldMinutes, oldSeconds];

			//begin new values
			const seconds = timeLeft % 60;
			const minutes = ((timeLeft - seconds) % 3600) / 60;

			let hours = (timeLeft - minutes * 60 - seconds) / 3600;
			if (timeUnits.indexOf(largestUnit) < 2) {
				hours %= 24;
			}

			let days = (timeLeft - hours * 3600 - minutes * 60 - seconds) / 86400;
			if (largestUnit === "week") {
				days %= 7;
			}

			const weeks =
				(timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) /
				604800;

			const newValues = [weeks, days, hours, minutes, seconds];

			if (this.props.timerStyle === "Odometer") {
				this.setState({
					numberChange: numberChange.map((_, i) => {
						if (newValues[i] === oldValues[i]) {
							return "none";
						} else if (timeLeft > prevState.timeLeft) {
							//increase/decrease should be based on timestamp value instead of value of individual units
							return "increase";
						} else {
							return "decrease";
						}
					}),
				});
			}
		}

		if (forceUpdate !== prevProps.forceUpdate) {
			if (forceUpdate) {
				this.setState({ forceRefresh: true });

				finishForcedUpdate();
			}
		}
	}
	componentWillUnmount() {
		clearInterval(this.tick);
	}
	render() {
		const { timeLeft, numberChange, forceRefresh } = this.state;
		const { color, size, largestUnit, smallestUnit } = this.props;
		const timeUnits = ["week", "day", "hour", "minute", "second"];

		//apply value conversion only to days and hours

		const seconds = timeLeft % 60;
		const minutes = ((timeLeft - seconds) % 3600) / 60;

		let hours = (timeLeft - minutes * 60 - seconds) / 3600;
		if (timeUnits.indexOf(largestUnit) < 2) {
			hours %= 24;
		}

		let days = (timeLeft - hours * 3600 - minutes * 60 - seconds) / 86400;
		if (largestUnit === "week") {
			days %= 7;
		}

		const weeks =
			(timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) /
			604800;

		const diff =
			timeUnits.indexOf(this.props.smallestUnit) -
			timeUnits.indexOf(this.props.largestUnit) +
			1;

		const defaultFormat = (
			<p>
				{[
					`${weeks} ${__("weeks", "ultimate-blocks")}`,
					`${days} ${__("days", "ultimate-blocks")}`,
					`${hours} ${__("hours", "ultimate-blocks")}`,
					`${minutes} ${__("minutes", "ultimate-blocks")}`,
					`${seconds} ${__("seconds", "ultimate-blocks")}`,
				]
					.slice(
						timeUnits.indexOf(largestUnit),
						timeUnits.indexOf(smallestUnit) + 1
					)
					.join(" ")}
			</p>
		);

		const circularFormatValues = [
			<Circle color={color} size={size} amount={weeks} total={52} />,
			<Circle color={color} size={size} amount={days} total={7} />,
			<Circle color={color} size={size} amount={hours} total={24} />,
			<Circle color={color} size={size} amount={minutes} total={60} />,
			<Circle color={color} size={size} amount={seconds} total={60} />,
		].slice(
			timeUnits.indexOf(largestUnit),
			timeUnits.indexOf(smallestUnit) + 1
		);

		const circularFormatLabels = [
			<p>{__("Weeks", "ultimate-blocks")}</p>,
			<p>{__("Days", "ultimate-blocks")}</p>,
			<p>{__("Hours", "ultimate-blocks")}</p>,
			<p>{__("Minutes", "ultimate-blocks")}</p>,
			<p>{__("Seconds", "ultimate-blocks")}</p>,
		].slice(
			timeUnits.indexOf(largestUnit),
			timeUnits.indexOf(smallestUnit) + 1
		);

		const circularFormat = (
			<div
				className="ub_countdown_circular_container"
				style={{ gridTemplateColumns: Array(diff).fill("1fr").join(" ") }}
			>
				{circularFormatValues}
				{circularFormatLabels}
			</div>
		);

		const separator = <span className="ub-countdown-separator">:</span>;

		const odometerLabels = [
			<span>{__("Weeks", "ultimate-blocks")}</span>,
			<span>{__("Days", "ultimate-blocks")}</span>,
			<span>{__("Hours", "ultimate-blocks")}</span>,
			<span>{__("Minutes", "ultimate-blocks")}</span>,
			<span>{__("Seconds", "ultimate-blocks")}</span>,
		].slice(
			timeUnits.indexOf(largestUnit),
			timeUnits.indexOf(smallestUnit) + 1
		);

		const odometerValues = [
			<DigitDisplay
				value={weeks}
				numberChange={numberChange[0]}
				stopAnimation={() => {
					this.setState({ numberChange: ["none", ...numberChange.slice(1)] });
				}}
				forceRefresh={forceRefresh}
				finishForceRefresh={() => {
					this.setState({
						forceRefresh: false,
						numberChange: ["none", ...numberChange.slice(1)],
					});
				}}
			/>,
			<DigitDisplay
				value={days}
				maxDisplay={largestUnit === "week" ? 6 : 0}
				numberChange={numberChange[1]}
				stopAnimation={() => {
					this.setState({
						numberChange: [numberChange[0], "none", ...numberChange.slice(2)],
					});
				}}
				forceRefresh={forceRefresh}
				finishForceRefresh={() => {
					this.setState({
						forceRefresh: false,
						numberChange: [numberChange[0], "none", ...numberChange.slice(2)],
					});
				}}
			/>,
			<DigitDisplay
				value={hours}
				maxDisplay={largestUnit === "hour" ? 0 : 23}
				numberChange={numberChange[2]}
				stopAnimation={() => {
					this.setState({
						numberChange: [
							...numberChange.slice(0, 2),
							"none",
							...numberChange.slice(3),
						],
					});
				}}
				forceRefresh={forceRefresh}
				finishForceRefresh={() => {
					this.setState({
						forceRefresh: false,
						numberChange: [
							...numberChange.slice(0, 2),
							"none",
							...numberChange.slice(3),
						],
					});
				}}
			/>,
			<DigitDisplay
				value={minutes}
				maxDisplay={59}
				numberChange={numberChange[3]}
				stopAnimation={() => {
					this.setState({
						numberChange: [
							...numberChange.slice(0, 3),
							"none",
							numberChange[4],
						],
					});
				}}
				forceRefresh={forceRefresh}
				finishForceRefresh={() => {
					this.setState({
						forceRefresh: false,
						numberChange: [
							...numberChange.slice(0, 3),
							"none",
							numberChange[4],
						],
					});
				}}
			/>,
			<DigitDisplay
				value={seconds}
				maxDisplay={59}
				numberChange={numberChange[4]}
				stopAnimation={() => {
					this.setState({
						numberChange: [...numberChange.slice(0, 4), "none"],
					});
				}}
				forceRefresh={forceRefresh}
				finishForceRefresh={() => {
					this.setState({
						forceRefresh: false,
						numberChange: [...numberChange.slice(0, 4), "none"],
					});
				}}
			/>,
		].slice(
			timeUnits.indexOf(largestUnit),
			timeUnits.indexOf(smallestUnit) + 1
		);

		const odometerFormat = (
			<div>
				<div
					className="ub-countdown-odometer-container"
					style={{
						gridTemplateColumns: Array(diff).fill("1fr").join(" auto "),
					}}
				>
					{odometerLabels
						.map((e, i) =>
							i < odometerLabels.length - 1 ? [e, <span />] : [e]
						)
						.reduce((a, b) => a.concat(b))}
					{odometerValues
						.map((e, i) =>
							i < odometerValues.length - 1 ? [e, separator] : [e]
						)
						.reduce((a, b) => a.concat(b))}
				</div>
			</div>
		);

		let selectedFormat;

		switch (this.props.timerStyle) {
			case "Circular":
				selectedFormat = circularFormat;
				break;
			case "Odometer":
				selectedFormat = odometerFormat;
				break;
			case "Regular":
			default:
				selectedFormat = defaultFormat;
				break;
		}

		return selectedFormat;
	}
}

export default Timer;
