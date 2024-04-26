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
	transforms: {
		from: [
			{
				type: "block",
				blocks: ["core/buttons"],
				transform: (attributes, innerBlocks) => {
					let revisedDefaultProps = {
						buttonText: "Button Text",
						url: "",
						size: "medium",
						buttonColor: "#313131",
						buttonHoverColor: "#313131",
						buttonTextColor: "#ffffff",
						buttonTextHoverColor: "#ffffff",
						border: {},
						buttonRadius: {},
						padding: {},
						margin: {},
						chosenIcon: "",
						iconPosition: "left",
						iconSize: 0,
						iconUnit: "px",
						buttonIsTransparent: false,
						addNofollow: true,
						openInNewTab: true,
						addSponsored: false,
						buttonWidth: "flex",
					};

					let newButtons = innerBlocks.map((ib) => {
						let radiusSettings = {};
						let borderSettings = {};
						if ("style" in ib.attributes && "border" in ib.attributes.style) {
							const br = ib.attributes.style.border.radius;
							const b = ib.attributes.style.border;
							if (br) {
								if (typeof br === "string") {
									radiusSettings = Object.assign(radiusSettings, {
										borderRadius: {
											topLeft: br,
											topRight: br,
											bottomLeft: br,
											bottomRight: br,
										},
									});
								} else {
									const topLeft = br?.topLeft || "0px";
									const topRight = br?.topRight || "0px";
									const bottomLeft = br?.bottomLeft || "0px";
									const bottomRight = br?.bottomRight || "0px";
									radiusSettings = Object.assign(radiusSettings, {
										borderRadius: {
											topLeft,
											topRight,
											bottomLeft,
											bottomRight,
										},
									});
								}
							}
							if (b) {
								borderSettings = Object.assign(borderSettings, {
									border: b,
								});
								delete borderSettings.radius;
							}
						}
						if ("style" in ib.attributes && "spacing" in ib.attributes.style) {
							const padding = ib.attributes.style.spacing?.padding ?? {};
							revisedDefaultProps = Object.assign(revisedDefaultProps, {
								padding,
							});
						}
						const oldButtonStyle = window.getComputedStyle(
							document.querySelector(`#block-${ib.clientId}>div`),
						);

						const isUsingOutline =
							"className" in ib.attributes &&
							ib.attributes.className === "is-style-outline";
						const buttonAttributes = Object.assign(revisedDefaultProps, {
							buttonRounded: Object.keys(radiusSettings).length > 0,
							buttonText: ib.attributes.text || "",
							buttonColor: isUsingOutline
								? oldButtonStyle.color
								: oldButtonStyle.backgroundColor,
							buttonTextColor: oldButtonStyle.color,
							buttonIsTransparent: isUsingOutline,
							url: ib.attributes.url,
							borderRadius: radiusSettings.borderRadius,
							...borderSettings,
						});
						return createBlock("ub/single-button", buttonAttributes, []); //prevent old buttonAttributes values from overwriting new ones
					});

					return createBlock(
						"ub/buttons",
						{
							blockSpacing: attributes.blockSpacing,
							padding: attributes.padding,
							margin: attributes.margin,
							isFlexWrap: attributes.isFlexWrap,
							align: attributes.align,
							orientation: attributes.orientation,
						},
						newButtons,
					);
				},
			},
			{
				type: "block",
				blocks: ["ub/button"],
				transform: (attributes) => {
					let newButtons = attributes.buttons.map((buttonAttributes) => {
						return createBlock("ub/single-button", buttonAttributes, []); //prevent old buttonAttributes values from overwriting new ones
					});

					return createBlock(
						"ub/buttons",
						{
							blockSpacing: attributes.blockSpacing,
							padding: attributes.padding,
							margin: attributes.margin,
							isFlexWrap: attributes.isFlexWrap,
							align: attributes.align,
							orientation: attributes.orientation,
						},
						newButtons,
					);
				},
			},
		],
	},
});
