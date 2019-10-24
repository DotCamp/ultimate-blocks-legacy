const { RichText, URLInput } = wp.blockEditor || wp.editor;
const { Dashicon } = wp.components;
const { __ } = wp.i18n;
import { Component } from 'react';

export class OldStars extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			value,
			activeStarColor,
			limit,
			id,
			className,
			inactiveStarColor,
			style
		} = this.props;
		return (
			<div
				className={className}
				style={Object.assign(
					{
						display: 'flex',
						flexDirection: 'flex-row'
					},
					style
				)}
			>
				{[...Array(limit).keys()].map(i => (
					<svg key={i} height="20" width="20" viewBox="0 0 150 150">
						<defs>
							<mask id={`ub_review_star_filter-${id}-${i}`}>
								<rect
									height="150"
									width={
										(value - i > 0
											? value - i < 1
												? value - i
												: 1
											: 0) * 150
									}
									y="0"
									x="0"
									fill="#fff"
								/>
							</mask>
						</defs>

						<path
							fill={inactiveStarColor}
							strokeWidth="1.5"
							d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
							stroke="#000"
						/>
						<path
							className="star"
							id={`star${i}`}
							mask={`url(#ub_review_star_filter-${id}-${i})`}
							fill={activeStarColor}
							strokeWidth="1.5"
							d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
							stroke="#000"
						/>
					</svg>
				))}
			</div>
		);
	}
}

export class Stars extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayValue: this.props.value,
			displayColor: this.props.activeStarColor
		};
		this.mouseHover = this.mouseHover.bind(this);
		this.mouseLeave = this.mouseLeave.bind(this);
		this.mouseClick = this.mouseClick.bind(this);
	}
	mouseHover(i) {
		this.setState({
			displayValue: i + 1,
			displayColor: this.props.selectedStarColor
		});
	}
	mouseLeave() {
		this.setState({
			displayValue: this.props.value,
			displayColor: this.props.activeStarColor
		});
	}
	mouseClick(i) {
		const { setValue, value } = this.props;
		setValue(value === i + 1 ? i + 0.5 : i + 1);
		this.setState({
			displayValue: value === i + 1 ? i + 0.5 : i + 1
		});
	}
	componentWillReceiveProps(newProps) {
		const { value, activeStarColor } = newProps;
		if (this.props.onHover || this.state.displayValue !== value) {
			this.setState({
				displayValue: value,
				displayColor: activeStarColor
			});
		} else {
			this.setState({ displayColor: activeStarColor });
		}
	}
	render() {
		const { displayValue } = this.state;
		const {
			limit,
			id,
			className,
			inactiveStarColor,
			onHover,
			onClick,
			style,
			starOutlineColor
		} = this.props;
		return (
			<div
				className={className}
				style={Object.assign(
					{
						display: 'flex',
						flexDirection: 'flex-row'
					},
					style
				)}
			>
				{[...Array(limit).keys()].map(i => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						key={i}
						height="20"
						width="20"
						viewBox="0 0 150 150"
						onMouseOver={_ => onHover || this.mouseHover(i)}
						onMouseOut={_ => this.mouseLeave()}
						onClick={_ => onClick || this.mouseClick(i)}
					>
						<defs>
							<mask id={`ub_review_star_filter-${id}-${i}`}>
								<rect
									height="150"
									width={
										(displayValue - i > 0
											? displayValue - i < 1
												? displayValue - i
												: 1
											: 0) * 150
									}
									y="0"
									x="0"
									fill="#fff"
								/>
							</mask>
						</defs>

						<path
							fill={inactiveStarColor}
							strokeWidth="2.5"
							d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
							stroke={starOutlineColor}
						/>
						<path
							className="star"
							id={`star${i}`}
							mask={`url(#ub_review_star_filter-${id}-${i})`}
							fill={this.state.displayColor}
							strokeWidth="2.5"
							d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
							stroke={starOutlineColor}
						/>
					</svg>
				))}
			</div>
		);
	}
}

