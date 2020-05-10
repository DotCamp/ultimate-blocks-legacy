// Import icon.
import icons from "./icons";
import pickBy from "lodash/pickBy";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

import attributes from "./attributes";
import PostGridBlock from "./editor";
import Inspector from "./inspector";

const { Fragment } = wp.element;
const { withSelect } = wp.data;
const { BlockControls, BlockAlignmentToolbar } = wp.blockEditor || wp.editor;
const { Placeholder, Spinner, Toolbar } = wp.components;

export default registerBlockType("ub/post-grid", {
	title: __("Post Grid", "ultimate-blocks"),
	description: __(
		"Add a grid or list of customizable posts.",
		"ultimate-blocks"
	),
	icon: icons,
	category: "ultimateblocks",
	keywords: [
		__("post grid", "ultimate-blocks"),
		__("posts", "ultimate-blocks"),
		__("Ultimate Blocks", "ultimate-blocks"),
	],
	attributes,
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */

	getEditWrapperProps({ wrapAlignment }) {
		if (["full", "wide", "center"].includes(wrapAlignment)) {
			return { "data-align": wrapAlignment };
		}
	},

	edit: withSelect((select, props) => {
		const {
			order,
			categories,
			orderBy,
			amountPosts,
			offset,
			postType,
		} = props.attributes;

		const { getEntityRecords } = select("core");
		const { getCurrentPostId } =
			select("core/block--editor") || select("core/editor"); //double dashes are needed

		const getPosts = pickBy(
			{
				categories,
				order,
				orderby: orderBy,
				per_page: amountPosts,
				offset: offset,
				exclude: [getCurrentPostId()],
			},
			(value) => typeof value !== "undefined"
		);

		return {
			posts: getEntityRecords("postType", postType, getPosts),
		};
	})((props) => {
		const { attributes, setAttributes, posts } = props;
		const { postLayout, wrapAlignment } = attributes;

		const emptyPosts = Array.isArray(posts) && posts.length;

		if (!emptyPosts) {
			return (
				<Fragment>
					<Placeholder
						icon="admin-post"
						label={__("Ultimate Blocks Post Grid", "ultimate-blocks")}
					>
						{!Array.isArray(posts) ? (
							<Spinner />
						) : (
							__("No posts found.", "ultimate-blocks")
						)}
					</Placeholder>
				</Fragment>
			);
		}

		const toolBarButton = [
			{
				icon: "grid-view",
				title: __("Grid View", "ultimate-blocks"),
				onClick: () => setAttributes({ postLayout: "grid" }),
				isActive: "grid" === postLayout,
			},
			{
				icon: "list-view",
				title: __("List View", "ultimate-blocks"),
				onClick: () => setAttributes({ postLayout: "list" }),
				isActive: "list" === postLayout,
			},
		];

		return (
			<Fragment>
				<Inspector {...{ ...props }} />
				<BlockControls>
					<BlockAlignmentToolbar
						value={wrapAlignment}
						controls={["center", "wide", "full"]}
						onChange={(value) => setAttributes({ wrapAlignment: value })}
					/>
					<Toolbar controls={toolBarButton} />
				</BlockControls>
				<PostGridBlock {...{ ...props }} />
			</Fragment>
		);
	}),
	save: () => null,
});
