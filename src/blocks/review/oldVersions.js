const { RichText } = wp.editor;
import { OldStars } from "./components";

const oldAttributes = {
	ID: {
		type: "string",
		default: "",
	},
	authorName: {
		type: "string",
		default: "",
	},
	itemName: {
		type: "string",
	},
	items: {
		type: "string",
		default: '[{"label": "", "value": 0}]',
	},
	starCount: {
		type: "number",
		default: 5,
	},
	summaryTitle: {
		type: "string",
		default: "Summary",
	},
	summaryDescription: {
		type: "string",
	},
	callToActionText: {
		type: "string",
	},
	callToActionURL: {
		type: "string",
		default: "",
	},
	callToActionBackColor: {
		type: "string",
		default: "#f63d3d",
	},
	callToActionForeColor: {
		type: "string",
		default: "#ffffff",
	},
	inactiveStarColor: {
		type: "string",
		default: "#888888",
	},
	activeStarColor: {
		type: "string",
		default: "#eeee00",
	},
	selectedStarColor: {
		type: "string",
		default: "#ffff00",
	},
	titleAlign: {
		type: "string",
		default: "left",
	},
	authorAlign: {
		type: "string",
		default: "left",
	},
};

const calculateAverage = (JSONItems) =>
	Math.round(
		(JSON.parse(JSONItems)
			.map((i) => i.value)
			.reduce((total, v) => total + v) /
			JSON.parse(JSONItems).length) *
			10
	) / 10;

const oldJSONLD = (props) => (
	<script
		type="application/ld+json"
		dangerouslySetInnerHTML={{
			__html: JSON.stringify({
				"@context": "https://schema.org/",
				"@type": "Review",
				reviewBody: props.summaryDescription,
				itemReviewed: {
					"@type": "Product",
					name: props.itemName,
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: props.average,
					bestRating: 5,
				},
				author: {
					"@type": "Person",
					name: props.authorName,
				},
			}),
		}}
	/>
);

export const version_1_1_2 = (props) => {
	const {
		ID,
		authorName,
		itemName,
		items,
		starCount,
		summaryTitle,
		summaryDescription,
		callToActionText,
		callToActionURL,
		callToActionBackColor,
		callToActionForeColor,
		inactiveStarColor,
		activeStarColor,
	} = props.attributes;

	const average = calculateAverage(items);

	return (
		<div className="ub_review_block">
			<RichText.Content
				className="ub_review_item_name"
				tagName="p"
				value={itemName}
			/>
			<RichText.Content tagName="p" value={authorName} />
			{JSON.parse(items).map((j, i) => (
				<div className="ub_review_entry">
					<RichText.Content key={i} value={j.label} />
					<OldStars
						style={{ marginLeft: "auto" }}
						id={`${ID}-${i}`}
						key={i}
						value={j.value}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			))}
			<div className="ub_review_summary">
				<RichText.Content
					className="ub_review_summary_title"
					tagName="p"
					value={summaryTitle}
				/>
				<div className="ub_review_overall_value">
					<RichText.Content tagName="p" value={summaryDescription} />
					<span className="ub_review_rating">{average}</span>
				</div>
				<div className="ub_review_cta_panel">
					<div className="ub_review_cta_main">
						<a
							style={{ color: callToActionForeColor }}
							href={callToActionURL ? callToActionURL : "#"}
							target="_blank"
							rel="nofollow"
						>
							<button
								className="ub_review_cta_btn"
								style={{
									backgroundColor: callToActionBackColor,
									border: `1px solid ${callToActionForeColor}`,
								}}
							>
								<RichText.Content
									style={{ color: callToActionForeColor }}
									value={callToActionText ? callToActionText : "Click here"}
								/>
							</button>
						</a>
					</div>
					<OldStars
						id={`${ID}-average`}
						className="ub_review_average_stars"
						value={average}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			</div>
			{oldJSONLD(props.attributes)}
		</div>
	);
};

