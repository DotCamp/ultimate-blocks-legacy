// Setup the block
const { __ } = wp.i18n;

const { InspectorControls } = wp.blockEditor || wp.editor;

const {
	PanelBody,
	SelectControl,
	ToggleControl,
	QueryControls,
	TextControl,
	RangeControl,
} = wp.components;
const { Component } = wp.element;
const { addQueryArgs } = wp.url;
const { apiFetch } = wp;

const MAX_POSTS_COLUMNS = 3;

export default class Inspector extends Component {
	constructor() {
		super();
		this.state = { categoriesList: [] };
	}
	componentDidMount() {
		this.stillMounted = true;
		this.fetchRequest = apiFetch({
			path: addQueryArgs("/wp/v2/categories", { per_page: -1 }),
		})
			.then((categoriesList) => {
				if (this.stillMounted) {
					this.setState({ categoriesList });
				}
			})
			.catch(() => {
				if (this.stillMounted) {
					this.setState({ categoriesList: [] });
				}
			});
	}

	componentWillUnmount() {
		this.stillMounted = false;
	}

	render() {
		const { categoriesList } = this.state;

		const {
			attributes: {
				checkPostImage,
				postImageWidth,
				preservePostImageAspectRatio,
				postImageHeight,
				checkPostAuthor,
				checkPostDate,
				checkPostExcerpt,
				checkPostLink,
				excerptLength,
				readMoreText,
				amountPosts,
				postLayout,
				columns,
				categories,
				categoryArray,
				orderBy,
				order,
				postTitleTag,
			},
			setAttributes,
			posts,
		} = this.props;

		// Check for posts
		const hasPosts = Array.isArray(posts) && posts.length;

		// Post type options
		const postTypeOptions = [
			{ value: "grid", label: __("Grid", "ultimate-blocks") },
			{ value: "list", label: __("List", "ultimate-blocks") },
		];

		const categorySuggestions = categoriesList.reduce(
			(accumulator, category) => ({
				...accumulator,
				[category.name]: category,
			}),
			{}
		);

		const queryControlPanel = QueryControls.toString().includes(
			"selectedCategories"
		) ? (
			<QueryControls
				{...{ order, orderBy }}
				numberOfItems={amountPosts}
				categorySuggestions={categorySuggestions}
				selectedCategories={categoryArray}
				onOrderChange={(value) => setAttributes({ order: value })}
				onOrderByChange={(value) => setAttributes({ orderBy: value })}
				onCategoryChange={(tokens) => {
					const suggestions = categoriesList.reduce(
						(accumulator, category) => ({
							...accumulator,
							[category.name]: category,
						}),
						{}
					);
					const allCategories = tokens.map((token) =>
						typeof token === "string" ? suggestions[token] : token
					);
					setAttributes({ categoryArray: allCategories });
				}}
				onNumberOfItemsChange={(value) => setAttributes({ amountPosts: value })}
			/>
		) : (
			<QueryControls
				{...{ order, orderBy }}
				numberOfItems={amountPosts}
				categoriesList={categoriesList}
				categorySuggestions={categoriesList}
				selectedCategories={categories}
				onOrderChange={(value) => setAttributes({ order: value })}
				onOrderByChange={(value) => setAttributes({ orderBy: value })}
				onCategoryChange={(value) =>
					setAttributes({ categories: "" !== value ? value : undefined })
				}
				onNumberOfItemsChange={(value) => setAttributes({ amountPosts: value })}
			/>
		);

		return (
			<InspectorControls>
				<PanelBody title={__("Post Grid Settings", "ultimate-blocks")}>
					<SelectControl
						label={__("Grid Type", "ultimate-blocks")}
						options={postTypeOptions}
						value={postLayout}
						onChange={(postLayout) => setAttributes({ postLayout })}
					/>
					{"grid" === postLayout && (
						<RangeControl
							label={__("Columns", "ultimate-blocks")}
							value={columns}
							onChange={(columns) => setAttributes({ columns })}
							min={1}
							max={
								!hasPosts
									? MAX_POSTS_COLUMNS
									: Math.min(MAX_POSTS_COLUMNS, posts.length)
							}
						/>
					)}
					{queryControlPanel}
				</PanelBody>
				<PanelBody title={__("Post Grid Content", "ultimate-blocks")}>
					<ToggleControl
						label={__("Display Featured Image", "ultimate-blocks")}
						checked={checkPostImage}
						onChange={(checkPostImage) => setAttributes({ checkPostImage })}
					/>
					{checkPostImage && (
						<>
							<TextControl
								label={__("Post Image Width", "ultimate-blocks")}
								type="number"
								min={1}
								value={postImageWidth}
								onChange={(val) =>
									setAttributes({ postImageWidth: Number(val) })
								}
							/>
							<ToggleControl
								label={__("Preserve Aspect Ratio", "ultimate-blocks")}
								checked={preservePostImageAspectRatio}
								onChange={(preservePostImageAspectRatio) =>
									setAttributes({ preservePostImageAspectRatio })
								}
							/>
							{!preservePostImageAspectRatio && (
								<TextControl
									label={__("Post Image Height", "ultimate-blocks")}
									type="number"
									min={1}
									value={postImageHeight}
									onChange={(val) =>
										setAttributes({ postImageHeight: Number(val) })
									}
								/>
							)}
						</>
					)}
					<ToggleControl
						label={__("Display Author", "ultimate-blocks")}
						checked={checkPostAuthor}
						onChange={(checkPostAuthor) => setAttributes({ checkPostAuthor })}
					/>
					<ToggleControl
						label={__("Display Date", "ultimate-blocks")}
						checked={checkPostDate}
						onChange={(checkPostDate) => setAttributes({ checkPostDate })}
					/>
					<ToggleControl
						label={__("Display Excerpt", "ultimate-blocks")}
						checked={checkPostExcerpt}
						onChange={(checkPostExcerpt) => setAttributes({ checkPostExcerpt })}
					/>
					{checkPostExcerpt && (
						<RangeControl
							label={__("Excerpt Length", "ultimate-blocks")}
							value={excerptLength}
							onChange={(value) => setAttributes({ excerptLength: value })}
							min={0}
							max={200}
						/>
					)}
					<ToggleControl
						label={__("Display Continue Reading Link", "ultimate-blocks")}
						checked={checkPostLink}
						onChange={(checkPostLink) => setAttributes({ checkPostLink })}
					/>
					{checkPostLink && (
						<TextControl
							label={__("Customize Continue Reading Text", "ultimate-blocks")}
							type="text"
							value={readMoreText}
							onChange={(value) => setAttributes({ readMoreText: value })}
						/>
					)}
					<SelectControl
						label={__("Title tag", "ultimate-blocks")}
						options={["h2", "h3", "h4"].map((a) => ({
							value: a,
							label: __(a),
						}))}
						value={postTitleTag}
						onChange={(postTitleTag) => setAttributes({ postTitleTag })}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
