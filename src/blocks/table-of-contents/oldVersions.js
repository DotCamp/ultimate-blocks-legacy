import { Component } from 'react';
import TableOfContents from './components';

const { select, subscribe } = wp.data;
const { __ } = wp.i18n;

export const oldAttributes = {
	title: {
		type: 'array',
		source: 'children',
		selector: '.ub_table-of-contents-title'
	},
	allowedHeaders: {
		type: 'array',
		default: Array(6).fill(true)
	},
	links: {
		type: 'string',
		default: ''
	},
	allowToCHiding: {
		type: 'boolean',
		default: false
	},
	showList: {
		type: 'boolean',
		default: true
	},
	numColumns: {
		type: 'number',
		default: 1
	},
	listStyle: {
		type: 'string',
		default: 'bulleted' //other options: numbered, plain
	}
};

export const updateFrom = oldVersion => ({
	attributes: oldAttributes,
	save: oldVersion
});

const getHeaderBlocks = () =>
	select('core/editor')
		.getBlocks()
		.filter(block => block.name === 'core/heading');

const makeNestedArray = (item, array) => {
	let last = array.length - 1;
	if (array.length === 0 || array[last][0].level < item.level) {
		array.push([item]);
	} else if (array[last][0].level === item.level) {
		array[last].push(item);
	} else {
		while (array[last][0].level > item.level) {
			if (array.length > 1) {
				array[array.length - 2].push(array.pop());
				last = array.length - 1;
			} else break;
		}
		if (array[last][0].level === item.level) {
			array[last].push(item);
		}
	}
};

const combineSubarrays = array => {
	while (
		array.length > 1 &&
		array[array.length - 1][0].level > array[array.length - 2][0].level
	) {
		array[array.length - 2].push(array.pop());
	}
	return array[0];
};

const makeHeaderArray_1_0_8 = origHeaders => {
	let arrays = [];
	origHeaders.forEach(header => makeNestedArray(header, arrays));
	return combineSubarrays(arrays);
};

class TableOfContents_1_0_8 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null,
			showList: true
		};
	}

	componentDidMount() {
		const setHeaders = () => {
			const headers = getHeaderBlocks().map(header => header.attributes);

			headers.forEach((heading, key) => {
				const headingAnchorEmpty =
					typeof heading.anchor === 'undefined' ||
					heading.anchor === '';
				const headingContentEmpty =
					typeof heading.content === 'undefined' ||
					heading.content === '';
				const headingDefaultAnchor =
					!headingAnchorEmpty &&
					heading.anchor.indexOf(key + '-') === 0;
				if (
					!headingContentEmpty &&
					(headingAnchorEmpty || headingDefaultAnchor)
				) {
					heading.anchor =
						key +
						'-' +
						heading.content
							.toString()
							.toLowerCase()
							.replace(' ', '-');
					heading.anchor.replace(/[^\w\s-]/g, '');
				}
			});

			this.setState({ headers: makeHeaderArray_1_0_8(headers) });
		};

		setHeaders();

		const unsubscribe = subscribe(() => {
			setHeaders();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		const parseList_1_0_8 = list => {
			let items = [];
			list.forEach(item => {
				items.push(
					Array.isArray(item) ? (
						parseList_1_0_8(item)
					) : (
						<li>
							<a href={`#${item.anchor}`}>{item.content}</a>
						</li>
					)
				);
			});
			return <ul>{items}</ul>;
		};

		if (this.state.headers) {
			return (
				<div
					className="ub_table-of-contents-container"
					style={{
						display: this.props.isHidden ? 'none' : 'initial'
					}}
				>
					{parseList_1_0_8(this.state.headers)}
				</div>
			);
		} else {
			return (
				<p className="ub_table-of-contents-placeholder">
					Add a header to begin generating the table of contents
				</p>
			);
		}
	}
}

export const version_1_0_8 = props => {
	const { showList, links, title } = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
					<div className="ub_table-of-contents-header-toggle">
						<div className="ub_table-of-contents-toggle">
							[
							<a
								className="ub_table-of-contents-toggle-link"
								href="#"
							>
								{showList ? __('hide') : __('show')}
							</a>
							]
						</div>
					</div>
				</div>
			)}
			<TableOfContents_1_0_8
				isHidden={!showList && title}
				headers={links && JSON.parse(links)}
			/>
		</div>
	);
};

