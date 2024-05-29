import { __ } from "@wordpress/i18n";

const styles = [
	{
		name: "default",
		isDefault: true,
		label: __("Default", "ultimate-blocks"),
	},
	{
		name: "circle-fill",
		label: __("Circle Fill", "ultimate-blocks"),
	},
	{
		name: "circle-outline",
		label: __("Circle Outline", "ultimate-blocks"),
	},
	{
		name: "square-fill",
		label: __("Square Fill", "ultimate-blocks"),
	},
	{
		name: "square-outline",
		label: __("Square Outline", "ultimate-blocks"),
	},
];

styles.forEach((style) => {
	wp.blocks.registerBlockStyle("ub/icon", style);
});