export const version_1_1_4 = (props) => {
	const {
		ID,
		authorName,
		itemName,
		items,
		starCount,
		summaryTitle,
		summaryDescription,
		callToActionText,
		callToActionURL,
		callToActionBackColor,
		callToActionForeColor,
		inactiveStarColor,
		activeStarColor,
	} = props.attributes;

	const average = calculateAverage(items);

	return (
		<div className="ub_review_block">
			<RichText.Content
				tagName="p"
				className="ub_review_item_name"
				value={itemName}
			/>
			<RichText.Content tagName="p" value={authorName} />
			{JSON.parse(items).map((j, i) => (
				<div className="ub_review_entry">
					<RichText.Content key={i} value={j.label} />
					<OldStars
						style={{ marginLeft: "auto" }}
						id={`${ID}-${i}`}
						key={i}
						value={j.value}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			))}
			<div className="ub_review_summary">
				<RichText.Content
					className="ub_review_summary_title"
					tagName="p"
					value={summaryTitle}
				/>
				<div className="ub_review_overall_value">
					<RichText.Content tagName="p" value={summaryDescription} />
					<span className="ub_review_rating">{average}</span>
				</div>
				<div className="ub_review_cta_panel">
					<div className="ub_review_cta_main">
						<a
							style={{ color: callToActionForeColor }}
							href={callToActionURL ? callToActionURL : "#"}
							target="_blank"
							rel="nofollow noopener noreferrer"
						>
							<button
								className="ub_review_cta_btn"
								style={{
									backgroundColor: callToActionBackColor,
									border: `1px solid ${callToActionForeColor}`,
								}}
							>
								<RichText.Content
									style={{ color: callToActionForeColor }}
									value={callToActionText ? callToActionText : "Click here"}
								/>
							</button>
						</a>
					</div>
					<OldStars
						id={`${ID}-average`}
						className="ub_review_average_stars"
						value={average}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			</div>
			{oldJSONLD(props.attributes)}
		</div>
	);
};

export const version_1_1_5 = (props) => {
	const {
		ID,
		authorName,
		itemName,
		items,
		starCount,
		summaryTitle,
		summaryDescription,
		callToActionText,
		callToActionURL,
		callToActionBackColor,
		callToActionForeColor,
		inactiveStarColor,
		activeStarColor,
		titleAlign,
		authorAlign,
	} = props.attributes;

	const average = calculateAverage(items);

	return (
		<div className="ub_review_block">
			<RichText.Content
				tagName="p"
				className="ub_review_item_name"
				style={{ textAlign: titleAlign }}
				value={itemName}
			/>
			<RichText.Content
				tagName="p"
				style={{ textAlign: authorAlign }}
				value={authorName}
			/>
			{JSON.parse(items).map((j, i) => (
				<div className="ub_review_entry">
					<RichText.Content key={i} value={j.label} />
					<OldStars
						style={{ marginLeft: "auto" }}
						id={`${ID}-${i}`}
						key={i}
						value={j.value}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			))}
			<div className="ub_review_summary">
				<RichText.Content
					className="ub_review_summary_title"
					tagName="p"
					value={summaryTitle}
				/>
				<div className="ub_review_overall_value">
					<RichText.Content tagName="p" value={summaryDescription} />
					<span className="ub_review_rating">{average}</span>
				</div>
				<div className="ub_review_cta_panel">
					<div className="ub_review_cta_main">
						<a
							style={{ color: callToActionForeColor }}
							href={callToActionURL ? callToActionURL : "#"}
							target="_blank"
							rel="nofollow noopener noreferrer"
						>
							<button
								className="ub_review_cta_btn"
								style={{
									backgroundColor: callToActionBackColor,
									border: `1px solid ${callToActionForeColor}`,
								}}
							>
								<RichText.Content
									style={{ color: callToActionForeColor }}
									value={callToActionText ? callToActionText : "Click here"}
								/>
							</button>
						</a>
					</div>
					<OldStars
						id={`${ID}-average`}
						className="ub_review_average_stars"
						value={average}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			</div>
			{oldJSONLD(props.attributes)}
		</div>
	);
};

export const updateFrom = (oldVersion) => ({
	attributes: oldAttributes,
	migrate: (attributes) => {
		const { ID, items, ...otherAttributes } = attributes;
		return Object.assign(Object.assign({}, otherAttributes), {
			blockID: ID,
			parts: JSON.parse(items),
		});
	},
	save: oldVersion,
});
