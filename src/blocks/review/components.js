const { RichText, MediaUpload, URLInput } = wp.blockEditor || wp.editor;
const { Button, Dashicon } = wp.components;
const { __ } = wp.i18n;

import { removeIcon } from "./icon";
import { useEffect, useRef, useState } from "react";

export function OldStars(props) {
	const {
		value,
		activeStarColor,
		limit,
		id,
		className,
		inactiveStarColor,
		style,
	} = props;
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

export function Stars(props) {
	const {
		limit,
		id,
		className,
		inactiveStarColor,
		value,
		activeStarColor,
		selectedStarColor,
		setValue,
		onHover,
		onClick,
		style,
		starOutlineColor,
	} = props;

	const [displayValue, setDisplayValue] = useState(value);
	const [displayColor, setDisplayColor] = useState(activeStarColor);

	const mouseHover = (i) => {
		setDisplayValue(i + (value - i === 1 ? 0.5 : 1));
		setDisplayColor(selectedStarColor);
	};

	const mouseLeave = () => {
		setDisplayValue(value);
		setDisplayColor(activeStarColor);
	};

	const mouseClick = (i) => {
		setValue(value === i + 1 ? i + 0.5 : i + 1);
		setDisplayValue(value === i + 1 ? i + 0.5 : i + 1);
	};

	useEffect(() => {
		setDisplayColor(activeStarColor);
		if (onHover || displayValue !== value) {
			setDisplayValue(value);
		}
	}, [value, activeStarColor]);

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
					onMouseOver={() => onHover || mouseHover(i)}
					onMouseOut={() => mouseLeave()}
					onClick={() => onClick || mouseClick(i)}
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
						fill={displayColor}
						strokeWidth="2.5"
						d="m0.75,56.89914l56.02207,0l17.31126,-56.14914l17.31126,56.14914l56.02206,0l-45.32273,34.70168l17.31215,56.14914l-45.32274,-34.70262l-45.32274,34.70262l17.31215,-56.14914l-45.32274,-34.70168z"
						stroke={starOutlineColor}
					/>
				</svg>
			))}
		</div>
	);
}

