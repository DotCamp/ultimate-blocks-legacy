import TableOfContents from './components';

const version_1_1_2 = props => {
	const { links, title } = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
				</div>
			)}
			<TableOfContents headers={links && JSON.parse(links)} />
		</div>
	);
};

export { version_1_1_2 };
