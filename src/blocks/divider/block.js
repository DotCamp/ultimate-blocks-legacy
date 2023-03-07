/**
 * BLOCK: divider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from "./icons/icon";

import { version_1_1_2 } from "./oldVersions";

import { useEffect } from "react";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;

const { InspectorControls, ColorPalette } = wp.blockEditor || wp.editor;

const {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	Button,
	ButtonGroup,
} = wp.components;

const { withSelect } = wp.data;

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	borderSize: {
		type: "number",
		default: 2,
	},
	borderStyle: {
		type: "string",
		default: "solid",
	},
	borderColor: {
		type: "string",
		default: "#ccc",
	},
	borderHeight: {
		type: "number",
		default: 20,
	},
	width: {
		type: "number",
		default: 100,
	},
	alignment: {
		type: "string",
		default: "center",
	},
};
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

function DividerBlock(props) {
	const {
		attributes: {
			blockID,
			borderSize,
			borderStyle,
			borderColor,
			borderHeight,
			width,
			alignment,
		},
		isSelected,
		setAttributes,
		className,
		block,
		getBlock,
		getClientIdsWithDescendants,
	} = props;

	useEffect(() => {
		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

	return (
		<>
			{isSelected && (
				<InspectorControls>
					<PanelBody title={__("Divider Settings")}>
						<RangeControl
							label={__("Thickness")}
							value={borderSize}
							onChange={(value) => setAttributes({ borderSize: value })}
							min={1}
							max={20}
							beforeIcon="minus"
							allowReset
						/>

						<RangeControl
							label={__("Height")}
							value={borderHeight}
							onChange={(value) => setAttributes({ borderHeight: value })}
							min={10}
							max={200}
							beforeIcon="minus"
							allowReset
						/>
						<RangeControl
							label={__("Width")}
							value={width}
							onChange={(value) => setAttributes({ width: value })}
							min={0}
							max={100}
							allowReset
						/>
						<PanelRow>
							<p>{__("Alignment")}</p>
							{width < 100 && (
								<ButtonGroup>
									{["left", "center", "right"].map((a) => (
										<Button
											icon={`align-${a}`}
											isPressed={alignment === a}
											onClick={() => setAttributes({ alignment: a })}
										/>
									))}
								</ButtonGroup>
							)}
						</PanelRow>
						<p>
							{__("Color")}
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${borderColor})`}
								style={{ background: borderColor }}
							/>
						</p>
						<ColorPalette
							value={borderColor}
							onChange={(borderColor) => setAttributes({ borderColor })}
							allowReset
						/>

						<p>{__("Style")}</p>
						<SelectControl
							options={["solid", "dotted", "dashed"].map((o) => ({
								value: o,
								label: __(o),
							}))}
							value={borderStyle}
							onChange={(borderStyle) => {
								setAttributes({ borderStyle });
							}}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			<div className={className}>
				<div
					className="ub_divider"
					style={Object.assign(
						{
							borderTop: `${borderSize}px ${borderStyle} ${borderColor}`,
							marginTop: borderHeight + "px",
							marginBottom: borderHeight + "px",
							width: width + "%",
						},
						alignment === "left"
							? { marginLeft: "0" }
							: alignment === "right"
							? { marginRight: "0" }
							: {}
					)}
				/>
			</div>
		</>
	);
}

registerBlockType("ub/divider", {
	title: __("Divider"),
	description: __("Add custom divider between your blocks. Customize the color, size, everything.", "ultimate-blocks"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Divider"), __("Separator"), __("Ultimate Blocks")],
	attributes,
	example: {
		attributes: {
			borderSize: '4',
			borderStyle: 'dashed',
			borderColor: '#f63d3d'
		}
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(DividerBlock),

	transforms: {
		from: [
			{
				type: "block",
				blocks: "core/separator",
				transform: (attributes) =>
					createBlock(
						"ub/divider",
						"style" in attributes
							? {
									borderColor: attributes.style.color.background,
							  }
							: {}
					),
			},
		],
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save() {
		return null;
	},

	deprecated: [
		{
			attributes,
			save: version_1_1_2,
		},
	],
});
