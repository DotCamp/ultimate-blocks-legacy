import icon, {
	RegularCountdownIcon,
	CircularCountdownIcon,
	TickingCountdownIcon,
} from "./icon";

import Timer from "./components";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls, RichText, PanelColorSettings, BlockControls } =
	wp.blockEditor || wp.editor;
const {
	DateTimePicker,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
	RangeControl,
} = wp.components;
const { withSelect } = wp.data;
const { withState, compose } = wp.compose;

registerBlockType("ub/countdown", {
	title: __("Countdown"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Countdown"), __("Timer"), __("Ultimate Blocks")],
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		endDate: {
			type: "number",
			default: 60 * (1440 + Math.ceil(Date.now() / 60000)), // 24 hours from Date.now
		},
		style: {
			type: "string",
			default: "Odometer", //available types: Regular, Circular, Odometer
		},
		expiryMessage: {
			type: "string",
			default: "",
		},
		messageAlign: {
			type: "string",
			default: "left",
		},
		circleColor: {
			type: "string",
			default: "#2DB7F5",
		},
		circleSize: {
			type: "number",
			default: 70,
		},
		largestUnit: {
			type: "string",
			default: "week",
		},
		smallestUnit: {
			type: "string",
			default: "second",
		},
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
		withState({ forceUpdate: false }),
	])(function (props) {
		const {
			isSelected,
			setAttributes,
			block,
			getBlock,
			getClientIdsWithDescendants,
			setState,
			forceUpdate,
			attributes: {
				blockID,
				style,
				endDate,
				expiryMessage,
				circleColor,
				circleSize,
				messageAlign,
				largestUnit,
				smallestUnit,
			},
		} = props;

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}

		const timeUnits = ["week", "day", "hour", "minute", "second"];

		return [
			isSelected && (
				<InspectorControls>
					{style === "Circular" && (
						<PanelBody title={__("Circle style")}>
							<PanelColorSettings
								title={__("Color")}
								initialOpen={true}
								colorSettings={[
									{
										value: circleColor,
										onChange: (colorValue) =>
											setAttributes({ circleColor: colorValue }),
										label: "",
									},
								]}
							/>
							<RangeControl
								label={__("Size")}
								value={circleSize}
								onChange={(circleSize) => setAttributes({ circleSize })}
								min={30}
								max={100}
							/>
						</PanelBody>
					)}
					<PanelBody title={__("Timer expiration")}>
						<DateTimePicker
							currentDate={endDate * 1000}
							onChange={(value) => {
								setAttributes({
									endDate: Math.floor(Date.parse(value) / 1000),
								});
							}}
						/>
					</PanelBody>
					<PanelBody title={__("Unit display")}>
						<SelectControl
							label={__("Largest unit")}
							value={largestUnit}
							options={timeUnits
								.filter((_, i) => timeUnits.indexOf(smallestUnit) > i)
								.map((timeUnit) => ({
									label: __(timeUnit),
									value: timeUnit,
								}))}
							onChange={(largestUnit) => {
								setAttributes({ largestUnit });
								setState({ forceUpdate: true });
							}}
						/>
						<SelectControl
							label={__("Smallest unit")}
							value={smallestUnit}
							options={timeUnits
								.filter((_, i) => timeUnits.indexOf(largestUnit) < i)
								.map((timeUnit) => ({
									label: __(timeUnit),
									value: timeUnit,
								}))}
							onChange={(smallestUnit) => {
								setAttributes({ smallestUnit });
								setState({ forceUpdate: true });
							}}
						/>
					</PanelBody>
				</InspectorControls>
			),
			isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							isPrimary={style === "Regular"}
							icon={RegularCountdownIcon}
							label={__("Regular")}
							onClick={() => setAttributes({ style: "Regular" })}
						/>
						<ToolbarButton
							isPrimary={style === "Circular"}
							icon={CircularCountdownIcon}
							label={__("Circular")}
							onClick={() => setAttributes({ style: "Circular" })}
						/>
						<ToolbarButton
							isPrimary={style === "Odometer"}
							icon={TickingCountdownIcon}
							label={__("Odometer")}
							onClick={() => setAttributes({ style: "Odometer" })}
						/>
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
								isActive={messageAlign === a}
								onClick={() => setAttributes({ messageAlign: a })}
							/>
						))}
					</ToolbarGroup>
				</BlockControls>
			),
			<>
				<Timer
					timerStyle={style}
					deadline={endDate}
					color={circleColor}
					size={circleSize}
					largestUnit={largestUnit}
					smallestUnit={smallestUnit}
					isAnimated={true}
					forceUpdate={forceUpdate}
					finishForcedUpdate={() => setState({ forceUpdate: false })}
				/>
				<RichText
					tagName="div"
					placeholder={__("Text to show after the countdown is over")}
					style={{ textAlign: messageAlign }}
					value={expiryMessage}
					onChange={(text) => setAttributes({ expiryMessage: text })}
					keepPlaceholderOnFocus={true}
				/>
			</>,
		];
	}),

	save: () => null,
});