export class ReviewBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			average:
				this.props.items
					.map(i => i.value)
					.reduce((total, v) => total + v) / this.props.items.length
		};
	}

	render() {
		const {
			authorName,
			setAuthorName,
			itemName,
			setItemName,
			ID,
			items,
			summaryTitle,
			summaryDescription,
			starCount,
			setItems,
			setSummaryDescription,
			setSummaryTitle,
			callToActionText,
			callToActionURL,
			setCallToActionText,
			setCallToActionURL,
			hasFocus,
			callToActionBackColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor,
			selectedStarColor,
			starOutlineColor,
			setEditable,
			alignments,
			enableCTA
		} = this.props;

		const { titleAlign, authorAlign } = alignments;
		const { average } = this.state;

		const newAverage =
			items.map(i => i.value).reduce((total, v) => total + v) /
			items.length;

		if (average !== newAverage) {
			this.setState({ average: newAverage });
		}

		return (
			<div className="ub_review_block">
				<RichText
					className="ub_review_item_name"
					tagName="p"
					placeholder={__('Title of the review')}
					value={itemName}
					style={{ textAlign: titleAlign }}
					onChange={text => setItemName(text)}
					unstableOnFocus={_ => setEditable('reviewTitle')}
				/>
				<RichText
					tagName="p"
					placeholder={__('Review Author name')}
					value={authorName}
					style={{ textAlign: authorAlign }}
					onChange={text => setAuthorName(text)}
					unstableOnFocus={_ => setEditable('reviewAuthor')}
				/>
				{items.map((j, i) => (
					<div className="ub_review_entry">
						<RichText
							style={{ marginRight: 'auto' }}
							key={i}
							placeholder={__('Feature name')}
							value={j.label}
							onChange={text => {
								let newArray = items;
								newArray[i].label = text;
								setItems(newArray);
							}}
							unstableOnFocus={_ => setEditable('')}
						/>
						<div
							key={i}
							style={{
								marginLeft: 'auto',
								minWidth: items.length > 1 ? 120 : 100
							}}
						>
							{items.length > 1 && (
								<div
									className="dashicons dashicons-trash"
									style={{ float: 'right' }}
									onClick={_ => {
										setEditable('');
										let newItems = items
											.slice(0, i)
											.concat(
												items.slice(i + 1, items.length)
											);
										setItems(newItems);
										this.setState({
											average:
												newItems
													.map(i => i.value)
													.reduce(
														(total, v) => total + v
													) / newItems.length
										});
									}}
								/>
							)}
							<Stars
								id={`${ID}-${i}`}
								key={i}
								value={j.value}
								limit={starCount}
								setValue={newValue => {
									let newArray = items;
									newArray[i].value = newValue;
									setItems(newArray);
									this.setState({
										average:
											newArray
												.map(i => i.value)
												.reduce(
													(total, v) => total + v
												) / newArray.length
									});
								}}
								inactiveStarColor={inactiveStarColor}
								activeStarColor={activeStarColor}
								selectedStarColor={selectedStarColor}
								starOutlineColor={starOutlineColor}
							/>
						</div>
					</div>
				))}
				<div
					title={__('Insert new review entry')}
					onClick={() => {
						setItems([...items, { label: '', value: 0 }]);
						this.setState({
							average: average / (items.length + 1)
						});
					}}
					className="ub_review_add_entry dashicons dashicons-plus-alt"
				/>
				<div clasName="ub_review_summary">
					<RichText
						className="ub_review_summary_title"
						placeholder={__('Title of the summary goes here')}
						tagName="p"
						onChange={text => setSummaryTitle(text)}
						value={summaryTitle}
						unstableOnFocus={_ => setEditable('')}
					/>
					<div className="ub_review_overall_value">
						<RichText
							placeholder={__('Summary of the review goes here')}
							onChange={text => setSummaryDescription(text)}
							value={summaryDescription}
							unstableOnFocus={_ => setEditable('')}
						/>
						<span className="ub_review_rating">
							{Math.round(average * 10) / 10}
						</span>
					</div>
					<div className="ub_review_cta_panel">
						<div className="ub_review_cta_main">
							{enableCTA && (
								<div //do not merge into RichText child
									className="ub_review_cta_btn"
									style={{
										backgroundColor: callToActionBackColor,
										borderColor: callToActionForeColor
									}}
								>
									<RichText
										style={{
											color: callToActionForeColor
										}}
										placeholder={__('Call to action')}
										value={callToActionText}
										onChange={text =>
											setCallToActionText(text)
										}
										unstableOnFocus={_ => setEditable('')}
									/>
								</div>
							)}
						</div>
						<Stars
							id={`${ID}-average`}
							className="ub_review_average_stars"
							onHover={_ => null}
							onClick={_ => null}
							value={average}
							limit={starCount}
							inactiveStarColor={inactiveStarColor}
							activeStarColor={activeStarColor}
							selectedStarColor={selectedStarColor}
							starOutlineColor={starOutlineColor}
						/>
					</div>
					{hasFocus && enableCTA && (
						<div className="ub_review_link_input">
							<div className="ub-icon-holder">
								<Dashicon icon={'admin-links'} />
							</div>
							<URLInput
								style={{ width: '200px' }} //inline style used to override gutenberg's default style
								value={callToActionURL}
								onChange={text => setCallToActionURL(text)}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
