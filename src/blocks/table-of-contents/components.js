const { select, subscribe } = wp.data;
import { Component } from 'react';
const { __ } = wp.i18n;

class TableOfContents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		const getHeaderBlocks = () =>
			select('core/editor')
				.getBlocks()
				.filter(block => block.name === 'core/heading');

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

			this.setState({ headers });
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
		const {
			allowedHeaders,
			blockProp,
			style,
			numColumns,
			listStyle
		} = this.props;

		const { headers } = this.state;

		const placeItem = (arr, item) => {
			if (arr.length === 0 || arr[0].level === item.level) {
				arr.push(Object.assign({}, item));
			} else if (arr[arr.length - 1].level < item.level) {
				if (!arr[arr.length - 1].children) {
					arr[arr.length - 1].children = [Object.assign({}, item)];
				} else placeItem(arr[arr.length - 1].children, item);
			}
		};

		const makeHeaderArray = origHeaders => {
			let array = [];

			origHeaders
				.filter(header => allowedHeaders[header.level - 1])
				.forEach(header => {
					placeItem(array, header);
				});

			return array;
		};

		const parseList = list => {
			return list.map(item => (
				<li>
					<a
						href={`#${item.anchor}`}
						dangerouslySetInnerHTML={{
							__html: item.content.replace(/(<.+?>)/g, '')
						}}
					/>
					{item.children &&
						(listStyle === 'numbered' ? (
							<ol>{parseList(item.children)}</ol>
						) : (
							<ul
								style={{
									listStyle:
										listStyle === 'plain' ? 'none' : null
								}}
							>
								{parseList(item.children)}
							</ul>
						))}
				</li>
			));
		};

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
						<ol>{parseList(makeHeaderArray(headers))}</ol>
					) : (
						<ul
							style={{
								listStyle: listStyle === 'plain' ? 'none' : null
							}}
						>
							{parseList(makeHeaderArray(headers))}
						</ul>
					)}
				</div>
			);
		} else {
			return (
				blockProp && (
					<p className="ub_table-of-contents-placeholder">
						{__(
							'Add a header to begin generating the table of contents'
						)}
					</p>
				)
			);
		}
	}
}

export default TableOfContents;
