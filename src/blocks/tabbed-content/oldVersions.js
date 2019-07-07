const { RichText } = wp.editor;

export const version_1_1_2 = props => {
	const className = 'wp-block-ub-tabbed-content';

	const {
		activeTab,
		theme,
		titleColor,
		tabsTitle,
		tabsContent,
		id
	} = props.attributes;

	return (
		<div data-id={id}>
			<div className={className + '-holder'}>
				<div className={className + '-tabs-title'}>
					{tabsTitle.map((value, i) => {
						return (
							<div
								className={
									className +
									'-tab-title-wrap' +
									(activeTab === i ? ' active' : '')
								}
								style={{
									backgroundColor:
										activeTab === i ? theme : 'initial',
									borderColor:
										activeTab === i ? theme : 'lightgrey',
									color:
										activeTab === i ? titleColor : '#000000'
								}}
								key={i}
							>
								<RichText.Content
									tagName="div"
									className={className + '-tab-title'}
									value={value.content}
								/>
							</div>
						);
					})}
				</div>
				<div className={className + '-tabs-content'}>
					{tabsContent.map((value, i) => {
						return (
							<div
								className={
									className +
									'-tab-content-wrap' +
									(activeTab === i ? ' active' : ' ub-hide')
								}
								key={i}
							>
								<RichText.Content
									tagName="div"
									className={className + '-tab-content'}
									value={value.content}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
