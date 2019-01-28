import { Component } from 'react';

import Circle from './CircularCountdown';
import Odometer from './React-Odometer';

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = { timeLeft: this.remainingTime() };
	}
	remainingTime = () => {
		return this.props.deadline - Math.floor(Date.now() / 1000);
	};
	componentDidMount() {
		if (this.props.deadline - Math.floor(Date.now() / 1000) > 0) {
			this.tick = setInterval(this.ticker, 1000);
		}
	}
	ticker = () => {
		this.setState({
			timeLeft: this.remainingTime()
		});
	};
	componentWillReceiveProps(newProps) {
		if (newProps.deadline !== this.props.deadline) {
			clearInterval(this.tick);
			let timeLeft = newProps.deadline - Math.floor(Date.now() / 1000);
			this.setState({
				timeLeft: timeLeft
			});
			if (timeLeft > 0) {
				this.tick = setInterval(this.ticker, 1000);
			}
		}
	}
	componentDidUpdate() {
		if (this.state.timeLeft <= -1) {
			clearInterval(this.tick);
		}
	}
	componentWillUnmount() {
		clearInterval(this.tick);
	}
	render() {
		const { timeLeft } = this.state;
		const { color } = this.props;
		const seconds = timeLeft % 60;
		const minutes = ((timeLeft - seconds) % 3600) / 60;
		const hours = ((timeLeft - minutes * 60 - seconds) % 86400) / 3600;
		const days =
			((timeLeft - hours * 3600 - minutes * 60 - seconds) % 604800) /
			86400;
		const weeks =
			(timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) /
			604800;

		const defaultFormat = (
			<p>{`${weeks} weeks ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`}</p>
		);

		const circularFormat = (
			<div className="ub_countdown_circular_container">
				<Circle color={color} amount={weeks} total={52} />
				<Circle color={color} amount={days} total={7} />
				<Circle color={color} amount={hours} total={24} />
				<Circle color={color} amount={minutes} total={60} />
				<Circle color={color} amount={seconds} total={60} />
				<p>Weeks</p>
				<p>Days</p>
				<p>Hours</p>
				<p>Minutes</p>
				<p>Seconds</p>
			</div>
		);

		const separator = <span className="ub-countdown-separator">:</span>;

		const odometerFormat = (
			<div className="ub-countdown-odometer-container">
				<span>Weeks</span>
				<span />
				<span>Days</span>
				<span />
				<span>Hours</span>
				<span />
				<span>Minutes</span>
				<span />
				<span>Seconds</span>
				<Odometer
					value={
						weeks < 0
							? weeks
							: weeks +
							  10 **
									(weeks > 0
										? Math.floor(Math.log10(weeks) + 1)
										: 1)
					}
				/>
				{separator}
				<Odometer value={days < 0 ? days : 10 + days} />
				{separator}
				<Odometer value={hours < 0 ? hours : 100 + hours} />
				{separator}
				<Odometer value={minutes < 0 ? minutes : 100 + minutes} />
				{separator}
				<Odometer value={seconds < 0 ? seconds : 100 + seconds} />
			</div>
		);

		let selectedFormat;

		switch (this.props.timerStyle) {
			case 'Regular':
				selectedFormat = defaultFormat;
				break;
			case 'Circular':
				selectedFormat = circularFormat;
				break;
			case 'Odometer':
				selectedFormat = odometerFormat;
				break;
			default:
				selectedFormat = defaultFormat;
		}

		return selectedFormat;
	}
}

export default Timer;
