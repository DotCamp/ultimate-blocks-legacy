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
	IconButton,
	PanelBody,
	Toolbar,
	SelectControl,
} = wp.components;
const { withSelect } = wp.data;

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
		largestUnit: {
			type: "string",
			default: "week",
		},
		smallestUnit: {
			type: "string",
			default: "second",
		},
	},

	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(function (props) {
		const {
			isSelected,
			setAttributes,
			block,
			getBlock,
			getClientIdsWithDescendants,
			attributes: {
				blockID,
				style,
				endDate,
				expiryMessage,
				circleColor,
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
						<PanelColorSettings
							title={__("Circle Color")}
							initialOpen={true}
							colorSettings={[
								{
									value: circleColor,
									onChange: (colorValue) =>
										setAttributes({
											circleColor: colorValue,
										}),
									label: "",
								},
							]}
						/>
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
							onChange={(largestUnit) => setAttributes({ largestUnit })}
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
							onChange={(smallestUnit) => setAttributes({ smallestUnit })}
						/>
					</PanelBody>
				</InspectorControls>
			),
			isSelected && (
				<BlockControls>
					<Toolbar>
						<IconButton
							isPrimary={style === "Regular"}
							icon={RegularCountdownIcon}
							label={__("Regular")}
							onClick={() => setAttributes({ style: "Regular" })}
						/>
						<IconButton
							isPrimary={style === "Circular"}
							icon={CircularCountdownIcon}
							label={__("Circular")}
							onClick={() => setAttributes({ style: "Circular" })}
						/>
						<IconButton
							isPrimary={style === "Odometer"}
							icon={TickingCountdownIcon}
							label={__("Odometer")}
							onClick={() => setAttributes({ style: "Odometer" })}
						/>
					</Toolbar>
					<Toolbar>
						{["left", "center", "right", "justify"].map((a) => (
							<IconButton
								icon={`editor-${a === "justify" ? a : "align" + a}`}
								label={__(
									(a !== "justify" ? "Align " : "") +
										a[0].toUpperCase() +
										a.slice(1)
								)}
								isActive={a}
								onClick={() => {
									setAttributes({ messageAlign: a });
								}}
							/>
						))}
					</Toolbar>
				</BlockControls>
			),
			<React.Fragment>
				<Timer
					timerStyle={style}
					deadline={endDate}
					color={circleColor}
					largestUnit={largestUnit}
					smallestUnit={smallestUnit}
				/>
				<RichText
					tagName="div"
					placeholder={__("Text to show after the countdown is over")}
					style={{ textAlign: messageAlign }}
					value={expiryMessage}
					onChange={(text) => setAttributes({ expiryMessage: text })}
					keepPlaceholderOnFocus={true}
				/>
			</React.Fragment>,
		];
	}),

	save: () => null,
});
