import FeaturedImage from "./image";
import moment from "moment";
import { getStyles } from "./get-styles";
// Setup the block
const { __ } = wp.i18n;
const { decodeEntities } = wp.htmlEntities;

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
			postTitleTag,
			isEqualHeight,
		},
		className,
		posts,
	} = props;

	const PostTag = postTitleTag;
	const equalHeightClass = isEqualHeight ? " is-equal-height " : "";

	const styles = getStyles(props.attributes);
	return (
		<section
			className={`${className ? `${className} ` : ""}${equalHeightClass}ub-block-post-grid`}
			style={styles}
		>
			<div
				className={`ub-post-grid-items ${
					postLayout === "list" ? "is-list" : `is-grid columns-${columns}`
				}`}
			>
				{posts?.map((post, i) => (
					<article
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
								<div className="ub-block-post-grid-image">
									<FeaturedImage
										{...props}
										imgID={post.featured_media}
										imgSizeLandscape={post.featured_image_src}
									/>
								</div>
							) : null}
							<div className="ub_block-post-grid-text">
								<header className="ub_block-post-grid-header">
									{checkPostTitle && (
										<PostTag className="ub-block-post-grid-title">
											<a href={post.link} target="_blank" rel="bookmark">
												{decodeEntities(post.title.rendered.trim()) ||
													__("(Untitled)", "ultimate-blocks")}
											</a>
										</PostTag>
									)}
									{checkPostAuthor && (
										<div className="ub-block-post-grid-author">
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
										>
											{moment(post.date_gmt)
												.local()
												.format("MMMM DD, Y", "ultimate-blocks")}
										</time>
									)}
								</header>
								<div className="ub-block-post-grid-excerpt">
									{checkPostExcerpt && (
										<div
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
	return str.split(" ").splice(0, no_words).join(" ");
}
