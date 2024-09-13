import { isEmpty } from "lodash";
import FeaturedImage from "./image";
import moment from "moment";
import { generateStyles, getSpacingCss } from "../utils/styling-helpers";
// Setup the block
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";

export default function PostGridBlock(props) {
	const {
		attributes: {
			checkPostImage,
			checkPostAuthor,
			checkPostDate,
			checkPostExcerpt,
			checkPostLink,
			checkPostTitle,
			excerptLength,
			readMoreText,
			postLayout,
			columns,
			preservePostImageAspectRatio,
			postTitleTag,
			isEqualHeight,
			padding,
			margin,
			postBorderRadius,
			postBackgroundColor,
			postBackgroundGradient,
			postBackgroundColorHover,
			postBackgroundGradientHover,
			linkBorderRadius,
			linkBackgroundColor,
			linkBackgroundGradient,
			linkColorHover,
			linkBackgroundColorHover,
			linkBackgroundGradientHover,
			linkPadding,
			linkColor,
			contentPadding,
			authorColor,
			authorColorHover,
			dateColor,
			dateColorHover,
			excerptColor,
			excerptColorHover,
			postTitleColor,
			postTitleColorHover,
			rowGap,
			columnGap,
		},
		className,
		posts,
	} = props;
	const postPadding = getSpacingCss(postPadding ?? {});
	const sectionPadding = getSpacingCss(padding ?? {});
	const sectionMargin = getSpacingCss(margin ?? {});
	const linkPaddingObj = getSpacingCss(linkPadding ?? {});
	const contentPaddingObj = getSpacingCss(contentPadding ?? {});

	const PostTag = postTitleTag;
	const equalHeightClass = isEqualHeight ? " is-equal-height " : "";
	const isPreservePostImageAspectRatio = preservePostImageAspectRatio
		? " preserve-post-image-aspect-ratio "
		: "";

	const postStyles = {
		"border-top-left-radius": postBorderRadius?.topLeft,
		"border-top-right-radius": postBorderRadius?.topRight,
		"border-bottom-left-radius": postBorderRadius?.bottomLeft,
		"border-bottom-right-radius": postBorderRadius?.bottomRight,
		"--ub-post-grid-post-background": !isEmpty(postBackgroundColor)
			? postBackgroundColor
			: postBackgroundGradient,
		"--ub-post-grid-post-hover-background": !isEmpty(postBackgroundColorHover)
			? postBackgroundColorHover
			: postBackgroundGradientHover,
		"padding-top": postPadding?.top,
		"padding-right": postPadding?.right,
		"padding-bottom": postPadding?.bottom,
		"padding-left": postPadding?.left,
	};

	const sectionStyles = {
		paddingTop: sectionPadding?.top,
		paddingRight: sectionPadding?.right,
		paddingBottom: sectionPadding?.bottom,
		paddingLeft: sectionPadding?.left,
		marginTop: sectionMargin?.top,
		marginRight: sectionMargin?.right,
		marginBottom: sectionMargin?.bottom,
		marginLeft: sectionMargin?.left,
	};
	const linkStyles = {
		"border-top-left-radius": linkBorderRadius?.topLeft,
		"border-top-right-radius": linkBorderRadius?.topRight,
		"border-bottom-left-radius": linkBorderRadius?.bottomLeft,
		"border-bottom-right-radius": linkBorderRadius?.bottomRight,
		"--ub-post-grid-link-color": linkColor,
		"--ub-post-grid-link-background": !isEmpty(linkBackgroundColor)
			? linkBackgroundColor
			: linkBackgroundGradient,
		"--ub-post-grid-link-hover-background": !isEmpty(linkBackgroundColorHover)
			? linkBackgroundColorHover
			: linkBackgroundGradientHover,
		"--ub-post-grid-link-hover-color": linkColorHover,
		"padding-top": linkPaddingObj?.top,
		"padding-right": linkPaddingObj?.right,
		"padding-bottom": linkPaddingObj?.bottom,
		"padding-left": linkPaddingObj?.left,
	};
	const imageStyles = {
		"--ub-post-grid-image-top-left-radius": props.imageBorderRadius?.topLeft,
		"--ub-post-grid-image-top-right-radius": props.imageBorderRadius?.topRight,
		"--ub-post-grid-image-bottom-left-radius":
			props.imageBorderRadius?.bottomLeft,
		"--ub-post-grid-image-bottom-right-radius":
			props.imageBorderRadius?.bottomRight,
	};
	const titleStyles = {
		"--ub-post-grid-title-color": postTitleColor,
		"--ub-post-grid-title-hover-color": postTitleColorHover,
	};
	const authorStyles = {
		"--ub-post-grid-author-color": authorColor,
		"--ub-post-grid-author-hover-color": authorColorHover,
	};
	const dateStyles = {
		"--ub-post-grid-date-color": dateColor,
		"--ub-post-grid-date-hover-color": dateColorHover,
	};
	const excerptStyles = {
		"--ub-post-grid-excerpt-color": excerptColor,
		"--ub-post-grid-excerpt-hover-color": excerptColorHover,
	};
	const contentStyles = {
		"padding-top": contentPaddingObj?.top,
		"padding-right": contentPaddingObj?.right,
		"padding-bottom": contentPaddingObj?.bottom,
		"padding-left": contentPaddingObj?.left,
	};
	const gridStyles = {
		"row-gap": rowGap,
		"column-gap": columnGap,
	};

	return (
		<section
			className={`${className ? `${className} ` : ""}${equalHeightClass}${isPreservePostImageAspectRatio}ub-block-post-grid`}
			style={generateStyles(sectionStyles)}
		>
			<div
				className={`ub-post-grid-items ${
					postLayout === "list" ? "is-list" : `is-grid columns-${columns}`
				}`}
				style={generateStyles(gridStyles)}
			>
				{posts?.map((post, i) => (
					<article
						style={generateStyles(postStyles)}
						key={i}
						id={`post-${post.id}`}
						className={`post-${post.id}${
							post.featured_image_src && checkPostImage
								? " has-post-thumbnail"
								: ""
						}
					`}
					>
						<>
							{checkPostImage && post.featured_media ? (
								<div
									className="ub-block-post-grid-image"
									style={generateStyles(imageStyles)}
								>
									<FeaturedImage
										{...props}
										imgID={post.featured_media}
										imgSizeLandscape={post.featured_image_src}
									/>
								</div>
							) : null}
							<div
								className="ub-block-post-grid-text"
								style={generateStyles(contentStyles)}
							>
								<header className="ub_block-post-grid-header">
									{checkPostTitle && (
										<PostTag className="ub-block-post-grid-title">
											<a
												href={post.link}
												target="_blank"
												rel="bookmark"
												style={generateStyles(titleStyles)}
											>
												{decodeEntities(post.title.rendered.trim()) ||
													__("(Untitled)", "ultimate-blocks")}
											</a>
										</PostTag>
									)}
									{checkPostAuthor && (
										<div
											className="ub-block-post-grid-author"
											style={generateStyles(authorStyles)}
										>
											<a
												className="ub-text-link"
												target="_blank"
												href={post.author_info.author_link}
											>
												{post.author_info.display_name}
											</a>
										</div>
									)}
									{checkPostDate && (
										<time
											dateTime={moment(post.date_gmt).utc().format()}
											className={"ub-block-post-grid-date"}
											style={generateStyles(dateStyles)}
										>
											{moment(post.date_gmt)
												.local()
												.format("MMMM DD, Y", "ultimate-blocks")}
										</time>
									)}
								</header>
								<div
									className="ub-block-post-grid-excerpt"
									style={generateStyles(excerptStyles)}
								>
									{checkPostExcerpt && (
										<div
											className="ub-block-post-grid-excerpt-text"
											dangerouslySetInnerHTML={{
												__html: cateExcerpt(
													post.excerpt.rendered,
													excerptLength,
												),
											}}
										/>
									)}
									{checkPostLink && (
										<p>
											<a
												className="ub-block-post-grid-more-link ub-text-link"
												href={post.link}
												target="_blank"
												rel="bookmark"
												style={generateStyles(linkStyles)}
											>
												{readMoreText}
											</a>
										</p>
									)}
								</div>
							</div>
						</>
					</article>
				))}
			</div>
		</section>
	);
}

// cate excerpt
function cateExcerpt(str, no_words) {
	if (str && str.split(" ").length > no_words) {
		return str.split(" ").splice(0, no_words).join(" ") + "...";
	} else {
		return str.split(" ").splice(0, no_words).join(" ");
	}
}
