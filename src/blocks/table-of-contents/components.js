import {
	oneColumnIcon,
	twoColumnsIcon,
	threeColumnsIcon,
	plainList
} from './icon';
import { Component, Fragment } from 'react';
import { getDescendantBlocks } from '../../common';

const {
	ToggleControl,
	PanelRow,
	PanelBody,
	Toolbar,
	IconButton
} = wp.components;
const { InspectorControls, BlockControls, RichText } =
	wp.blockEditor || wp.editor;
const { select, dispatch, subscribe } = wp.data;
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
		const getHeadingBlocks = _ => {
			let headings = [];
			const rootBlocks = (
				select('core/block-editor') || select('core/editor')
			).getBlocks();
			rootBlocks.forEach(block => {
				if (block.name === 'core/heading') {
					headings.push(block);
				} else if (block.innerBlocks.length > 0) {
					let internalHeadings = getDescendantBlocks(block).filter(
						block => block.name === 'core/heading'
					);
					if (internalHeadings.length > 0) {
						headings.push(...internalHeadings);
					}
				}
			});

			return headings;
		};

		const setHeadings = _ => {
			const headers = getHeadingBlocks().map(header => header.attributes);
			headers.forEach((heading, key) => {
				heading.anchor =
					key +
					'-' +
					heading.content
						.toString()
						.toLowerCase()
						.replace(/( |<.+?>|&nbsp;)/g, '-');
				heading.anchor = encodeURIComponent(
					heading.anchor.replace(
						/[^\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s-]/g,
						''
					)
				);
			});
			if (
				JSON.stringify(headers) !== JSON.stringify(this.state.headers)
			) {
				this.setState({ headers });
			}
		};

		setHeadings();

		const unsubscribe = subscribe(() => {
			setHeadings();
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

		const parseList = list =>
			list.map(item => (
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

export const inspectorControls = props => {
	const { attributes, setAttributes } = props;
	const {
		allowedHeaders,
		showList,
		allowToCHiding,
		enableSmoothScroll
	} = attributes;
	return (
		<InspectorControls>
			<PanelBody title={__('Allowed Headers')} initialOpen={true}>
				{allowedHeaders.map((a, i) => (
					<PanelRow>
						<label htmlFor={`ub_toggle_h${i + 1}`}>{`H${i +
							1}`}</label>
						<ToggleControl
							id={`ub_toggle_h${i + 1}`}
							checked={a}
							onChange={() =>
								setAttributes({
									allowedHeaders: [
										...allowedHeaders.slice(0, i),
										!allowedHeaders[i],
										...allowedHeaders.slice(i + 1)
									]
								})
							}
						/>
					</PanelRow>
				))}
			</PanelBody>
			<PanelBody title={__('Additional Settings')} initialOpen={true}>
				<PanelRow>
					<label htmlFor="ub_toc_toggle_display">
						{__(
							'Allow users to toggle the visibility of the table of contents'
						)}
					</label>
					<ToggleControl
						id="ub_toc_toggle_display"
						checked={allowToCHiding}
						onChange={allowToCHiding => {
							setAttributes({
								allowToCHiding,
								showList: allowToCHiding ? showList : true
							});
						}}
					/>
				</PanelRow>
				{allowToCHiding && (
					<PanelRow>
						<label htmlFor="ub_show_toc">
							{__('Initially Show Table of Contents')}
						</label>
						<ToggleControl
							id="ub_show_toc"
							checked={showList}
							onChange={() => {
								setAttributes({
									showList: !showList
								});
							}}
						/>
					</PanelRow>
				)}
				<PanelRow>
					<label htmlFor="ub_toc_smoothscroll">
						Enable smooth scrolling
					</label>
					<ToggleControl
						id="ub_toc_smoothscroll"
						checked={enableSmoothScroll}
						onChange={() => {
							const tocInstances = (
								select('core/block-editor') ||
								select('core/editor')
							)
								.getBlocks()
								.filter(
									block =>
										block.name ===
										'ub/table-of-contents-block'
								);
							tocInstances.forEach(instance => {
								(
									dispatch('core/block-editor') ||
									dispatch('core/editor')
								).updateBlockAttributes(instance.clientId, {
									enableSmoothScroll: !enableSmoothScroll
								});
							});
						}}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};

export const blockControls = props => {
	const { setAttributes } = props;
	const { numColumns } = props.attributes;
	return (
		<BlockControls>
			<Toolbar>
				<IconButton
					className={'ub_toc_column_selector'}
					icon={oneColumnIcon}
					label={__('One column')}
					isPrimary={numColumns === 1}
					onClick={() => setAttributes({ numColumns: 1 })}
				/>
				<IconButton
					className={'ub_toc_column_selector'}
					icon={twoColumnsIcon}
					label={__('Two columns')}
					isPrimary={numColumns === 2}
					onClick={() => setAttributes({ numColumns: 2 })}
				/>
				<IconButton
					className={'ub_toc_column_selector'}
					icon={threeColumnsIcon}
					label={__('Three columns')}
					isPrimary={numColumns === 3}
					onClick={() => setAttributes({ numColumns: 3 })}
				/>
			</Toolbar>
			<Toolbar>
				<IconButton
					icon="editor-ul"
					label={__('Bulleted list')}
					onClick={() => setAttributes({ listStyle: 'bulleted' })}
				/>
				<IconButton
					icon="editor-ol"
					label={__('Numbered list')}
					onClick={() => setAttributes({ listStyle: 'numbered' })}
				/>
				<IconButton
					icon={plainList}
					label={__('Plain list')}
					onClick={() => setAttributes({ listStyle: 'plain' })}
				/>
			</Toolbar>
		</BlockControls>
	);
};

export const editorDisplay = props => {
	const { setAttributes } = props;
	const {
		links,
		title,
		allowedHeaders,
		showList,
		allowToCHiding,
		numColumns,
		listStyle
	} = props.attributes;

	return (
		<Fragment>
			<div className="ub_table-of-contents-header">
				<div className="ub_table-of-contents-title">
					<RichText
						placeholder={__('Optional title')}
						className="ub_table-of-contents-title"
						onChange={text => setAttributes({ title: text })}
						value={title}
						keepPlaceholderOnFocus={true}
					/>
				</div>
				{allowToCHiding && (
					<div id="ub_table-of-contents-header-toggle">
						<div id="ub_table-of-contents-toggle">
							[
							<a
								className="ub_table-of-contents-toggle-link"
								href="#"
								onClick={() => {
									setAttributes({ showList: !showList });
								}}
							>
								{showList ? __('hide') : __('show')}
							</a>
							]
						</div>
					</div>
				)}
			</div>
			{showList && (
				<TableOfContents
					listStyle={listStyle}
					numColumns={numColumns}
					allowedHeaders={allowedHeaders}
					headers={links && JSON.parse(links)}
					blockProp={props}
				/>
			)}
		</Fragment>
	);
};

export default TableOfContents;
