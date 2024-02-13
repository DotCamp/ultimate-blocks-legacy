import Edit from "./edit";
import metadata from "./block.json";
import { __ } from "@wordpress/i18n";
import { InnerBlocks } from "@wordpress/block-editor";
import { registerBlockType, createBlock } from "@wordpress/blocks";

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	attributes: metadata.attributes,
	save: () => <InnerBlocks.Content />,
	icon: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="24" height="24" fill="white" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4 8C2.89543 8 2 8.89543 2 10V14C2 15.1046 2.89543 16 4 16H20C21.1046 16 22 15.1046 22 14V10C22 8.89543 21.1046 8 20 8H4ZM7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5H17C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5H7Z"
				fill="#E11B4C"
			/>
		</svg>
	),
	example: {
		// attributes: {
		// 	buttonColor: "#f01313",
		// 	size: "medium",
		// },
	},
	// transforms: {
	// 	from: [
	// 		{
	// 			type: "block",
	// 			blocks: ["core/buttons"],
	// 			transform: (_, innerBlocks) => {
	// 				const revisedDefaultProps = {
	// 					buttonText: "Button Text",
	// 					url: "",
	// 					size: "medium",
	// 					buttonColor: "#313131",
	// 					buttonHoverColor: "#313131",
	// 					buttonTextColor: "#ffffff",
	// 					buttonTextHoverColor: "#ffffff",
	// 					buttonRounded: false,
	// 					buttonRadius: 0, //retained for compatibility
	// 					buttonRadiusUnit: "px", //retained for compatibility

	// 					topLeftRadius: 0,
	// 					topLeftRadiusUnit: "px",
	// 					topRightRadius: 0,
	// 					topRightRadiusUnit: "px",
	// 					bottomLeftRadius: 0,
	// 					bottomLeftRadiusUnit: "px",
	// 					bottomRightRadius: 0,
	// 					bottomRightRadiusUnit: "px",

	// 					chosenIcon: "",
	// 					iconPosition: "left",
	// 					iconSize: 0,
	// 					iconUnit: "px",
	// 					buttonIsTransparent: false,
	// 					addNofollow: true,
	// 					openInNewTab: true,
	// 					addSponsored: false,
	// 					buttonWidth: "flex",
	// 				};

	// 				let newButtons = innerBlocks.map((ib) => {
	// 					const splitNumFromUnit = (str) => {
	// 						const [, ...arr] = str.match(/(\d*)([\s\S]*)/);
	// 						return [Number(arr[0]), arr[1]];
	// 					};

	// 					let radiusSettings = {};

	// 					if ("style" in ib.attributes && "border" in ib.attributes.style) {
	// 						const br = ib.attributes.style.border.radius;

	// 						if (typeof br === "string") {
	// 							const parsedRadius = splitNumFromUnit(br);

	// 							radiusSettings = Object.assign(radiusSettings, {
	// 								topLeftRadius: parsedRadius[0],
	// 								topLeftRadiusUnit: parsedRadius[1],
	// 								topRightRadius: parsedRadius[0],
	// 								topRightRadiusUnit: parsedRadius[1],
	// 								bottomLeftRadius: parsedRadius[0],
	// 								bottomLeftRadiusUnit: parsedRadius[1],
	// 								bottomRightRadius: parsedRadius[0],
	// 								bottomRightRadiusUnit: parsedRadius[1],

	// 								buttonRadius: parsedRadius[0],
	// 								buttonRadiusUnit: parsedRadius[1],
	// 							});
	// 						} else {
	// 							const topLeft = splitNumFromUnit(br.topLeft || "0px");
	// 							const topRight = splitNumFromUnit(br.topRight || "0px");
	// 							const bottomLeft = splitNumFromUnit(br.bottomLeft || "0px");
	// 							const bottomRight = splitNumFromUnit(br.bottomRight || "0px");

	// 							radiusSettings = Object.assign(radiusSettings, {
	// 								topLeftRadius: topLeft[0],
	// 								topLeftRadiusUnit: topLeft[1],
	// 								topRightRadius: topRight[0],
	// 								topRightRadiusUnit: topRight[1],
	// 								bottomLeftRadius: bottomLeft[0],
	// 								bottomLeftRadiusUnit: bottomLeft[1],
	// 								bottomRightRadius: bottomRight[0],
	// 								bottomRightRadiusUnit: bottomRight[1],
	// 							});
	// 						}
	// 					}

	// 					const oldButtonStyle = window.getComputedStyle(
	// 						document.querySelector(`#block-${ib.clientId}>div`),
	// 					);

	// 					const isUsingOutline =
	// 						"className" in ib.attributes &&
	// 						ib.attributes.className === "is-style-outline";

	// 					const buttonAttributes = Object.assign(
	// 						revisedDefaultProps,
	// 						{
	// 							buttonRounded: Object.keys(radiusSettings).length > 0,
	// 							buttonText: ib.attributes.text || "",
	// 							buttonColor: isUsingOutline
	// 								? oldButtonStyle.color
	// 								: oldButtonStyle.backgroundColor,
	// 							buttonTextColor: oldButtonStyle.color,
	// 							buttonIsTransparent: isUsingOutline,
	// 							url: ib.attributes.url,
	// 						},
	// 						radiusSettings,
	// 					);

	// 					return JSON.parse(JSON.stringify(buttonAttributes)); //prevent old buttonAttributes values from overwriting new ones
	// 				});

	// 				return createBlock("ub/button", { buttons: newButtons });
	// 			},
	// 		},
	// 	],
	// },
});
