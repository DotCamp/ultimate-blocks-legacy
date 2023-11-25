import { __ } from "@wordpress/i18n";
import metadata from "./block.json";

const styles = [
	{
		name: "ub-countdown-regular",
		label: __("Regular", "ultimate-blocks"),
	},
	{
		name: "ub-countdown-odometer",
		label: __("Odometer", "ultimate-blocks"),
		isDefault: true,
	},
	{
		name: "ub-countdown-circular",
		label: __("Circular", "ultimate-blocks"),
	},
];

styles.forEach((style) => {
	wp.blocks.registerBlockStyle(metadata.name, style);
});
