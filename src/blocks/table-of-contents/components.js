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

export default TableOfContents;
