import fontsList from "./fonts";
const { __ } = wp.i18n;

export const headingLevels = [1, 2, 3, 4, 5, 6];

export const textTransformOptions = [
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

export const fontWeightOptions = [
	"Normal",
	"Bold",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900",
].map((o) => ({ value: o, label: __(o, "ultimate-blocks") }));

export const fontFamilyOptions = fontsList.map((fontFamilyOption) => ({
	value: fontFamilyOption,
	label: __(fontFamilyOption, "ultimate-blocks"),
}));
