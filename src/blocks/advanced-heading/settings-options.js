import fontsList from "./fonts";
const { __ } = wp.i18n;

const headingLevels = [1, 2, 3, 4, 5, 6];

const textTransformOptions = [
	{
		value: "none",
		label: __("None", "ultimate-blocks"),
	},
	{
		value: "uppercase",
		label: __("Uppercase", "ultimate-blocks"),
	},
	{
		value: "lowercase",
		label: __("Lowercase", "ultimate-blocks"),
	},
	{
		value: "capitalize",
		label: __("Capitalize", "ultimate-blocks"),
	},
];

const fontWeightOptions = [
	{
		value: "Normal",
		label: __("Normal", "ultimate-blocks"),
	},
	{
		value: "Bold",
		label: __("Bold", "ultimate-blocks"),
	},
	{
		value: "100",
		label: __("100", "ultimate-blocks"),
	},
	{
		value: "200",
		label: __("200", "ultimate-blocks"),
	},
	{
		value: "300",
		label: __("300", "ultimate-blocks"),
	},
	{
		value: "400",
		label: __("400", "ultimate-blocks"),
	},
	{
		value: "500",
		label: __("500", "ultimate-blocks"),
	},
	{
		value: "600",
		label: __("600", "ultimate-blocks"),
	},
	{
		value: "700",
		label: __("700", "ultimate-blocks"),
	},
	{
		value: "800",
		label: __("800", "ultimate-blocks"),
	},
	{
		value: "900",
		label: __("900", "ultimate-blocks"),
	},
];

const fontFamilyOptions = fontsList.sort().map((fontFamilyOption) => {
	return {
		value: fontFamilyOption,
		label: __(fontFamilyOption, "ultimate-blocks"),
	};
});

export {
	headingLevels,
	textTransformOptions,
	fontWeightOptions,
	fontFamilyOptions,
};