const ToCPlaceholder = (
	<p className="ub_table-of-contents-placeholder">
		{__('Add a header to begin generating the table of contents')}
	</p>
);

class TableOfContents_1_0_9 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		const setHeaders = () => {
			const headers = getHeaderBlocks().map(header => header.attributes);
			headers.forEach((heading, key) => {
				const headingAnchorEmpty =
					typeof heading.anchor === 'undefined' ||
					heading.anchor === '';
				const headingContentEmpty =
					typeof heading.content === 'undefined' ||
					heading.content === '';
				const headingDefaultAnchor =
					!headingAnchorEmpty &&
					heading.anchor.indexOf(key + '-') === 0;
				if (
					!headingContentEmpty &&
					(headingAnchorEmpty || headingDefaultAnchor)
				) {
					heading.anchor =
						key +
						'-' +
						heading.content
							.toString()
							.toLowerCase()
							.replace(/( |<br>)/g, '-');
					heading.anchor = heading.anchor.replace(/[^\w\s-]/g, '');
				}
			});

			this.setState({ headers: makeHeaderArray_1_0_8(headers) });
		};

		setHeaders();

		const unsubscribe = subscribe(() => {
			setHeaders();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		const parseList_1_0_9 = list => {
			let items = [];
			list.forEach(item => {
				if (Array.isArray(item)) {
					items.push(parseList_1_0_9(item));
				} else {
					let multilineItem = item.content.split('<br>');
					for (let i = 0; i < multilineItem.length - 1; i++) {
						multilineItem[i] = [multilineItem[i], <br />];
					}
					items.push(
						<li>
							<a href={`#${item.anchor}`}>{multilineItem}</a>
						</li>
					);
				}
			});
			return <ul>{items}</ul>;
		};

		if (this.state.headers) {
			return (
				<div className="ub_table-of-contents-container">
					{parseList_1_0_9(this.state.headers)}
				</div>
			);
		} else {
			return this.props.blockProp && ToCPlaceholder;
		}
	}
}

export const version_1_0_9 = props => {
	const { links, title } = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
				</div>
			)}
			<TableOfContents_1_0_9 headers={links && JSON.parse(links)} />
		</div>
	);
};

const parseList_1_1_3 = list => {
	let items = [];
	list.forEach(item => {
		if (Array.isArray(item)) {
			items.push(parseList_1_1_3(item));
		} else {
			items.push(
				<li>
					<a
						href={`#${item.anchor}`}
						dangerouslySetInnerHTML={{
							__html: item.content.replace(/(<a.+?>|<\/a>)/g, '')
						}}
					/>
				</li>
			);
		}
	});
	return <ul>{items}</ul>;
};

class TableOfContents_1_1_3 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		const setHeaders = () => {
			const headers = getHeaderBlocks().map(header => header.attributes);
			headers.forEach((heading, key) => {
				const headingAnchorEmpty =
					typeof heading.anchor === 'undefined' ||
					heading.anchor === '';
				const headingContentEmpty =
					typeof heading.content === 'undefined' ||
					heading.content === '';
				const headingDefaultAnchor =
					!headingAnchorEmpty &&
					heading.anchor.indexOf(key + '-') === 0;
				if (
					!headingContentEmpty &&
					(headingAnchorEmpty || headingDefaultAnchor)
				) {
					heading.anchor =
						key +
						'-' +
						heading.content
							.toString()
							.toLowerCase()
							.replace(/( |<.+?>|&nbsp;)/g, '-');
					heading.anchor = heading.anchor.replace(
						/[^\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s-]/g,
						''
					);
				}
			});
			this.setState({ headers: makeHeaderArray_1_0_9(headers) });
		};

		setHeaders();

		const unsubscribe = subscribe(() => {
			setHeaders();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		if (this.state.headers) {
			return (
				<div className="ub_table-of-contents-container">
					{parseList_1_1_3(this.state.headers)}
				</div>
			);
		} else {
			return this.props.blockProp && ToCPlaceholder;
		}
	}
}

export const version_1_1_3 = props => {
	const { links, title } = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
				</div>
			)}
			<TableOfContents_1_1_3 headers={links && JSON.parse(links)} />
		</div>
	);
};

