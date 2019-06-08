const { RichText, InnerBlocks } = wp.editor;

export const version_1_1_2 = props => {
	const { accordions, collapsed, theme, titleColor } = props.attributes;
	const classNamePrefix = 'wp-block-ub-content-toggle';
	return (
		<div>
			{accordions.map((accordion, i) => {
				return (
					<div
						style={{ borderColor: theme }}
						className={`${classNamePrefix}-accordion`}
						key={i}
					>
						<div
							className={`${classNamePrefix}-accordion-title-wrap`}
							style={{ backgroundColor: theme }}
						>
							<RichText.Content
								tagName="span"
								className={`${classNamePrefix}-accordion-title`}
								style={{
									color: titleColor
								}}
								value={accordion.title}
							/>
							<span
								className={
									`${classNamePrefix}-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ` +
									(collapsed ? '' : 'open')
								}
							/>
						</div>
						<div
							style={{
								display: collapsed ? 'none' : 'block'
							}}
							className={`${classNamePrefix}-accordion-content-wrap`}
						>
							<RichText.Content
								tagName="div"
								className={`${classNamePrefix}-accordion-content`}
								value={accordion.content}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const panel_version_1_1_9 = props => {
	const { theme, collapsed, titleColor, panelTitle } = props.attributes;
	const classNamePrefix = 'wp-block-ub-content-toggle';
	return (
		<div
			style={{ borderColor: theme }}
			className={`${classNamePrefix}-accordion`}
		>
			<div
				className={`${classNamePrefix}-accordion-title-wrap`}
				style={{ backgroundColor: theme }}
			>
				<RichText.Content
					tagName="span"
					className={`${classNamePrefix}-accordion-title`}
					style={{ color: titleColor }}
					value={panelTitle}
				/>
				<span
					className={
						`${classNamePrefix}-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ` +
						(collapsed ? '' : 'open')
					}
				/>
			</div>
			<div
				style={{
					display: collapsed ? 'none' : 'block'
				}}
				className={`${classNamePrefix}-accordion-content-wrap`}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};
