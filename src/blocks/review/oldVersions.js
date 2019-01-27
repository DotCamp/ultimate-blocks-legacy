const { RichText } = wp.editor;
const { Stars } = './components';

const version_1_1_2 = props => {
	const {
		ID,
		reviewTitle,
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
		activeStarColor
	} = props.attributes;

	const average =
		JSON.parse(items)
			.map(i => i.value)
			.reduce((total, v) => total + v) / JSON.parse(items).length;

	return (
		<div className="ub_review_block">
			<p className="ub_review_item_name">
				<RichText.Content value={itemName} />
			</p>
			<p>
				<RichText.Content value={authorName} />
			</p>
			{JSON.parse(items).map((j, i) => (
				<div className="ub_review_entry">
					<RichText.Content key={i} value={j.label} />
					<Stars
						style={{ justifySelf: 'self-end' }}
						id={`${ID}-${i}`}
						key={i}
						value={j.value}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			))}
			<div clasName="ub_review_summary">
				<RichText.Content
					className="ub_review_summary_title"
					tagName="p"
					value={summaryTitle}
				/>
				<div className="ub_review_overall_value">
					<p>
						<RichText.Content value={summaryDescription} />
					</p>
					<span className="ub_review_rating">
						{Math.round(average * 100) / 100}
					</span>
				</div>
				<div className="ub_review_cta_panel">
					<div className="ub_review_cta_main">
						<button
							className="ub_review_cta_btn"
							style={{
								backgroundColor: callToActionBackColor,
								border: `1px solid ${callToActionForeColor}`
							}}
						>
							<a
								style={{ color: callToActionForeColor }}
								href={callToActionURL ? callToActionURL : '#'}
							>
								<RichText.Content
									style={{ color: callToActionForeColor }}
									value={
										callToActionText
											? callToActionText
											: 'Click here'
									}
								/>
							</a>
						</button>
					</div>
					<Stars
						id={`${ID}-average`}
						className="ub_review_average_stars"
						onHover={() => null}
						setValue={() => null}
						value={average}
						limit={starCount}
						inactiveStarColor={inactiveStarColor}
						activeStarColor={activeStarColor}
					/>
				</div>
			</div>
		</div>
	);
};

export { version_1_1_2 };