const setHeaders_1_1_5 = () => {
	const headers = getHeaderBlocks().map(header => header.attributes);
	headers.forEach((heading, key) => {
		const headingAnchorEmpty =
			typeof heading.anchor === 'undefined' || heading.anchor === '';
		const headingContentEmpty =
			typeof heading.content === 'undefined' || heading.content === '';
		const headingDefaultAnchor =
			!headingAnchorEmpty && heading.anchor.indexOf(key + '-') === 0;
		if (
			!headingContentEmpty &&
			(headingAnchorEmpty || headingDefaultAnchor)
		) {
			heading.anchor =
				key +
				'-' +
				heading.content
					.toString()
					.toLowerCase()
					.replace(/( |<.+?>|&nbsp;)/g, '-');
			heading.anchor = heading.anchor.replace(
				/[^\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s-]/g,
				''
			);
		}
	});
	this.setState({ headers });
};

const makeHeaderArray_1_1_5 = (origHeaders, allowedHeaders) => {
	let arrays = [];

	origHeaders
		.filter(header => allowedHeaders[header.level - 1])
		.forEach(header => makeNestedArray(header, arrays));
	return combineSubarrays(arrays);
};

class TableOfContents_1_1_5 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		setHeaders_1_1_5();

		const unsubscribe = subscribe(() => {
			setHeaders_1_1_5();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		const { allowedHeaders, blockProp, style } = this.props;

		const { headers } = this.state;

		if (
			headers.length > 0 &&
			headers.filter(header => allowedHeaders[header.level - 1]).length >
				0
		) {
			return (
				<div style={style} className="ub_table-of-contents-container">
					{parseList_1_1_3(
						makeHeaderArray_1_1_5(headers, allowedHeaders)
					)}
				</div>
			);
		} else {
			return blockProp && ToCPlaceholder;
		}
	}
}

export const version_1_1_5 = props => {
	const {
		links,
		title,
		allowedHeaders,
		showList,
		numColumns,
		allowToCHiding
	} = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
					{allowToCHiding && (
						<div id="ub_table-of-contents-header-toggle">
							<div id="ub_table-of-contents-toggle">
								[
								<a
									id="ub_table-of-contents-toggle-link"
									href="#"
								>
									{showList ? __('hide') : __('show')}
								</a>
								]
							</div>
						</div>
					)}
				</div>
			)}

			<TableOfContents_1_1_5
				style={{
					display:
						showList ||
						title.length === 0 ||
						(title.length === 1 && title[0] === '')
							? 'block'
							: 'none',
					columnCount: numColumns
				}}
				allowedHeaders={allowedHeaders}
				headers={links && JSON.parse(links)}
			/>
		</div>
	);
};

class ToggleButton_1_1_6 extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="ub_table-of-contents-header-toggle">
				<div id="ub_table-of-contents-toggle">
					[
					<a
						id="ub_table-of-contents-toggle-link"
						href="#ub_table-of-contents-title"
					>
						{this.props.showList ? __('hide') : __('show')}
					</a>
					]
				</div>
			</div>
		);
	}
}

class TableOfContents_1_1_6 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		setHeaders_1_1_5();
		const unsubscribe = subscribe(() => {
			setHeaders_1_1_5();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		const { allowedHeaders, blockProp, style, numColumns } = this.props;

		const { headers } = this.state;

		if (
			headers.length > 0 &&
			headers.filter(header => allowedHeaders[header.level - 1]).length >
				0
		) {
			return (
				<div
					style={style}
					className={`ub_table-of-contents-container ub_table-of-contents-${numColumns}-column`}
				>
					{parseList_1_1_3(
						makeHeaderArray_1_1_5(headers, allowedHeaders)
					)}
				</div>
			);
		} else {
			return blockProp && ToCPlaceholder;
		}
	}
}

export const version_1_1_6 = props => {
	const {
		links,
		title,
		allowedHeaders,
		showList,
		numColumns,
		allowToCHiding
	} = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div
						className="ub_table-of-contents-title"
						id="ub_table-of-contents-title"
					>
						{title}
					</div>
					{allowToCHiding && (
						<ToggleButton_1_1_6 showList={showList} />
					)}
				</div>
			)}

			<TableOfContents_1_1_6
				style={{
					display:
						showList ||
						title.length === 0 ||
						(title.length === 1 && title[0] === '')
							? 'block'
							: 'none'
				}}
				numColumns={numColumns}
				allowedHeaders={allowedHeaders}
				headers={links && JSON.parse(links)}
			/>
		</div>
	);
};

