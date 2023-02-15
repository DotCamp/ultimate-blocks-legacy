import PropTypes from "prop-types";

import { useEffect, useState, useRef } from "react";

const { __ } = wp.i18n;

const { InspectorControls } = wp.blockEditor || wp.editor;

const {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	RangeControl,
} = wp.components;
const { addQueryArgs } = wp.url;
const { apiFetch } = wp;

const MAX_POSTS_COLUMNS = 3;

function Autocomplete(props) {
	const [userInput, setUserInput] = useState("");
	const [showSuggestions, setSuggestionDisplay] = useState(false);
	const listItem = useRef(null);

	const filteredList = props.list.filter(
		(i) => i.label.toLowerCase().indexOf(userInput.toLowerCase()) > -1
	);
	useEffect(() => {
		listItem.current = Array(props.list.length);
	}, [props.list]);

	return (
		<div>
			<input
				type="text"
				value={userInput}
				style={{ width: "200px" }}
				onChange={(e) => {
					setUserInput(e.target.value);
					setSuggestionDisplay(e.target.value.length > 0);
				}}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown" && filteredList.length) {
						if (showSuggestions) {
							listItem.current[0].focus();
							e.preventDefault();
						} else {
							setSuggestionDisplay(true);
						}
					}
				}}
			/>
			{showSuggestions && (
				<div className={props.className} style={{ width: "200px" }}>
					{filteredList.map((item, i) => (
						<div
							className={"ub-autocomplete-list-item"}
							ref={(elem) => {
								listItem.current[i] = elem;
							}}
							onClick={() => {
								props.addToSelection(item);
								setUserInput("");
								setSuggestionDisplay(false);
							}}
							onKeyDown={(e) => {
								if (e.key === "ArrowDown") {
									if (i < filteredList.length - 1) {
										e.preventDefault();
										listItem.current[i + 1].focus();
									} else {
										listItem.current[i].blur();
										setSuggestionDisplay(false);
									}
								}
								if (e.key === "ArrowUp") {
									if (i > 0) {
										e.preventDefault();
										listItem.current[i - 1].focus();
									} else {
										listItem.current[i].blur();
										setSuggestionDisplay(false);
									}
								}
							}}
							tabIndex={0}
						>
							{item.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

Autocomplete.propTypes = {
	list: PropTypes.array,
	selection: PropTypes.array,
};

Autocomplete.defaultProps = {
	list: [],
	selection: PropTypes.array,
};

export default function Inspector(props) {
	const [categoriesList, setCategoriesList] = useState([]);
	const [tagsList, setTagsList] = useState([]);
	const [authorsList, setAuthorsList] = useState([]);
	const [stillMounted, setStillMounted] = useState(false);
	const [orderDropdownVal, setOrderDropdownval] = useState(0);

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
			categories, //old stringified list
			excludedCategories,
			categoryArray,
			orderBy,
			order,
			checkPostTitle,
			postTitleTag,
			authorArray,
			tagArray,
		},
		setAttributes,
		posts,
	} = props;

	useEffect(() => {
		setStillMounted(true);

		return () => setStillMounted(false);
	}, []);

	useEffect(() => {
		if (stillMounted) {
			apiFetch({ path: addQueryArgs("/wp/v2/categories", { per_page: -1 }) })
				.then((categoriesList) => {
					setCategoriesList(categoriesList);
				})
				.catch(() => {
					if (stillMounted) {
						setCategoriesList([]);
					}
				});

			apiFetch({ path: addQueryArgs("/wp/v2/tags", { per_page: -1 }) })
				.then((tagsList) => {
					setTagsList(tagsList);
				})
				.catch(() => {
					if (stillMounted) {
						setTagsList([]);
					}
				});

			apiFetch({
				path: addQueryArgs("/wp/v2/users", { per_page: -1, who: "authors" }),
			})
				.then((authorsList) => {
					setAuthorsList(authorsList);
				})
				.catch(() => {
					if (stillMounted) {
						setAuthorsList([]);
					}
				});
		}
	}, [stillMounted]);

	useEffect(() => {
		//initialize orderDropdownVal
		if (orderBy === "title") {
			setOrderDropdownval(order === "asc" ? 2 : 3);
		}
		if (orderBy === "date") {
			setOrderDropdownval(order === "desc" ? 0 : 1);
		}
	}, []);

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

	return (
		<InspectorControls>
			<PanelBody title={__("General", "ultimate-blocks")}>
				{Array.isArray(posts) && posts.length > 0 && (
					<>
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
					</>
				)}
			</PanelBody>
			<PanelBody title={__("Query", "ultimate-blocks")} initialOpen={false}>
				<p>{__("Authors")}</p>
				{authorArray && (
					<div className="ub-autocomplete-container">
						{authorsList
							.filter((t) => authorArray.includes(t.id))
							.map((t) => (
								<span className="ub-autocomplete-selection">
									{t.name}
									<span
										className="dashicons dashicons-dismiss"
										onClick={() =>
											setAttributes({
												authorArray: authorArray.filter((sel) => sel !== t.id),
											})
										}
									/>
								</span>
							))}
					</div>
				)}
				<Autocomplete
					className="ub-autocomplete-list"
					list={authorsList
						.filter((t) => !authorArray.includes(t.id))
						.map((t) => ({ label: t.name, value: t.id }))}
					selection={authorArray}
					addToSelection={(item) => {
						if (!authorArray.includes(item.value)) {
							setAttributes({ authorArray: [...authorArray, item.value] });
						}
					}}
				/>
				<label className="components-truncate components-text components-input-control__label">
					{__("Tags")}
				</label>
				{tagArray && (
					<div className="ub-autocomplete-container">
						{tagsList
							.filter((t) => tagArray.includes(t.id))
							.map((t) => (
								<span className="ub-autocomplete-selection">
									{t.name}
									<span
										className="dashicons dashicons-dismiss"
										onClick={() => {
											setAttributes({
												tagArray: tagArray.filter((sel) => sel !== t.id),
											});
										}}
									/>
								</span>
							))}
					</div>
				)}
				<Autocomplete
					className="ub-autocomplete-list"
					list={tagsList
						.filter((t) => !tagArray.includes(t.id))
						.map((t) => ({ label: t.name, value: t.id }))}
					selection={tagArray}
					addToSelection={(item) => {
						if (!tagArray.includes(item.value)) {
							setAttributes({ tagArray: [...tagArray, item.value] });
						}
					}}
				/>
				<SelectControl
					label={__("Order By", "ultimate-blocks")}
					options={[
						__("Newest to oldest"),
						__("Oldest to newest"),
						__("A → Z"),
						__("Z → A"),
					].map((a, i) => ({ value: i, label: a }))}
					value={orderDropdownVal}
					onChange={(newDropVal) => {
						setOrderDropdownval(newDropVal);
						setAttributes({
							order: newDropVal % 3 === 0 ? "desc" : "asc",
							orderBy: newDropVal > 1 ? "title" : "date",
						});
					}}
				/>

				<label className="components-truncate components-text components-input-control__label">
					{__("Included Categories")}
				</label>
				{categoryArray && (
					<div className="ub-autocomplete-container">
						{categoriesList
							.filter((c) => categoryArray.map((ca) => ca.id).includes(c.id))
							.map((c) => (
								<span className="ub-autocomplete-selection">
									{c.name}
									<span
										className="dashicons dashicons-dismiss"
										onClick={() =>
											setAttributes({
												categoryArray: categoryArray.filter(
													(sel) => sel.id !== c.id
												),
											})
										}
									/>
								</span>
							))}
					</div>
				)}
				<Autocomplete
					className="ub-autocomplete-list"
					list={categoriesList
						.filter(
							(cur) => !excludedCategories.some((other) => cur.id === other.id)
						)
						.filter(
							(cur) => !categoryArray.some((other) => cur.id === other.id)
						)
						.map((c) => ({ label: c.name, value: c.id }))}
					selection={categoryArray}
					addToSelection={(item) => {
						//use full object for full compatibility with querycontrols
						if (!categoryArray.includes(item.value)) {
							setAttributes({
								categoryArray: [
									...categoryArray,
									...categoriesList.filter((cat) => cat.id === item.value),
								],
							});
						}
					}}
				/>

				<label className="components-truncate components-text components-input-control__label">
					{__("Excluded Categories")}
				</label>
				{excludedCategories && (
					<div className="ub-autocomplete-container">
						{categoriesList
							.filter((c) =>
								excludedCategories.map((ca) => ca.id).includes(c.id)
							)
							.map((c) => (
								<span className="ub-autocomplete-selection">
									{c.name}
									<span
										className="dashicons dashicons-dismiss"
										onClick={() => {
											setAttributes({
												excludedCategories: excludedCategories.filter(
													(sel) => sel.id !== c.id
												),
											});
										}}
									/>
								</span>
							))}
					</div>
				)}
				<Autocomplete
					className="ub-autocomplete-list"
					list={categoriesList
						.filter(
							(cur) => !excludedCategories.some((other) => cur.id === other.id)
						)
						.filter(
							(cur) => !categoryArray.some((other) => cur.id === other.id)
						)
						.map((c) => ({ label: c.name, value: c.id }))}
					selection={excludedCategories}
					addToSelection={(item) => {
						if (!excludedCategories.includes(item.value)) {
							setAttributes({
								excludedCategories: [
									...excludedCategories,
									...categoriesList.filter((cat) => cat.id === item.value),
								],
							});
						}
					}}
				/>
				<RangeControl
					label={__("Number of items")}
					value={amountPosts}
					onChange={(amountPosts) => setAttributes({ amountPosts })}
					min={1}
					max={100}
				/>
			</PanelBody>
			{Array.isArray(posts) && posts.length > 0 && (
				<PanelBody title={__("Display", "ultimate-blocks")} initialOpen={false}>
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
					<ToggleControl
						label={__("Display Title", "ultimate-blocks")}
						checked={checkPostTitle}
						onChange={(checkPostTitle) => setAttributes({ checkPostTitle })}
					/>
					{checkPostTitle && (
						<SelectControl
							label={__("Title tag", "ultimate-blocks")}
							options={["h2", "h3", "h4"].map((a) => ({
								value: a,
								label: __(a),
							}))}
							value={postTitleTag}
							onChange={(postTitleTag) => setAttributes({ postTitleTag })}
						/>
					)}
				</PanelBody>
			)}
		</InspectorControls>
	);
}
