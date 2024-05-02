import { __ } from "@wordpress/i18n";

const styles = [
	{
		name: "default",
		isDefault: true,
		label: __("Default", "ultimate-blocks"),
	},
	{
		name: "rounded",
		label: __("Rounded", "ultimate-blocks"),
	},
	{
		name: "framed",
		label: __("Framed", "ultimate-blocks"),
	},
];

styles.forEach((style) => {
	wp.blocks.registerBlockStyle("ub/image", style);
});
