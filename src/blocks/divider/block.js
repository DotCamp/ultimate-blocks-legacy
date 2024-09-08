/**
 * BLOCK: divider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from "./icons/icon";

import { version_1_1_2 } from "./oldVersions";

import { Fragment, useEffect } from "react";
import { PanelColorSettings, useBlockProps } from "@wordpress/block-editor";

import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";

import {
	InspectorControls,
	HeightControl,
	BlockAlignmentControl,
	BlockControls,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import { PanelBody, RangeControl, SelectControl } from "@wordpress/components";
import { getStyles } from "./get-styles";
import { CustomToggleGroupControl, SpacingControl } from "../components";
import { withSelect } from "@wordpress/data";
import { AVAILABLE_JUSTIFICATIONS, getParentBlock } from "../../common";
import classNames from "classnames";
import { isEmpty } from "lodash";

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
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
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
			align,
			alignment,
			orientation,
			lineHeight,
			dividerWidth,
			isWidthControlChanged,
		},
		isSelected,
		setAttributes,
		className,
		block,
		getBlock,
		getClientIdsWithDescendants,
		rootBlockClientId,
	} = props;
	const blockProps = useBlockProps({
		className: classNames(`ub-divider-orientation-${orientation}`, {
			[`align${align}`]: !isEmpty(align),
		}),
	});
	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}
		if (!isWidthControlChanged) {
			setAttributes({ dividerWidth: `${width}%`, isWidthControlChanged: true });
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const styles = getStyles(props.attributes);
	const borderName = orientation === "horizontal" ? "borderTop" : "borderLeft";
	const dividerStyle =
		orientation === "horizontal"
			? {
					marginTop: borderHeight + "px",
					marginBottom: borderHeight + "px",
					width: dividerWidth,
				}
			: {
					width: "fit-content",
					height: lineHeight,
				};
	return (
		<div {...blockProps}>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={align}
					onChange={(newValue) => setAttributes({ align: newValue })}
				/>
			</BlockControls>
			{isSelected && (
				<Fragment>
					<InspectorControls>
						<PanelBody title={__("Line Settings")}>
							<RangeControl
								label={__("Thickness")}
								value={borderSize}
								onChange={(value) => setAttributes({ borderSize: value })}
								min={1}
								max={20}
								resetFallbackValue={2}
								beforeIcon="minus"
								allowReset
							/>

							{orientation === "horizontal" && (
								<>
									<RangeControl
										label={__("Height")}
										value={borderHeight}
										onChange={(value) => setAttributes({ borderHeight: value })}
										min={10}
										max={200}
										resetFallbackValue={2}
										beforeIcon="minus"
										allowReset
									/>
									<HeightControl
										label={__("Width", "ultimate-blocks-pro")}
										value={dividerWidth}
										onChange={(value) => setAttributes({ dividerWidth: value })}
										allowReset
									/>
									<br></br>
								</>
							)}
							{orientation === "vertical" && (
								<>
									<HeightControl
										label={__("Line Height")}
										value={lineHeight}
										onChange={(value) => setAttributes({ lineHeight: value })}
										allowReset
									/>
									<br></br>
								</>
							)}
							<CustomToggleGroupControl
								isAdaptiveWidth
								options={[
									{
										label: __("Horizontal", "ultimate-blocks"),
										value: "horizontal",
									},
									{
										label: __("Vertical", "ultimate-blocks"),
										value: "vertical",
									},
								]}
								attributeKey="orientation"
								label={__("Orientation", "ultimate-blocks")}
							/>
							{orientation === "vertical" && (
								<CustomToggleGroupControl
									isAdaptiveWidth
									options={AVAILABLE_JUSTIFICATIONS.slice(
										0,
										AVAILABLE_JUSTIFICATIONS.length - 1,
									)}
									attributeKey="alignment"
									label={__("Alignment", "ultimate-blocks")}
								/>
							)}
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody
							initialOpen={false}
							title={__("Divider", "ultimate-blocks")}
						>
							<SelectControl
								label={__("Line type")}
								value={borderStyle}
								options={[
									{
										value: "solid",
										label: __("solid", "ultimate-blocks"),
									},
									{
										value: "dotted",
										label: __("dotted", "ultimate-blocks"),
									},
									{
										value: "dashed",
										label: __("dashed", "ultimate-blocks"),
									},
								]}
								onChange={(typeVal) => setAttributes({ borderStyle: typeVal })}
							/>
						</PanelBody>
						<PanelBody
							initialOpen={false}
							title={__("Colors", "ultimate-blocks")}
						>
							<PanelColorSettings
								title={__("Line", "ultimate-blocks")}
								initialOpen={true}
								colorSettings={[
									{
										value: borderColor,
										onChange: (colorVal) =>
											setAttributes({
												borderColor: colorVal,
											}),
										label: __("Main", "ultimate-blocks"),
									},
								]}
							></PanelColorSettings>
						</PanelBody>
						<PanelBody
							title={__("Dimension Settings", "ultimate-blocks")}
							initialOpen={false}
						>
							<SpacingControl
								showByDefault
								attrKey="padding"
								label={__("Padding", "ultimate-blocks")}
							/>
							<SpacingControl
								minimumCustomValue={-Infinity}
								showByDefault
								attrKey="margin"
								label={__("Margin", "ultimate-blocks")}
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			)}
			<div className={className} style={styles}>
				<div
					className="ub_divider"
					style={Object.assign(
						{
							[borderName]: `${borderSize}px ${borderStyle} ${borderColor}`,
							...dividerStyle,
						},
						alignment === "left"
							? { marginLeft: "0" }
							: alignment === "right"
								? { marginRight: "0" }
								: {},
					)}
				/>
			</div>
		</div>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	icon,
	attributes: metadata.attributes,
	example: {
		attributes: {
			borderSize: "4",
			borderStyle: "dashed",
			borderColor: "#e11b4c",
		},
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
		const { getBlock, getClientIdsWithDescendants, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(ownProps.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);
		return {
			block,
			getBlock,
			getClientIdsWithDescendants,
			rootBlockClientId,
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
							: {},
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