const placeItem_1_1_8 = (arr, item) => {
	if (arr.length === 0 || arr[0].level === item.level) {
		arr.push(Object.assign({}, item));
	} else if (arr[arr.length - 1].level < item.level) {
		if (!arr[arr.length - 1].children) {
			arr[arr.length - 1].children = [Object.assign({}, item)];
		} else placeItem_1_1_8(arr[arr.length - 1].children, item);
	}
};

const makeHeaderArray_1_1_8 = (origHeaders, allowedHeaders) => {
	let array = [];

	origHeaders
		.filter(header => allowedHeaders[header.level - 1])
		.forEach(header => {
			placeItem_1_1_8(array, header);
		});

	return array;
};

const parseList_1_1_8 = (list, listStyle) => {
	return list.map(item => (
		<li>
			<a
				href={`#${item.anchor}`}
				dangerouslySetInnerHTML={{
					__html: item.content.replace(/(<a.+?>|<\/a>)/g, '')
				}}
			/>
			{item.children &&
				(listStyle === 'numbered' ? (
					<ol>{parseList_1_1_8(item.children)}</ol>
				) : (
					<ul
						style={{
							listStyle: listStyle === 'plain' ? 'none' : null
						}}
					>
						{parseList_1_1_8(item.children)}
					</ul>
				))}
		</li>
	));
};

class TableOfContents_1_1_8 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		setHeaders_1_1_5();
		const unsubscribe = subscribe(() => {
			setHeaders_1_1_5();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		const {
			allowedHeaders,
			blockProp,
			style,
			numColumns,
			listStyle
		} = this.props;

		const { headers } = this.state;

		if (
			headers.length > 0 &&
			headers.filter(header => allowedHeaders[header.level - 1]).length >
				0
		) {
			return (
				<div
					style={style}
					className={`ub_table-of-contents-container ub_table-of-contents-${numColumns}-column`}
				>
					{listStyle === 'numbered' ? (
						<ol>
							{parseList_1_1_8(
								makeHeaderArray_1_1_8(headers, allowedHeaders),
								listStyle
							)}
						</ol>
					) : (
						<ul
							style={{
								listStyle: listStyle === 'plain' ? 'none' : null
							}}
						>
							{parseList_1_1_8(
								makeHeaderArray_1_1_8(headers, allowedHeaders),
								listStyle
							)}
						</ul>
					)}
				</div>
			);
		} else {
			return blockProp && ToCPlaceholder;
		}
	}
}

export const version_1_1_8 = props => {
	const {
		links,
		title,
		allowedHeaders,
		showList,
		numColumns,
		allowToCHiding,
		listStyle
	} = props.attributes;

	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div
						className="ub_table-of-contents-title"
						id="ub_table-of-contents-title"
					>
						{title}
					</div>
					{allowToCHiding && (
						<ToggleButton_1_1_6 showList={showList} />
					)}
				</div>
			)}

			<TableOfContents_1_1_8
				listStyle={listStyle}
				numColumns={numColumns}
				style={{
					display:
						showList ||
						title.length === 0 ||
						(title.length === 1 && title[0] === '')
							? 'block'
							: 'none'
				}}
				allowedHeaders={allowedHeaders}
				headers={links && JSON.parse(links)}
			/>
		</div>
	);
};

class ToggleButton_2_0_0 extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="ub_table-of-contents-header-toggle">
				<div id="ub_table-of-contents-toggle">
					[
					<a className="ub_table-of-contents-toggle-link" href="#">
						{this.props.showList ? __('hide') : __('show')}
					</a>
					]
				</div>
			</div>
		);
	}
}

export const version_2_0_0 = props => {
	const {
		links,
		title,
		allowedHeaders,
		showList,
		numColumns,
		allowToCHiding,
		listStyle
	} = props.attributes;

	return (
		<div
			className="ub_table-of-contents"
			data-showText={__('show')}
			data-hideText={__('hide')}
		>
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
					{allowToCHiding && (
						<ToggleButton_2_0_0 showList={showList} />
					)}
				</div>
			)}

			<TableOfContents
				listStyle={listStyle}
				numColumns={numColumns}
				style={{
					display:
						showList ||
						title.length === 0 ||
						(title.length === 1 && title[0] === '')
							? 'block'
							: 'none'
				}}
				allowedHeaders={allowedHeaders}
				headers={links && JSON.parse(links)}
			/>
		</div>
	);
};
