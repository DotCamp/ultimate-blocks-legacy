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

const SortableItem = SortableElement(({ icon, iconSize, iconShape, color }) => {
	const iconDetails = {
		facebook: {
			bgColor: color || "#365899",
			main: <FacebookIcon width={iconSize} height={iconSize} />,
		},
		linkedin: {
			bgColor: color || "#0073b1",
			main: <LinkedInIcon width={iconSize} height={iconSize} />,
		},
		pinterest: {
			bgColor: color || "#bd081c",
			main: <PinterestIcon width={iconSize} height={iconSize} />,
		},
		twitter: {
			bgColor: color || "#1da1f2",
			main: <TwitterIcon width={iconSize} height={iconSize} />,
		},
		tumblr: {
			bgColor: color || "#36465d",
			main: <TumblrIcon width={iconSize} height={iconSize} />,
		},
		reddit: {
			bgColor: color || "#cee3f8",
			main: <RedditIcon width={iconSize} height={iconSize} />,
		},
	};

	return (
		<div
			href="#ub-social-share-block-editor"
			className={"ub-social-share-icon social-share-icon " + iconShape}
			style={{
				width: iconSize * 1.5,
				height: iconSize * 1.5,
				backgroundColor: iconDetails[icon].bgColor,
				borderRadius: iconShape === "circle" ? "50%" : "0",
			}}
		>
			{iconDetails[icon].main}
		</div>
	);
});

const SortableList = SortableContainer(
	({ items, iconShape, iconSize, align, color }) => (
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
		showTwitterIcon: {
			type: "boolean",
			default: true,
		},
		showLinkedInIcon: {
			type: "boolean",
			default: true,
		},
		showPinterestIcon: {
			type: "boolean",
			default: true,
		},
		showRedditIcon: {
			type: "boolean",
			default: true,
		},
		showTumblrIcon: {
			type: "boolean",
			default: true,
		},
		iconSize: {
			type: "string",
			default: "normal",
		},
		iconShape: {
			type: "string",
			default: "circle",
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

		const { blockID, align, iconShape, iconOrder, buttonColor } = attributes;

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
				/>
			</div>,
		];
	}),

	save: () => null,
});
