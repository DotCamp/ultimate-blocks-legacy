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

// variables
const iconSizes = {
	normal: 20,
	medium: 30,
	large: 40,
};

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { BlockControls, AlignmentToolbar } = wp.blockEditor || wp.editor;
const { withSelect } = wp.data;
const { withState, compose } = wp.compose;

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
	}
);

const SortableList = SortableContainer(
	({
		items,
		iconShape,
		iconSize,
		align,
		color,
		captions,
		useCaptions,
		addOutline,
	}) => (
		<div
			className={"social-share-icons align-icons-" + align}
			style={{ display: "flex", flexDirection: "row" }}
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
	)
);

registerBlockType("ub/social-share", {
	title: __("Social Share"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("social"), __("share"), __("Ultimate Blocks")],
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		showFacebookIcon: {
			type: "boolean",
			default: true,
		},
		facebookCaption: {
			type: "string",
			default: "share",
		},
		showTwitterIcon: {
			type: "boolean",
			default: true,
		},
		twitterCaption: {
			type: "string",
			default: "tweet",
		},
		showLinkedInIcon: {
			type: "boolean",
			default: true,
		},
		linkedInCaption: {
			type: "string",
			default: "share",
		},
		showPinterestIcon: {
			type: "boolean",
			default: true,
		},
		pinterestCaption: {
			type: "string",
			default: "pin",
		},
		showRedditIcon: {
			type: "boolean",
			default: true,
		},
		redditCaption: {
			type: "string",
			default: "post",
		},
		showTumblrIcon: {
			type: "boolean",
			default: true,
		},
		tumblrCaption: {
			type: "string",
			default: "share",
		},
		iconSize: {
			type: "string",
			default: "normal",
		},
		iconShape: {
			type: "string",
			default: "circle", //available options: square, none
		},
		align: {
			type: "string",
			default: "left",
		},
		iconOrder: {
			type: "array",
			default: [
				"facebook",
				"twitter",
				"linkedin",
				"pinterest",
				"reddit",
				"tumblr",
			],
		},
		useCaptions: {
			type: "boolean",
			default: false,
		},
		addOutline: {
			type: "boolean",
			default: false, //default should be false
		},
		buttonColor: {
			type: "string",
			default: "", //when turned on, default value should be #cccccc
		},
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
		withState({ hasTransitioned: false }),
	])(function (props) {
		const {
			attributes,
			setAttributes,
			isSelected,
			className,
			block,
			hasTransitioned,
			setState,
			getBlock,
			getClientIdsWithDescendants,
		} = props;

		const {
			blockID,
			align,
			iconShape,
			iconOrder,
			buttonColor,
			useCaptions,
			addOutline,
		} = attributes;

		const iconSize = iconSizes[attributes.iconSize];

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

		const enabledIcon = {
			facebook: attributes.showFacebookIcon,
			twitter: attributes.showTwitterIcon,
			linkedin: attributes.showLinkedInIcon,
			pinterest: attributes.showPinterestIcon,
			reddit: attributes.showRedditIcon,
			tumblr: attributes.showTumblrIcon,
		};

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
			setState({ hasTransitioned: true });
		}

		return [
			isSelected && (
				<BlockControls>
					<AlignmentToolbar
						value={align}
						onChange={(newAlignment) => setAttributes({ align: newAlignment })}
						controls={["left", "center", "right"]}
					/>
				</BlockControls>
			),
			isSelected && <Inspector {...props} />,
			<div id="ub-social-share-block-editor" className={className}>
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
			</div>,
		];
	}),

	save: () => null,
});
