import icon from './icon';
import './style.scss';
import { Component } from 'react';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, URLInput, InspectorControls, PanelColorSettings } = wp.editor;
const { Dashicon } = wp.components;

class Stars extends Component {
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
		if (this.props.onHover) {
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
			style
		} = this.props;
		return (
			<div className={className} style={style}>
				{[...Array(limit).keys()].map(i => (
					<svg
						key={i}
						height="20"
						width="20"
						viewBox="0 0 150 150"
						onMouseOver={() =>
							onHover ? onHover : this.mouseHover(i)
						}
						onMouseOut={() => this.mouseLeave()}
						onClick={() => (onClick ? onClick : this.mouseClick(i))}
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
							strokeWidth="1.5"
							d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
							stroke="#000"
						/>
						<path
							className="star"
							id={`star${i}`}
							mask={`url(#ub_review_star_filter-${id}-${i})`}
							fill={this.state.displayColor}
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

class ReviewBody extends Component {
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
			selectedStarColor
		} = this.props;

		const { average } = this.state;

		return (
			<div>
				<RichText
					tagName="h1"
					placeholder={__('Name of item under review')}
					value={itemName}
					onChange={text => setItemName(text)}
				/>
				{items.map((j, i) => (
					<div className="ub_review_entry">
						<RichText
							key={i}
							placeholder={__(
								'Aspect of the item being reviewed'
							)}
							value={j.label}
							onChange={text => {
								let newArray = items;
								newArray[i].label = text;
								setItems(newArray);
							}}
						/>
						<div key={i}>
							{items.length > 1 && (
								<div
									className="dashicons dashicons-trash"
									style={{ float: 'right' }}
									onClick={() => {
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
								style={{ float: 'right' }}
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
						placeholder={__('Title of the summary goes here')}
						tagName="h2"
						onChange={text => setSummaryTitle(text)}
						value={summaryTitle}
					/>
					<div className="ub_review_overall_value">
						<RichText
							placeholder={__('Summary of the review goes here')}
							onChange={text => setSummaryDescription(text)}
							value={summaryDescription}
						/>
						<span className="ub_review_rating">
							{Math.round(average * 100) / 100}
						</span>
					</div>
					<div className="ub_review_cta_panel">
						<div className="ub_review_cta_main">
							<button
								style={{
									backgroundColor: callToActionBackColor,
									border: `1px solid ${callToActionForeColor}`
								}}
							>
								<RichText
									style={{ color: callToActionForeColor }}
									placeholder={__('Call to action text')}
									value={callToActionText}
									onChange={text => setCallToActionText(text)}
								/>
							</button>
						</div>
						<Stars
							id={`${ID}-average`}
							className="ub_review_average_stars"
							onHover={() => null}
							onClick={() => null}
							value={average}
							limit={starCount}
							inactiveStarColor={inactiveStarColor}
							activeStarColor={activeStarColor}
							selectedStarColor={selectedStarColor}
							style={{ float: 'right' }}
						/>
					</div>
					{hasFocus && (
						<div className="ub_review_link_input">
							<div
								style={{
									position: 'relative',
									transform: 'translate(-25%,25%)'
								}}
							>
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

registerBlockType('ub/review', {
	title: __('Review'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Review'), __('Ultimate Blocks')],
	attributes: {
		itemName: {
			type: 'string'
		},
		items: {
			type: 'string',
			default: '[{"label": "", "value": 0}]'
		},
		starCount: {
			type: 'number',
			default: 5
		},
		summaryTitle: {
			type: 'string',
			default: 'Summary'
		},
		summaryDescription: {
			type: 'string'
		},
		callToActionText: {
			type: 'string'
		},
		callToActionURL: {
			type: 'string',
			default: ''
		},
		callToActionBackColor: {
			type: 'string',
			default: '#ffffff'
		},
		callToActionForeColor: {
			type: 'string',
			default: '#0000ff'
		},
		inactiveStarColor: {
			type: 'string',
			default: '#888888'
		},
		activeStarColor: {
			type: 'string',
			default: '#eeee00'
		},
		selectedStarColor: {
			type: 'string',
			default: '#ffff00'
		}
	},
	edit(props) {
		const { setAttributes, isSelected } = props;
		const {
			itemName,
			items,
			starCount,
			summaryTitle,
			summaryDescription,
			callToActionText,
			callToActionURL,
			callToActionBackColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor,
			selectedStarColor
		} = props.attributes;

		const blockID = Math.random()
			.toString(36)
			.replace(/[^a-z0-9]+/g, '')
			.substr(1, 10);

		return [
			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__('Button Colors')}
						initialOpen={true}
						colorSettings={[
							{
								value: callToActionBackColor,
								onChange: colorValue =>
									setAttributes({
										callToActionBackColor: colorValue
									}),
								label: __('Button Background')
							},
							{
								value: callToActionForeColor,
								onChange: colorValue =>
									setAttributes({
										callToActionForeColor: colorValue
									}),
								label: __('Button Text Color')
							},
							{
								value: inactiveStarColor,
								onChange: colorValue =>
									setAttributes({
										inactiveStarColor: colorValue
									}),
								label: __('Inactive Star Color')
							},
							{
								value: activeStarColor,
								onChange: colorValue =>
									setAttributes({
										activeStarColor: colorValue
									}),
								label: __('Active Star Color')
							},
							{
								value: selectedStarColor,
								onChange: colorValue =>
									setAttributes({
										selectedStarColor: colorValue
									}),
								label: __('Selected Star Color')
							}
						]}
					/>
					,
				</InspectorControls>
			),
			<ReviewBody
				itemName={itemName}
				ID={blockID}
				items={JSON.parse(items)}
				starCount={starCount}
				summaryTitle={summaryTitle}
				summaryDescription={summaryDescription}
				callToActionText={callToActionText}
				callToActionURL={callToActionURL}
				callToActionBackColor={callToActionBackColor}
				callToActionForeColor={callToActionForeColor}
				inactiveStarColor={inactiveStarColor}
				activeStarColor={activeStarColor}
				selectedStarColor={selectedStarColor}
				setItemName={newValue => setAttributes({ itemName: newValue })}
				setItems={newValue =>
					setAttributes({ items: JSON.stringify(newValue) })
				}
				setSummaryTitle={newValue =>
					setAttributes({ summaryTitle: newValue })
				}
				setSummaryDescription={newValue =>
					setAttributes({ summaryDescription: newValue })
				}
				setCallToActionText={newValue =>
					setAttributes({ callToActionText: newValue })
				}
				setCallToActionURL={newValue =>
					setAttributes({ callToActionURL: newValue })
				}
				hasFocus={isSelected}
			/>
		];
	},
	save(props) {
		const {
			itemName,
			items,
			starCount,
			summaryTitle,
			summaryDescription,
			callToActionText,
			callToActionURL,
			callToActionBackColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor
		} = props.attributes;

		const average =
			JSON.parse(items)
				.map(i => i.value)
				.reduce((total, v) => total + v) / JSON.parse(items).length;

		const blockID = Math.random()
			.toString(36)
			.replace(/[^a-z0-9]+/g, '')
			.substr(1, 10);

		return (
			<div itemscope itemtype="http://schema.org/Review">
				<h1
					itemprop="itemReviewed name"
					itemscope
					itemtype="http://schema.org/Thing"
				>
					<RichText.Content value={itemName} />
				</h1>
				{JSON.parse(items).map((j, i) => (
					<div className="ub_review_entry">
						<RichText.Content key={i} value={j.label} />
						<Stars
							style={{ justifySelf: 'self-end' }}
							id={`${blockID}-${i}`}
							key={i}
							value={j.value}
							limit={starCount}
							inactiveStarColor={inactiveStarColor}
							activeStarColor={activeStarColor}
						/>
					</div>
				))}
				<div clasName="ub_review_summary">
					<RichText.Content tagName="h2" value={summaryTitle} />
					<div className="ub_review_overall_value">
						<p itemprop="description reviewBody">
							<RichText.Content value={summaryDescription} />
						</p>
						<span
							itemprop="ratingValue"
							className="ub_review_rating"
						>
							{Math.round(average * 100) / 100}
						</span>
					</div>
					<div className="ub_review_cta_panel">
						<div className="ub_review_cta_main">
							<button
								style={{
									backgroundColor: callToActionBackColor,
									border: `1px solid ${callToActionForeColor}`
								}}
							>
								<a
									itemprop="url"
									href={
										callToActionURL ? callToActionURL : '#'
									}
								>
									<RichText.Content
										style={{ color: callToActionForeColor }}
										value={
											callToActionText
												? callToActionText
												: 'Click here'
										}
									/>
								</a>
							</button>
						</div>
						<Stars
							id={`${blockID}-average`}
							className="ub_review_average_stars"
							onHover={() => null}
							setValue={() => null}
							value={average}
							limit={starCount}
							inactiveStarColor={inactiveStarColor}
							activeStarColor={activeStarColor}
						/>
					</div>
				</div>
			</div>
		);
	}
});
