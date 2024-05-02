import { __ } from "@wordpress/i18n";

export const DEFAULT_ASPECT_RATIO_OPTIONS = [
	{
		label: __("Original", "ultimate-blocks"),
		value: "",
	},
	{
		label: __("Square - 1:1", "ultimate-blocks"),
		value: "1",
	},
	{
		label: __("Standard - 4:3", "ultimate-blocks"),
		value: "4/3",
	},
	{
		label: __("Portrait - 3:4", "ultimate-blocks"),
		value: "3/4",
	},
	{
		label: __("Classic - 3:2", "ultimate-blocks"),
		value: "3/2",
	},
	{
		label: __("Classic Portrait - 2:3", "ultimate-blocks"),
		value: "2/3",
	},
	{
		label: __("Wide - 16:9", "ultimate-blocks"),
		value: "16/9",
	},
	{
		label: __("Tall - 9:16", "ultimate-blocks"),
		value: "9/16",
	},
];

export const DEFAULT_SCALE_OPTIONS = [
	{
		value: "cover",
		label: __("Cover", "ultimate-blocks"),
		help: __("Fill the space by clipping what doesn't fit."),
	},
	{
		value: "contain",
		label: __("Contain", "ultimate-blocks"),
		help: __("Fit the content to the space without clipping."),
	},
];

export const DEFAULT_SIZE_SLUG_OPTIONS = [
	{
		label: __("Thumbnail", "ultimate-blocks"),
		value: "thumbnail",
	},
	{
		label: __("Medium", "ultimate-blocks"),
		value: "medium",
	},
	{
		label: __("Large", "ultimate-blocks"),
		value: "large",
	},
	{
		label: __("Full Size", "ultimate-blocks"),
		value: "full",
	},
];
