const blockStyles = [
	{
		name: "fill",
		label: "Fill",
		isDefault: true,
	},
	{
		name: "outline",
		label: "Outline",
	},
];

blockStyles.forEach((styles) => {
	wp.blocks.registerBlockStyle("ub/single-button", styles);
});
