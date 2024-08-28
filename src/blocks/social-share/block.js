/**
 * BLOCK: social-share
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

// Import Icons

import {
	SortableContainer,
	SortableElement,
	arrayMove,
} from "react-sortable-hoc";
import metadata from "./block.json";
import {
	FacebookIcon,
	TwitterIcon,
	LinkedInIcon,
	PinterestIcon,
	RedditIcon,
	TumblrIcon,
	icon,
} from "./icons/icons";

// Import components
import Inspector from "./inspector";

import { useEffect, useState } from "react";
import { getStyles } from "./get-styles";
import { getParentBlock } from "../../common";

// variables
const iconSizes = {
	normal: 20,
	medium: 30,
	large: 40,
};

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { BlockControls, useBlockProps, JustifyContentControl } =
	wp.blockEditor || wp.editor;
const { withSelect } = wp.data;

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

const SortableItem = SortableElement(
	({ icon, iconSize, iconShape, color, caption, addOutline }) => {
		const iconDetails = {
			facebook: {
				bgColor: color || "#1877f2",
				main: (
					<FacebookIcon
						width={iconSize}
						height={iconSize}
						color={iconShape === "none" ? color || "#1877f2" : "#ffffff"}
					/>
				),
			},
			linkedin: {
				bgColor: color || "#2867b2",
				main: (
					<LinkedInIcon
						width={iconSize}
						height={iconSize}
						color={iconShape === "none" ? color || "#2867b2" : "#ffffff"}
					/>
				),
			},
			pinterest: {
				bgColor: color || "#e60023",
				main: (
					<PinterestIcon
						width={iconSize}
						height={iconSize}
						color={iconShape === "none" ? color || "#e60023" : "#ffffff"}
					/>
				),
			},
			twitter: {
				bgColor: color || "#1d9bf0",
				main: (
					<TwitterIcon
						width={iconSize}
						height={iconSize}
						color={iconShape === "none" ? color || "#1d9bf0" : "#ffffff"}
					/>
				),
			},
			tumblr: {
				bgColor: color || "#001935",
				main: (
					<TumblrIcon
						width={iconSize}
						height={iconSize}
						color={iconShape === "none" ? color || "#001935" : "#ffffff"}
					/>
				),
			},
			reddit: {
				bgColor: color || "#ff4500",
				main: (
					<RedditIcon
						width={iconSize}
						height={iconSize}
						color={iconShape === "none" ? color || "#ff4500" : "#ffffff"}
					/>
				),
			},
		};

		return (
			<div
				style={
					addOutline
						? {
								border: `1px solid ${iconDetails[icon].bgColor}`,
								margin: "5px",
								paddingRight: "5px",
							}
						: null
				}
			>
				<div
					href="#ub-social-share-block-editor"
					className={
						"ub-social-share-icon social-share-icon " + iconShape + " " + icon
					}
					style={{
						width: iconSize * 1.5,
						height: iconSize * 1.5,
						backgroundColor:
							iconShape === "none" ? "transparent" : iconDetails[icon].bgColor,
						borderRadius: iconShape === "circle" ? "50%" : "0",
						display: "inline-flex",
						boxShadow: iconShape === "none" ? "none" : null,
					}}
				>
					{iconDetails[icon].main}
				</div>
				<span style={{ color: iconDetails[icon].bgColor }}>{caption}</span>
			</div>
		);
	},
);

const SortableList = SortableContainer(
	({
		items,
		iconShape,
		iconSize,
		align,
		orientation,
		color,
		captions,
		useCaptions,
		addOutline,
	}) => (
		<div
			className={`social-share-icons align-icons-${align} orientation-icons-${orientation}`}
		>
			{items.map((value, index) => (
				<SortableItem
					key={`item-${value}`}
					index={index}
					icon={value}
					iconShape={iconShape}
					iconSize={iconSize}
					color={color}
					addOutline={addOutline && useCaptions}
					caption={useCaptions ? captions[value] : ""}
				/>
			))}
		</div>
	),
);

function SocialShareMain(props) {
	const [hasTransitioned, setHasTransitioned] = useState(false);

	const {
		attributes,
		setAttributes,
		isSelected,
		className,
		block,
		getBlock,
		getClientIdsWithDescendants,
		rootBlockClientId,
	} = props;
	const blockProps = useBlockProps();
	const {
		blockID,
		align,
		iconShape,
		iconOrder,
		buttonColor,
		useCaptions,
		addOutline,
		orientation,
	} = attributes;

	const iconSize = iconSizes[attributes.iconSize];

	const enabledIcon = {
		facebook: attributes.showFacebookIcon,
		twitter: attributes.showTwitterIcon,
		linkedin: attributes.showLinkedInIcon,
		pinterest: attributes.showPinterestIcon,
		reddit: attributes.showRedditIcon,
		tumblr: attributes.showTumblrIcon,
	};

	useEffect(() => {
		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}

		if (!hasTransitioned) {
			if (Object.values(enabledIcon).includes(false)) {
				setAttributes({
					iconOrder: iconOrder.filter((iconName) => enabledIcon[iconName]),
					showFacebookIcon: true,
					showTwitterIcon: true,
					showLinkedInIcon: true,
					showPinterestIcon: true,
					showRedditIcon: true,
					showTumblrIcon: true,
				});
			}
			setHasTransitioned(true);
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const styles = getStyles(attributes);
	return (
		<div {...blockProps}>
			{isSelected && (
				<>
					<BlockControls group="block">
						<JustifyContentControl
							allowedControls={["left", "center", "right"]}
							value={align}
							onChange={(next) => {
								setAttributes({ align: next });
							}}
						/>
					</BlockControls>
				</>
			)}
			{isSelected && <Inspector {...props} />}
			<div
				id="ub-social-share-block-editor"
				className={className}
				style={styles}
			>
				<SortableList
					axis="x"
					items={iconOrder}
					onSortEnd={({ oldIndex, newIndex }) =>
						setAttributes({
							iconOrder: arrayMove(iconOrder, oldIndex, newIndex),
						})
					}
					iconSize={iconSize}
					iconShape={iconShape}
					align={align}
					orientation={orientation}
					color={buttonColor}
					useCaptions={useCaptions}
					addOutline={addOutline}
					captions={{
						facebook: attributes.facebookCaption,
						twitter: attributes.twitterCaption,
						linkedin: attributes.linkedInCaption,
						pinterest: attributes.pinterestCaption,
						reddit: attributes.redditCaption,
						tumblr: attributes.tumblrCaption,
					}}
				/>
			</div>
		</div>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	attributes: metadata.attributes,
	icon: icon,
	example: {},
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
	})(SocialShareMain),

	save: () => null,
});
