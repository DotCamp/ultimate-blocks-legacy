import { Fragment } from "react";
import { EmptyStar, FullStar, HalfStar } from "./icons";

const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings, RichText, BlockControls } =
	wp.blockEditor || wp.editor;
const { PanelBody, RangeControl, Toolbar, IconButton } = wp.components;

export const blockControls = props => {
	const { attributes, setAttributes } = props;

	const { reviewTextAlign } = attributes;
	return (
		<BlockControls>
			<Toolbar>
				{["left", "center", "right"].map(a => (
					<IconButton
						icon={`align-${a}`}
						label={__(`Align stars ${a}`)}
						onClick={() => setAttributes({ starAlign: a })}
					/>
				))}
			</Toolbar>
			<Toolbar>
				{["left", "center", "right", "justify"].map(a => (
					<IconButton
						icon={`editor-${a === "justify" ? a : "align" + a}`}
						label={__(
							(a !== "justify" ? "Align " : "") +
								a[0].toUpperCase() +
								a.slice(1)
						)}
						isActive={reviewTextAlign === a}
						onClick={() => setAttributes({ reviewTextAlign: a })}
					/>
				))}
			</Toolbar>
		</BlockControls>
	);
};

export const inspectorControls = props => {
	const { attributes, setAttributes } = props;

	const { starCount, starSize, starColor, selectedStars } = attributes;
	return (
		<InspectorControls>
			<PanelBody title={__("Star Settings")}>
				<PanelColorSettings
					title={__("Color")}
					initialOpen={false}
					colorSettings={[
						{
							value: starColor,
							onChange: colorValue =>
								setAttributes({
									starColor: colorValue
								}),
							label: __("")
						}
					]}
				/>
				<RangeControl
					label={__("Star size")}
					value={starSize}
					onChange={value => setAttributes({ starSize: value })}
					min={10}
					max={30}
					beforeIcon="editor-contract"
					afterIcon="editor-expand"
					allowReset
				/>
				<RangeControl
					label={__("Number of stars")}
					value={starCount}
					onChange={value =>
						setAttributes({
							starCount: value,
							selectedStars: value < selectedStars ? value : selectedStars
						})
					}
					min={5}
					max={10}
					beforeIcon="star-empty"
					allowReset
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export const editorDisplay = props => {
	const { setAttributes, setState, highlightedStars } = props;

	const {
		starCount,
		starSize,
		starColor,
		selectedStars,
		reviewText,
		reviewTextAlign,
		starAlign
	} = props.attributes;
	return (
		<Fragment>
			<div
				className="ub-star-outer-container"
				style={{
					justifyContent:
						starAlign === "center"
							? "center"
							: `flex-${starAlign === "left" ? "start" : "end"}`
				}}
			>
				<div
					className="ub-star-inner-container"
					onMouseLeave={() => setState({ highlightedStars: 0 })}
				>
					{[...Array(starCount)].map((e, i) => (
						<div
							key={i}
							onMouseEnter={() => {
								setState({ highlightedStars: i + 1 });
							}}
							onClick={() => {
								if (selectedStars % 1 === 0) {
									setAttributes({
										selectedStars: i + (selectedStars - 1 === i ? 0.5 : 1)
									});
								} else {
									setAttributes({
										selectedStars: i + (selectedStars - 0.5 === i ? 1 : 0.5)
									});
								}
							}}
						>
							{i < (highlightedStars ? highlightedStars : selectedStars) ? (
								highlightedStars ? (
									highlightedStars - 1 === i ? (
										selectedStars % 1 > 0 ? (
											highlightedStars - selectedStars - 0.5 !== 0 ? (
												<HalfStar size={starSize} fillColor={starColor} />
											) : (
												<FullStar size={starSize} fillColor={starColor} />
											)
										) : highlightedStars - selectedStars !== 0 ? (
											<FullStar size={starSize} fillColor={starColor} />
										) : (
											<HalfStar size={starSize} fillColor={starColor} />
										)
									) : (
										<FullStar size={starSize} fillColor={starColor} />
									)
								) : selectedStars - i >= 1 ? (
									<FullStar size={starSize} fillColor={starColor} />
								) : (
									<HalfStar size={starSize} fillColor={starColor} />
								)
							) : (
								<EmptyStar size={starSize} />
							)}
						</div>
					))}
				</div>
			</div>
			<RichText
				tagName="div"
				className="ub-review-text"
				placeholder={__("The text of the review goes here")}
				value={reviewText}
				style={{ textAlign: reviewTextAlign }}
				onChange={text => setAttributes({ reviewText: text })}
				keepPlaceholderOnFocus={true}
				formattingControls={["bold", "italic", "strikethrough", "link"]}
			/>
		</Fragment>
	);
};
