import icon, {
	RegularCountdownIcon,
	CircularCountdownIcon,
	TickingCountdownIcon
} from './icon';

import { Component } from 'react';

import Circle from './CircularCountdown';
import Odometer from './React-Odometer';

import './style.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const {
	DateTimePicker,
	ButtonGroup,
	IconButton,
	PanelBody,
	TextareaControl
} = wp.components;

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = { timeLeft: this.remainingTime() };
	}
	remainingTime = () => {
		return this.props.deadline - Math.floor(Date.now() / 1000);
	};
	componentDidMount() {
		this.tick = setInterval(this.ticker, 1000);
	}
	ticker = () => {
		this.setState({
			timeLeft: this.remainingTime()
		});
	};
	componentWillReceiveProps(newProps) {
		if (newProps.deadline !== this.props.deadline) {
			clearInterval(this.tick);
			this.setState({
				timeLeft: newProps.deadline - Math.floor(Date.now() / 1000)
			});
			this.tick = setInterval(this.ticker, 1000);
		}
	}
	componentDidUpdate() {
		if (this.state.timeLeft === -1) {
			clearInterval(this.tick);
		}
	}
	componentWillUnmount() {
		clearInterval(this.tick);
	}
	render() {
		const { timeLeft } = this.state;
		const { expiryMessage } = this.props;
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
				<Circle amount={weeks} total={52} />
				<Circle amount={days} total={7} />
				<Circle amount={hours} total={24} />
				<Circle amount={minutes} total={60} />
				<Circle amount={seconds} total={60} />
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

		return timeLeft < 0 ? <p>{expiryMessage}</p> : selectedFormat;
	}
}

registerBlockType('ub/countdown', {
	title: __('Countdown'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Countdown'), __('Timer'), __('Ultimate Blocks')],
	attributes: {
		endDate: {
			type: 'number',
			default: 60 * (1440 + Math.ceil(Date.now() / 60000)) // 24 hours from Date.now
		},
		style: {
			type: 'string',
			default: 'Regular' //available types: Regular, Circular, Odometer
		},
		expiryMessage: {
			type: 'string',
			default: 'Timer expired'
		}
	},

	edit(props) {
		const { isSelected, setAttributes } = props;
		const { style, endDate, expiryMessage } = props.attributes;

		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Timer expiration')}>
						<DateTimePicker
							currentDate={endDate * 1000}
							onChange={value => {
								console.log(
									Math.floor(Date.parse(value) / 1000)
								);
								setAttributes({
									endDate: Math.floor(
										Date.parse(value) / 1000
									)
								});
							}}
						/>
					</PanelBody>
					<PanelBody title={__('Timer Style')}>
						<ButtonGroup className="ub_countdown_style_selector">
							<IconButton
								isPrimary={style === 'Regular'}
								icon={RegularCountdownIcon}
								label={__('Regular')}
								onClick={() =>
									setAttributes({ style: 'Regular' })
								}
							/>
							<IconButton
								isPrimary={style === 'Circular'}
								icon={CircularCountdownIcon}
								label={__('Circular')}
								onClick={() =>
									setAttributes({ style: 'Circular' })
								}
							/>
							<IconButton
								isPrimary={style === 'Odometer'}
								icon={TickingCountdownIcon}
								label={__('Odometer')}
								onClick={() =>
									setAttributes({ style: 'Odometer' })
								}
							/>
						</ButtonGroup>
					</PanelBody>
					<PanelBody title={__('Display text when expired')}>
						<TextareaControl
							value={expiryMessage}
							onChange={text =>
								setAttributes({ expiryMessage: text })
							}
						/>
					</PanelBody>
				</InspectorControls>
			),

			<Timer
				timerStyle={style}
				deadline={endDate}
				expiryMessage={expiryMessage}
			/>
		];
	},

	save() {
		return null;
	}
});