export function ReviewBody(props) {
	const {
		isSelected,
		setAttributes,
		authorName,
		itemName,
		imgID,
		imgAlt,
		imgURL,
		imgPosition,
		enableImage,
		description,
		descriptionEnabled,
		blockID,
		parts,
		useSummary,
		summaryTitle,
		summaryDescription,
		valueType,
		starCount,
		callToActionText,
		callToActionURL,
		ctaAlignment,
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
		measureCTAFontSize,
		imageSize,
		ctaFontSize,
	} = props;

	const { titleAlign, authorAlign, descriptionAlign } = alignments;

	const [average, setAverage] = useState(
		parts.map((i) => i.value).reduce((total, v) => total + v) / parts.length
	);
	const [mouseOnHold, setMouseOnHold] = useState(false);

	const ctaButton = useRef(null);

	useEffect(() => {
		if (measureCTAFontSize) {
			if (ctaButton.current) {
				setAttributes({
					callToActionFontSize: parseInt(
						getComputedStyle(ctaButton.current).fontSize.slice(0, -2)
					),
				});
			}
		}
	}, [measureCTAFontSize]);

	const newAverage =
		parts.map((i) => i.value).reduce((total, v) => total + v) / parts.length;

	if (average !== newAverage) {
		setAverage(newAverage);
	}

	const setNewPercentage = (percentageBar, mouseX, i, j) => {
		const newValue = Math.round(
			(100 * (mouseX - percentageBar.x)) / percentageBar.width
		);
		const newArray = [
			...parts.slice(0, i),
			{ label: j.label, value: newValue },
			...parts.slice(i + 1),
		];
		setAttributes({ parts: newArray });
		setActiveStarIndex(i);
		setAverage(
			newArray.map((i) => i.value).reduce((total, v) => total + v) /
				newArray.length
		);
	};

	return (
		<div className="ub_review_block">
			<RichText
				className="ub_review_item_name"
				placeholder={__("Title of the review")}
				value={itemName}
				style={{ textAlign: titleAlign }}
				onChange={(text) => setAttributes({ itemName: text })}
				unstableOnFocus={() => setEditable("reviewTitle")}
			/>
			<RichText
				placeholder={__("Review Author name")}
				value={authorName}
				style={{ textAlign: authorAlign }}
				onChange={(text) => setAttributes({ authorName: text })}
				unstableOnFocus={() => setEditable("reviewAuthor")}
			/>
			{(enableImage || descriptionEnabled) && (
				<div
					className={`ub_review_description_container ub_review_${imgPosition}_image`}
				>
					{enableImage &&
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
											setAttributes({
												imgID: 0,
												imgURL: "",
												imgAlt: "",
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
									onSelect={(img) =>
										setAttributes({
											imgID: img.id,
											imgURL: img.url,
											imgAlt: img.alt,
										})
									}
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
							onChange={(text) => setAttributes({ description: text })}
							style={{ textAlign: descriptionAlign }}
							unstableOnFocus={() => setEditable("reviewItemDescription")}
						/>
					)}
				</div>
			)}
			{parts.map((j, i) => (
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
							setAttributes({
								parts: [
									...parts.slice(0, i),
									{ label: text, value: j.value },
									...parts.slice(i + 1),
								],
							})
						}
						unstableOnFocus={() => {
							setEditable("");
							setActiveStarIndex(i);
						}}
						onSplit={(label) => label}
						onReplace={(label) => {
							setAttributes({
								parts: [
									...parts.slice(0, i),
									{ label: label[0], value: j.value },
									{ label: label[1], value: j.value },
									...parts.slice(i + 1),
								],
							});
						}}
						onMerge={(mergeWithNext) => {
							if (mergeWithNext) {
								if (i < parts.length - 1) {
									setAttributes({
										parts: [
											...parts.slice(0, i),
											{
												label: `${parts[i].label}${parts[i + 1].label}`,
												value: j.value,
											},
											...parts.slice(i + 2),
										],
									});
								}
							} else {
								if (i > 0) {
									setAttributes({
										parts: [
											...parts.slice(0, i - 1),
											{
												label: `${parts[i - 1].label}${parts[i].label}`,
												value: parts[i - 1].value,
											},
											...parts.slice(i + 1),
										],
									});
								}
								if (i === parts.length - 1) {
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
							minWidth: parts.length > 1 ? 120 : 100,
						}}
					>
						{parts.length > 1 && (
							<div
								className="dashicons dashicons-trash"
								onClick={() => {
									setEditable("");
									let newParts = parts
										.slice(0, i)
										.concat(parts.slice(i + 1, parts.length));
									setAttributes({ parts: newParts });

									setAverage(
										newParts
											.map((i) => i.value)
											.reduce((total, v) => total + v) / newParts.length
									);

									if (i <= activeStarIndex) {
										setActiveStarIndex(activeStarIndex - 1);
									}
								}}
							/>
						)}
						{valueType === "star" ? (
							<Stars
								id={`${blockID}-${i}`}
								key={i}
								value={j.value}
								limit={starCount}
								setValue={(newValue) => {
									const newArray = [
										...parts.slice(0, i),
										{ label: j.label, value: newValue },
										...parts.slice(i + 1),
									];
									setAttributes({ parts: newArray });
									setActiveStarIndex(i);
									setAverage(
										newArray
											.map((i) => i.value)
											.reduce((total, v) => total + v) / newArray.length
									);
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
									onMouseDown={() => setMouseOnHold(true)}
									onMouseUp={() => setMouseOnHold(false)}
									onMouseMove={(e) => {
										if (mouseOnHold) {
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
					setAttributes({ parts: [...parts, { label: "", value: 0 }] });
					setAverage(average / (parts.length + 1));
				}}
				className="ub_review_add_entry dashicons dashicons-plus-alt"
			/>
			<div className="ub_review_summary">
				{useSummary && (
					<RichText
						className="ub_review_summary_title"
						placeholder={__("Title of the summary goes here")}
						onChange={(text) => setAttributes({ summaryTitle: text })}
						value={summaryTitle}
						unstableOnFocus={() => setEditable("")}
					/>
				)}
				<div className="ub_review_overall_value">
					{useSummary && (
						<RichText
							placeholder={__("Summary of the review goes here")}
							onChange={(text) => setAttributes({ summaryDescription: text })}
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
								id={`${blockID}-average`}
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
						style={{ justifyContent: ctaAlignment }}
					>
						{enableCTA && (
							<div //do not merge into RichText child
								className="ub_review_cta_btn"
								style={{
									backgroundColor: callToActionBackColor,
									borderColor: callToActionBorderColor,
									fontSize: ctaFontSize > 0 ? `${ctaFontSize}px` : null,
								}}
								ref={ctaButton}
							>
								<RichText
									style={{ color: callToActionForeColor || "inherit" }}
									placeholder={__("Call to action")}
									value={callToActionText}
									onChange={(text) => setAttributes({ callToActionText: text })}
									unstableOnFocus={() => setEditable("")}
								/>
							</div>
						)}
					</div>
				</div>
				{isSelected && enableCTA && (
					<div className="ub_review_link_input">
						<div className="ub-icon-holder">
							<Dashicon icon={"admin-links"} />
						</div>
						<URLInput
							autoFocus={false}
							style={{ width: "200px" }} //inline style used to override gutenberg's default style
							value={callToActionURL}
							onChange={(text) => setAttributes({ callToActionURL: text })}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
