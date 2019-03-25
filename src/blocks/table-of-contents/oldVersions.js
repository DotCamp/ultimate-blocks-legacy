import TableOfContents from './components';

const { select, subscribe } = wp.data;
import { Component } from 'react';
const { __ } = wp.i18n;

class TableOfContents_1_1_2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		const makeHeaderArray = origHeaders => {
			let arrays = [];
			origHeaders.forEach(header => {
				let last = arrays.length - 1;
				if (
					arrays.length === 0 ||
					arrays[last][0].level < header.level
				) {
					arrays.push([header]);
				} else if (arrays[last][0].level === header.level) {
					arrays[last].push(header);
				} else {
					while (arrays[last][0].level > header.level) {
						if (arrays.length > 1) {
							arrays[arrays.length - 2].push(arrays.pop());
							last = arrays.length - 1;
						} else break;
					}
					if (arrays[last][0].level === header.level) {
						arrays[last].push(header);
					}
				}
			});

			while (
				arrays.length > 1 &&
				arrays[arrays.length - 1][0].level >
					arrays[arrays.length - 2][0].level
			) {
				arrays[arrays.length - 2].push(arrays.pop());
			}
			return arrays[0];
		};

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
							.replace(/( |<br>)/g, '-');
					heading.anchor = heading.anchor.replace(/[^\w\s-]/g, '');
				}
			});

			this.setState({ headers: makeHeaderArray(headers) });
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
		const parseList = list => {
			let items = [];
			list.forEach(item => {
				if (Array.isArray(item)) {
					items.push(parseList(item));
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
					{parseList(this.state.headers)}
				</div>
			);
		} else {
			return (
				this.props.blockProp && (
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

class TableOfContents_1_1_3 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null
		};
	}

	componentDidMount() {
		const makeHeaderArray = origHeaders => {
			let arrays = [];
			origHeaders.forEach(header => {
				let last = arrays.length - 1;
				if (
					arrays.length === 0 ||
					arrays[last][0].level < header.level
				) {
					arrays.push([header]);
				} else if (arrays[last][0].level === header.level) {
					arrays[last].push(header);
				} else {
					while (arrays[last][0].level > header.level) {
						if (arrays.length > 1) {
							arrays[arrays.length - 2].push(arrays.pop());
							last = arrays.length - 1;
						} else break;
					}
					if (arrays[last][0].level === header.level) {
						arrays[last].push(header);
					}
				}
			});

			while (
				arrays.length > 1 &&
				arrays[arrays.length - 1][0].level >
					arrays[arrays.length - 2][0].level
			) {
				arrays[arrays.length - 2].push(arrays.pop());
			}
			return arrays[0];
		};

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

			this.setState({ headers: makeHeaderArray(headers) });
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
		const parseList = list => {
			let items = [];
			list.forEach(item => {
				if (Array.isArray(item)) {
					items.push(parseList(item));
				} else {
					items.push(
						<li>
							<a
								href={`#${item.anchor}`}
								dangerouslySetInnerHTML={{
									__html: item.content.replace(
										/(<a.+?>|<\/a>)/g,
										''
									)
								}}
							/>
						</li>
					);
				}
			});
			return <ul>{items}</ul>;
		};

		if (this.state.headers) {
			return (
				<div className="ub_table-of-contents-container">
					{parseList(this.state.headers)}
				</div>
			);
		} else {
			return (
				this.props.blockProp && (
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

			<TableOfContents
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

			<TableOfContents
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
