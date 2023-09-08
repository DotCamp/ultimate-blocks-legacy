import { __ } from "@wordpress/i18n";

const styles = [
	{
		name: "ub-progress-bar-line-wrapper",
		isDefault: true,
		label: __("Line", "ultimate-blocks"),
	},
	{
		name: "ub-progress-bar-circle-wrapper",
		label: __("Circle", "ultimate-blocks"),
	},
	{
		name: "ub-progress-bar-half-circle-wrapper",
		label: __("Half Circle", "ultimate-blocks"),
	},
];

styles.forEach((style) => {
	wp.blocks.registerBlockStyle("ub/progress-bar", style);
});
