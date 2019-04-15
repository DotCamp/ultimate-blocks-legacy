const { select, subscribe } = wp.data;
import { Component } from 'react';
const { __ } = wp.i18n;

const ToCPlaceholder = (
	<p className="ub_table-of-contents-placeholder">
		{__('Add a header to begin generating the table of contents')}
	</p>
);

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

const makeHeaderArray_1_1_2 = origHeaders => {
	let arrays = [];
	origHeaders.forEach(header => makeNestedArray(header, arrays));
	return combineSubarrays(arrays);
};

class TableOfContents_1_1_2 extends Component {
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

			this.setState({ headers: makeHeaderArray_1_1_2(headers) });
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
		const parseList_1_1_2 = list => {
			let items = [];
			list.forEach(item => {
				if (Array.isArray(item)) {
					items.push(parseList_1_1_2(item));
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
					{parseList_1_1_2(this.state.headers)}
				</div>
			);
		} else {
			return this.props.blockProp && ToCPlaceholder;
		}
	}
}

export const version_1_1_2 = props => {
	const { links, title } = props.attributes;
	return (
		<div className="ub_table-of-contents">
			{(title.length > 1 || (title.length === 1 && title[0] !== '')) && (
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">{title}</div>
				</div>
			)}
			<TableOfContents_1_1_2 headers={links && JSON.parse(links)} />
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
			this.setState({ headers: makeHeaderArray_1_1_2(headers) });
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

class ToggleButton extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="ub_table-of-contents-header-toggle">
				<div id="ub_table-of-contents-toggle">
					[
					<a id="ub_table-of-contents-toggle-link" href="#">
						{this.props.showList ? __('hide') : __('show')}
					</a>
					]
				</div>
			</div>
		);
	}
}

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

const makeHeaderArray_1_1_5 = origHeaders => {
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
					{parseList_1_1_3(makeHeaderArray_1_1_5(headers))}
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
					{allowToCHiding && <ToggleButton showList={showList} />}
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
					{parseList_1_1_3(makeHeaderArray_1_1_5(headers))}
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
					{allowToCHiding && <ToggleButton showList={showList} />}
				</div>
			)}

			<TableOfContents_1_1_6
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
