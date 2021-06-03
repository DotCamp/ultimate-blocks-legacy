import { Star } from "./icons";

const { __ } = wp.i18n;
const { InspectorControls, RichText, BlockControls, ColorPalette } =
	wp.blockEditor || wp.editor;
const { PanelBody, RangeControl, ToolbarGroup, ToolbarButton } = wp.components;

export const blockControls = (props) => {
	const { attributes, setAttributes } = props;

	const { reviewTextAlign } = attributes;
	return (
		<BlockControls>
			<ToolbarGroup>
				{["left", "center", "right"].map((a) => (
					<ToolbarButton
						icon={`align-${a}`}
						label={__(`Align stars ${a}`)}
						onClick={() => setAttributes({ starAlign: a })}
					/>
				))}
			</ToolbarGroup>
			<ToolbarGroup>
				{["left", "center", "right", "justify"].map((a) => (
					<ToolbarButton
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
			</ToolbarGroup>
		</BlockControls>
	);
};

export const inspectorControls = (props) => {
	const { attributes, setAttributes } = props;

	const { starCount, starSize, starColor, selectedStars, reviewTextColor } =
		attributes;
	return (
		<InspectorControls>
			<PanelBody title={__("Star Settings")}>
				<p>
					{__("Star Color")}
					<span
						class="component-color-indicator"
						aria-label={`(Color: ${starColor})`}
						style={{ background: starColor }}
					/>
				</p>
				<ColorPalette
					value={starColor}
					onChange={(colorValue) => setAttributes({ starColor: colorValue })}
				/>
				<RangeControl
					label={__("Star size")}
					value={starSize}
					onChange={(value) => setAttributes({ starSize: value })}
					min={10}
					max={30}
					beforeIcon="editor-contract"
					afterIcon="editor-expand"
				/>
				<RangeControl
					label={__("Number of stars")}
					value={starCount}
					onChange={(value) =>
						setAttributes({
							starCount: value,
							selectedStars: value < selectedStars ? value : selectedStars,
						})
					}
					min={5}
					max={10}
					beforeIcon="star-empty"
				/>
				<RangeControl
					label={__("Star value")}
					value={selectedStars}
					onChange={(selectedStars) => setAttributes({ selectedStars })}
					min={0.1}
					max={starCount}
					step={0.1}
					beforeIcon="star-half"
				/>
			</PanelBody>
			<PanelBody>
				<p>
					{__("Text Color")}
					{reviewTextColor && (
						<span
							class="component-color-indicator"
							aria-label={`(Color: ${reviewTextColor})`}
							style={{ background: reviewTextColor }}
						/>
					)}
				</p>
				<ColorPalette
					value={reviewTextColor}
					onChange={(reviewTextColor) => setAttributes({ reviewTextColor })}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export const editorDisplay = (props) => {
	const { setAttributes, setState, highlightedStars } = props;

	const {
		blockID,
		starCount,
		starSize,
		starColor,
		selectedStars,
		reviewText,
		reviewTextColor,
		reviewTextAlign,
		starAlign,
	} = props.attributes;
	return (
		<>
			<div
				className="ub-star-outer-container"
				style={{
					justifyContent:
						starAlign === "center"
							? "center"
							: `flex-${starAlign === "left" ? "start" : "end"}`,
				}}
			>
				<div
					className="ub-star-inner-container"
					onMouseLeave={() => setState({ highlightedStars: 0 })}
				>
					{[...Array(starCount)].map((e, i) => (
						<div
							key={i}
							onMouseEnter={() => setState({ highlightedStars: i + 1 })}
							onClick={() => {
								if (selectedStars % 1 === 0) {
									setAttributes({
										selectedStars: i + (selectedStars - 1 === i ? 0.5 : 1),
									});
								} else {
									setAttributes({
										selectedStars: i + (selectedStars - 0.5 === i ? 1 : 0.5),
									});
								}
							}}
						>
							<Star
								id={blockID}
								index={i}
								size={starSize}
								value={
									(highlightedStars -
										(highlightedStars === selectedStars ? 0.5 : 0) ||
										selectedStars) - i
								}
								displayColor={starColor}
							/>
						</div>
					))}
				</div>
			</div>
			<RichText
				tagName="div"
				className="ub-review-text"
				placeholder={__("The text of the review goes here")}
				value={reviewText}
				style={{
					textAlign: reviewTextAlign,
					color: reviewTextColor || "inherit",
				}}
				onChange={(text) => setAttributes({ reviewText: text })}
				keepPlaceholderOnFocus={true}
				allowedFormats={[
					"core/bold",
					"core/italic",
					"core/strikethrough",
					"core/link",
				]}
			/>
		</>
	);
};
