import {
	oneColumnIcon,
	twoColumnsIcon,
	threeColumnsIcon,
	plainList,
} from "./icon";
import { Component, Fragment } from "react";
import { getDescendantBlocks } from "../../common";
import toLatin from "./localToLatin";

const {
	ToggleControl,
	PanelRow,
	PanelBody,
	Toolbar,
	IconButton,
} = wp.components;
const { InspectorControls, BlockControls, RichText, AlignmentToolbar } =
	wp.blockEditor || wp.editor;
const { select, dispatch, subscribe } = wp.data;
const { __ } = wp.i18n;

class TableOfContents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null,
			breaks: [],
		};
	}

	componentDidMount() {
		const getHeadingBlocks = (_) => {
			let headings = [];

			let pageNum = 1;

			let pageBreaks = [];

			const rootBlocks = (
				select("core/block-editor") || select("core/editor")
			).getBlocks();
			rootBlocks.forEach((block) => {
				if (block.name === "core/heading") {
					headings.push(block);
					pageBreaks.push(pageNum);
				} else {
					let newBlock = Object.assign({}, block);
					let blockAttributes = block.attributes;
					if (block.name === "uagb/advanced-heading") {
						newBlock.attributes = Object.assign(blockAttributes, {
							content: blockAttributes.headingTitle || "",
						});
						headings.push(newBlock);
						pageBreaks.push(pageNum);
					} else if (block.name === "themeisle-blocks/advanced-heading") {
						if (
							["h1", "h2", "h3", "h4", "h5", "h6"].includes(
								block.attributes.tag
							)
						) {
							newBlock.attributes = Object.assign(blockAttributes, {
								level: Number(blockAttributes.tag.charAt(1)),
								anchor: `themeisle-otter ${blockAttributes.id}`,
							});
							headings.push(newBlock);
							pageBreaks.push(pageNum);
						}
					} else if (block.name === "kadence/advancedheading") {
						if (!("content" in newBlock.attributes)) {
							newBlock.attributes.content = "";
						}
						headings.push(newBlock);
						pageBreaks.push(pageNum);
					} else if (block.name === "core/nextpage") {
						pageNum++;
					} else if (block.innerBlocks.length > 0) {
						let internalHeadings = getDescendantBlocks(block).filter((block) =>
							[
								"core/heading",
								"kadence/advancedheading",
								"themeisle-blocks/advanced-heading",
								"uagb/advanced-heading",
							].includes(block.name)
						);

						if (internalHeadings.length > 0) {
							internalHeadings.forEach((h) => {
								switch (h.name) {
									case "kadence/advancedheading":
										if (!("content" in h.attributes)) {
											h.attributes.content = "";
										}
										break;
									case "themeisle-blocks/advanced-heading":
										h.attributes.level = [...Array(6).keys()]
											.map((a) => `h${a + 1}`)
											.includes(h.attributes.tag)
											? Number(h.attributes.tag.charAt(1))
											: 0;
										h.attributes.anchor = `themeisle-otter ${h.attributes.id}`;
										break;
									case "uagb/advanced-heading":
										h.attributes.content = h.attributes.headingTitle || "";
										break;
									default:
										break;
								}
							});
							internalHeadings.filter((h) => h.attributes.level > 0);
						}

						if (internalHeadings.length > 0) {
							headings.push(...internalHeadings);
							pageBreaks.push(...Array(internalHeadings.length).fill(pageNum));
						}
					}
				}
			});

			if (JSON.stringify(this.state.breaks) !== JSON.stringify(pageBreaks)) {
				this.setState({ breaks: pageBreaks });
			}

			return headings;
		};

		const setHeadings = (_) => {
			const headers = getHeadingBlocks().map((header) => header.attributes);
			headers.forEach((heading, key) => {
				if (
					!heading.anchor ||
					heading.anchor.indexOf("themeisle-otter ") === -1
				) {
					heading.anchor =
						key +
						"-" +
						(this.props.allowToLatin
							? toLatin("all", heading.content.toString())
							: heading.content.toString()
						)
							.toLowerCase()
							.replace(/( |<.+?>|&nbsp;)/g, "-");
					heading.anchor = encodeURIComponent(
						heading.anchor
							.replace(/[^\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s-]/g, "")
							.replace(/-{2,}/g, "-")
					);
				}
			});

			const newHeaders = headers.map((header) => ({
				content: header.content,
				level: header.level,
				anchor: header.anchor,
			}));

			if (JSON.stringify(newHeaders) !== JSON.stringify(this.state.headers)) {
				this.setState({ headers: newHeaders });
			}
		};

		setHeadings();

		const unsubscribe = subscribe((_) => setHeadings());
		this.setState({ unsubscribe });

		// bind setHeadings to component context
		this.setHeadings = setHeadings.bind(this);
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		// call header manipulation to trigger latin alphabet conversion of links
		if (this.props.allowToLatin !== prevProps.allowToLatin) {
			this.setHeadings();
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers),
			});
			return;
		}

		if (
			JSON.stringify(prevProps.headers) !== JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers),
			});
		}
		if (this.state.breaks !== this.props.blockProp.attributes.gaps) {
			this.props.blockProp.setAttributes({ gaps: this.state.breaks });
		}
	}

	render() {
		const {
			allowedHeaders,
			blockProp,
			style,
			numColumns,
			listStyle,
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

		const makeHeaderArray = (origHeaders) => {
			let array = [];

			origHeaders
				.filter((header) => allowedHeaders[header.level - 1])
				.forEach((header) => placeItem(array, header));

			return array;
		};

		const parseList = (list) =>
			list.map((item) => (
				<li>
					<a
						href={`#${item.anchor}`}
						dangerouslySetInnerHTML={{
							__html: item.content.replace(/(<.+?>)/g, ""),
						}}
					/>
					{item.children &&
						(listStyle === "numbered" ? (
							<ol>{parseList(item.children)}</ol>
						) : (
							<ul
								style={{
									listStyle: listStyle === "plain" ? "none" : null,
								}}
							>
								{parseList(item.children)}
							</ul>
						))}
				</li>
			));

		if (
			headers.length > 0 &&
			headers.filter((header) => allowedHeaders[header.level - 1]).length > 0
		) {
			return (
				<div
					style={style}
					className={`ub_table-of-contents-container ub_table-of-contents-${numColumns}-column`}
				>
					{listStyle === "numbered" ? (
						<ol>{parseList(makeHeaderArray(headers))}</ol>
					) : (
						<ul
							style={{
								listStyle: listStyle === "plain" ? "none" : null,
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
						{__("Add a header to begin generating the table of contents")}
					</p>
				)
			);
		}
	}
}

export const inspectorControls = (props) => {
	const { attributes, setAttributes } = props;
	const {
		allowedHeaders,
		showList,
		allowToCHiding,
		enableSmoothScroll,
		allowToLatin,
	} = attributes;

	const { updateBlockAttributes } =
		dispatch("core/block-editor") || dispatch("core/editor");
	const { getBlocks } = select("core/block-editor") || select("core/editor");

	return (
		<InspectorControls>
			<PanelBody title={__("Allowed Headers")} initialOpen={true}>
				{allowedHeaders.map((a, i) => (
					<PanelRow>
						<label htmlFor={`ub_toggle_h${i + 1}`}>{`H${i + 1}`}</label>
						<ToggleControl
							id={`ub_toggle_h${i + 1}`}
							checked={a}
							onChange={(_) =>
								setAttributes({
									allowedHeaders: [
										...allowedHeaders.slice(0, i),
										!allowedHeaders[i],
										...allowedHeaders.slice(i + 1),
									],
								})
							}
						/>
					</PanelRow>
				))}
			</PanelBody>
			<PanelBody title={__("Additional Settings")} initialOpen={true}>
				<PanelRow>
					<label htmlFor="ub_toc_toggle_display">
						{__(
							"Allow users to toggle the visibility of the table of contents"
						)}
					</label>
					<ToggleControl
						id="ub_toc_toggle_display"
						checked={allowToCHiding}
						onChange={(allowToCHiding) =>
							setAttributes({
								allowToCHiding,
								showList: allowToCHiding ? showList : true,
							})
						}
					/>
				</PanelRow>
				{allowToCHiding && (
					<PanelRow>
						<label htmlFor="ub_show_toc">
							{__("Initially Show Table of Contents")}
						</label>
						<ToggleControl
							id="ub_show_toc"
							checked={showList}
							onChange={(_) =>
								setAttributes({
									showList: !showList,
								})
							}
						/>
					</PanelRow>
				)}
				<PanelRow>
					<label htmlFor="ub_toc_smoothscroll">Enable smooth scrolling</label>
					<ToggleControl
						id="ub_toc_smoothscroll"
						checked={enableSmoothScroll}
						onChange={(_) => {
							const tocInstances = getBlocks().filter(
								(block) => block.name === "ub/table-of-contents-block"
							);
							tocInstances.forEach((instance) => {
								updateBlockAttributes(instance.clientId, {
									enableSmoothScroll: !enableSmoothScroll,
								});
							});
						}}
					/>
				</PanelRow>
				<PanelRow>
					<label htmlFor="ub_toc_enable_latin_conversion">
						{__("Enable conversion of links to latin alphabet")}
					</label>
					<ToggleControl
						id="ub_toc_enable_latin_conversion"
						checked={allowToLatin}
						onChange={(e) => {
							setAttributes({ allowToLatin: e });
						}}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};

export const blockControls = (props) => {
	const { setAttributes } = props;
	const { numColumns, titleAlignment } = props.attributes;
	return (
		<BlockControls>
			<Toolbar>
				<IconButton
					className={"ub_toc_column_selector"}
					icon={oneColumnIcon}
					label={__("One column")}
					isPrimary={numColumns === 1}
					onClick={(_) => setAttributes({ numColumns: 1 })}
				/>
				<IconButton
					className={"ub_toc_column_selector"}
					icon={twoColumnsIcon}
					label={__("Two columns")}
					isPrimary={numColumns === 2}
					onClick={(_) => setAttributes({ numColumns: 2 })}
				/>
				<IconButton
					className={"ub_toc_column_selector"}
					icon={threeColumnsIcon}
					label={__("Three columns")}
					isPrimary={numColumns === 3}
					onClick={(_) => setAttributes({ numColumns: 3 })}
				/>
			</Toolbar>
			<Toolbar>
				<IconButton
					icon="editor-ul"
					label={__("Bulleted list")}
					onClick={(_) => setAttributes({ listStyle: "bulleted" })}
				/>
				<IconButton
					icon="editor-ol"
					label={__("Numbered list")}
					onClick={(_) => setAttributes({ listStyle: "numbered" })}
				/>
				<IconButton
					icon={plainList}
					label={__("Plain list")}
					onClick={(_) => setAttributes({ listStyle: "plain" })}
				/>
			</Toolbar>
			<AlignmentToolbar
				value={titleAlignment}
				onChange={(value) => {
					setAttributes({ titleAlignment: value });
				}}
			/>
		</BlockControls>
	);
};

export const editorDisplay = (props) => {
	const { setAttributes } = props;
	const {
		links,
		title,
		allowedHeaders,
		showList,
		allowToCHiding,
		numColumns,
		listStyle,
		titleAlignment,
		allowToLatin,
	} = props.attributes;

	return (
		<Fragment>
			<div
				className="ub_table-of-contents-header"
				style={{
					justifySelf:
						titleAlignment === "center"
							? "center"
							: `flex-${titleAlignment === "left" ? "start" : "end"}`,
				}}
			>
				<div className="ub_table-of-contents-title">
					<RichText
						placeholder={__("Optional title")}
						className="ub_table-of-contents-title"
						onChange={(text) => setAttributes({ title: text })}
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
								onClick={(_) => setAttributes({ showList: !showList })}
							>
								{showList ? __("hide") : __("show")}
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
					allowToLatin={allowToLatin}
				/>
			)}
		</Fragment>
	);
};

export default TableOfContents;
