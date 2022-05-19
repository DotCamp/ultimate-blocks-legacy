const { RichText, MediaUpload, URLInput } = wp.blockEditor || wp.editor;
const { Button, Dashicon } = wp.components;
const { __ } = wp.i18n;

import { removeIcon } from "./icon";
import { Component, createRef } from "react";

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
			style,
		} = this.props;
		return (
			<div
				className={className}
				style={Object.assign(
					{
						display: "flex",
						flexDirection: "flex-row",
					},
					style
				)}
			>
				{[...Array(limit).keys()].map((i) => (
					<svg key={i} height="20" width="20" viewBox="0 0 150 150">
						<defs>
							<mask id={`ub_review_star_filter-${id}-${i}`}>
								<rect
									height="150"
									width={
										(value - i > 0 ? (value - i < 1 ? value - i : 1) : 0) * 150
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
			displayColor: this.props.activeStarColor,
		};
		this.mouseHover = this.mouseHover.bind(this);
		this.mouseLeave = this.mouseLeave.bind(this);
		this.mouseClick = this.mouseClick.bind(this);
	}
	mouseHover(i) {
		this.setState({
			displayValue: i + (this.props.value - i === 1 ? 0.5 : 1),
			displayColor: this.props.selectedStarColor,
		});
	}
	mouseLeave() {
		this.setState({
			displayValue: this.props.value,
			displayColor: this.props.activeStarColor,
		});
	}
	mouseClick(i) {
		const { setValue, value } = this.props;
		setValue(value === i + 1 ? i + 0.5 : i + 1);
		this.setState({
			displayValue: value === i + 1 ? i + 0.5 : i + 1,
		});
	}
	componentWillReceiveProps(newProps) {
		const { value, activeStarColor } = newProps;
		if (this.props.onHover || this.state.displayValue !== value) {
			this.setState({
				displayValue: value,
				displayColor: activeStarColor,
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
			starOutlineColor,
		} = this.props;
		return (
			<div
				className={className}
				style={Object.assign(
					{
						display: "flex",
						flexDirection: "flex-row",
					},
					style
				)}
			>
				{[...Array(limit).keys()].map((i) => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						key={i}
						height="20"
						width="20"
						viewBox="0 0 150 150"
						onMouseOver={() => onHover || this.mouseHover(i)}
						onMouseOut={() => this.mouseLeave()}
						onClick={() => onClick || this.mouseClick(i)}
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
				this.props.items.map((i) => i.value).reduce((total, v) => total + v) /
				this.props.items.length,
			mouseOnHold: false,
		};
		this.ctaButton = createRef();
	}

	componentDidUpdate(prevProps) {
		if (this.props.measureCTAFontSize !== prevProps.measureCTAFontSize) {
			if (this.props.measureCTAFontSize) {
				if (this.ctaButton.current) {
					this.props.setAttributes({
						callToActionFontSize: parseInt(
							getComputedStyle(this.ctaButton.current).fontSize.slice(0, -2)
						),
					});
				}
			}
		}
	}

	render() {
		const {
			isSelected,
			authorName,
			setAuthorName,
			itemName,
			setItemName,
			imgID,
			imgAlt,
			imgURL,
			imgPosition,
			imageEnabled,
			setImage,
			description,
			descriptionEnabled,
			setDescription,
			ID,
			items,
			enableSummary,
			summaryTitle,
			summaryDescription,
			valueType,
			starCount,
			setItems,
			setSummaryDescription,
			setSummaryTitle,
			callToActionText,
			callToActionURL,
			callToActionAlignment,
			setCallToActionText,
			setCallToActionURL,
			hasFocus,
			callToActionBackColor,
			callToActionBorderColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor,
			selectedStarColor,
			starOutlineColor,
			activePercentBarColor,
			percentBarColor,
			setEditable,
			activeStarIndex,
			setActiveStarIndex,
			alignments,
			enableCTA,
			imageSize,
			ctaFontSize,
		} = this.props;

		const { titleAlign, authorAlign, descriptionAlign } = alignments;
		const { average } = this.state;

		const newAverage =
			items.map((i) => i.value).reduce((total, v) => total + v) / items.length;

		if (average !== newAverage) {
			this.setState({ average: newAverage });
		}

		const setNewPercentage = (percentageBar, mouseX, i, j) => {
			const newValue = Math.round(
				(100 * (mouseX - percentageBar.x)) / percentageBar.width
			);
			const newArray = [
				...items.slice(0, i),
				{ label: j.label, value: newValue },
				...items.slice(i + 1),
			];
			setItems(newArray);
			setActiveStarIndex(i);
			this.setState({
				average:
					newArray.map((i) => i.value).reduce((total, v) => total + v) /
					newArray.length,
			});
		};

		return (
			<div className="ub_review_block">
				<RichText
					className="ub_review_item_name"
					placeholder={__("Title of the review")}
					value={itemName}
					style={{ textAlign: titleAlign }}
					onChange={(text) => setItemName(text)}
					unstableOnFocus={() => setEditable("reviewTitle")}
				/>
				<RichText
					placeholder={__("Review Author name")}
					value={authorName}
					style={{ textAlign: authorAlign }}
					onChange={(text) => setAuthorName(text)}
					unstableOnFocus={() => setEditable("reviewAuthor")}
				/>
				{(imageEnabled || descriptionEnabled) && (
					<div
						className={`ub_review_description_container ub_review_${imgPosition}_image`}
					>
						{imageEnabled &&
							(imgID ? (
								<div className="ub_review_image_container">
									<img
										className="ub_review_image"
										src={imgURL}
										alt={imgAlt}
										style={{
											maxHeight: `${imageSize}px`,
											maxWidth: `${imageSize}px`,
										}}
									/>
									{isSelected && (
										<Button
											className="ub-remove-image"
											onClick={() =>
												setImage({
													id: 0,
													url: "",
													alt: "",
												})
											}
										>
											{removeIcon}
										</Button>
									)}
								</div>
							) : (
								<div className="ub_review_upload_button">
									<MediaUpload
										onSelect={(img) => setImage(img)}
										allowedTypes={["image"]}
										value={imgID}
										render={({ open }) => (
											<Button
												className="components-button button button-medium"
												onClick={open}
											>
												{__("Upload Image")}
											</Button>
										)}
									/>
								</div>
							))}
						{descriptionEnabled && (
							<RichText
								className="ub_review_description"
								placeholder={__("Item description")}
								value={description}
								onChange={(text) => setDescription(text)}
								style={{ textAlign: descriptionAlign }}
								unstableOnFocus={() => setEditable("reviewItemDescription")}
							/>
						)}
					</div>
				)}
				{items.map((j, i) => (
					<div
						className={`ub_review_${
							valueType === "percent" ? "percentage_" : ""
						}entry`}
					>
						<RichText
							key={i}
							placeholder={__("Feature name")}
							value={j.label}
							onChange={(text) =>
								setItems([
									...items.slice(0, i),
									{ label: text, value: j.value },
									...items.slice(i + 1),
								])
							}
							unstableOnFocus={() => {
								setEditable("");
								setActiveStarIndex(i);
							}}
							onSplit={(label) => label}
							onReplace={(label) => {
								setItems([
									...items.slice(0, i),
									{ label: label[0], value: j.value },
									{ label: label[1], value: j.value },
									...items.slice(i + 1),
								]);
							}}
							onMerge={(mergeWithNext) => {
								if (mergeWithNext) {
									if (i < items.length - 1) {
										setItems([
											...items.slice(0, i),
											{
												label: `${items[i].label}${items[i + 1].label}`,
												value: j.value,
											},
											...items.slice(i + 2),
										]);
									}
								} else {
									if (i > 0) {
										setItems([
											...items.slice(0, i - 1),
											{
												label: `${items[i - 1].label}${items[i].label}`,
												value: items[i - 1].value,
											},
											...items.slice(i + 1),
										]);
									}
									if (i === items.length - 1) {
										setActiveStarIndex(-1);
									}
								}
							}}
						/>
						<div
							key={i}
							className={"ub_review_value"}
							style={{
								marginLeft: "auto",
								minWidth: items.length > 1 ? 120 : 100,
							}}
						>
							{items.length > 1 && (
								<div
									className="dashicons dashicons-trash"
									onClick={() => {
										setEditable("");
										let newItems = items
											.slice(0, i)
											.concat(items.slice(i + 1, items.length));
										setItems(newItems);
										this.setState({
											average:
												newItems
													.map((i) => i.value)
													.reduce((total, v) => total + v) / newItems.length,
										});
										if (i <= activeStarIndex) {
											setActiveStarIndex(activeStarIndex - 1);
										}
									}}
								/>
							)}
							{valueType === "star" ? (
								<Stars
									id={`${ID}-${i}`}
									key={i}
									value={j.value}
									limit={starCount}
									setValue={(newValue) => {
										const newArray = [
											...items.slice(0, i),
											{ label: j.label, value: newValue },
											...items.slice(i + 1),
										];
										setItems(newArray);
										setActiveStarIndex(i);
										this.setState({
											average:
												newArray
													.map((i) => i.value)
													.reduce((total, v) => total + v) / newArray.length,
										});
									}}
									inactiveStarColor={inactiveStarColor}
									activeStarColor={activeStarColor}
									selectedStarColor={selectedStarColor}
									starOutlineColor={starOutlineColor}
								/>
							) : (
								<div className="ub_review_percentage">
									<svg
										className="ub_review_percentage_bar"
										viewBox="0 0 100 1"
										preserveAspectRatio="none"
										height="10"
										onClick={(e) =>
											setNewPercentage(
												e.currentTarget.getBoundingClientRect(),
												e.clientX,
												i,
												j
											)
										}
										//in cases where the user drags across the bar
										onMouseDown={() => this.setState({ mouseOnHold: true })}
										onMouseUp={() => this.setState({ mouseOnHold: false })}
										onMouseMove={(e) => {
											if (this.state.mouseOnHold) {
												setNewPercentage(
													e.currentTarget.getBoundingClientRect(),
													e.clientX,
													i,
													j
												);
											}
										}}
									>
										<path
											className="ub_review_percentage_bar_trail"
											d="M 0.5,0.5 L 99.5,0.5"
											stroke={percentBarColor || "#d9d9d9"}
											stroke-width="1"
										/>
										<path
											className="ub_review_percentage_bar_path"
											d="M 0.5,0.5 L 99.5,0.5"
											stroke={activePercentBarColor}
											stroke-width="1"
											strokeDashoffset={`${100 - j.value}px`}
										/>
									</svg>
									<div>{j.value}%</div>
								</div>
							)}
						</div>
					</div>
				))}
				<div
					title={__("Insert new review entry")}
					onClick={() => {
						setItems([...items, { label: "", value: 0 }]);
						this.setState({ average: average / (items.length + 1) });
					}}
					className="ub_review_add_entry dashicons dashicons-plus-alt"
				/>
				<div className="ub_review_summary">
					{enableSummary && (
						<RichText
							className="ub_review_summary_title"
							placeholder={__("Title of the summary goes here")}
							onChange={(text) => setSummaryTitle(text)}
							value={summaryTitle}
							unstableOnFocus={() => setEditable("")}
						/>
					)}
					<div className="ub_review_overall_value">
						{enableSummary && (
							<RichText
								placeholder={__("Summary of the review goes here")}
								onChange={(text) => setSummaryDescription(text)}
								value={summaryDescription}
								unstableOnFocus={() => setEditable("")}
							/>
						)}
						<div className="ub_review_average">
							<span className="ub_review_rating">
								{Math.round(average * 10) / 10}
								{valueType === "percent" ? "%" : ""}
							</span>
							{valueType === "star" && (
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
									starOutlineColor={starOutlineColor}
								/>
							)}
						</div>
					</div>
					<div className="ub_review_cta_panel">
						<div
							className="ub_review_cta_main"
							style={{ justifyContent: callToActionAlignment }}
						>
							{enableCTA && (
								<div //do not merge into RichText child
									className="ub_review_cta_btn"
									style={{
										backgroundColor: callToActionBackColor,
										borderColor: callToActionBorderColor,
										fontSize: ctaFontSize > 0 ? `${ctaFontSize}px` : null,
									}}
									ref={this.ctaButton}
								>
									<RichText
										style={{ color: callToActionForeColor || "inherit" }}
										placeholder={__("Call to action")}
										value={callToActionText}
										onChange={(text) => setCallToActionText(text)}
										unstableOnFocus={() => setEditable("")}
									/>
								</div>
							)}
						</div>
					</div>
					{hasFocus && enableCTA && (
						<div className="ub_review_link_input">
							<div className="ub-icon-holder">
								<Dashicon icon={"admin-links"} />
							</div>
							<URLInput
								autoFocus={false}
								style={{ width: "200px" }} //inline style used to override gutenberg's default style
								value={callToActionURL}
								onChange={(text) => setCallToActionURL(text)}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
