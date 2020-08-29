import {
	oneColumnIcon,
	twoColumnsIcon,
	threeColumnsIcon,
	plainList,
} from "./icon";
import { Component, Fragment } from "react";
import { getDescendantBlocks, mergeRichTextArray } from "../../common";
import toLatin from "./localToLatin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import filterDiacritics from "./removeDiacritics";

library.add(faEye, faEyeSlash);

const {
	ToggleControl,
	PanelRow,
	PanelBody,
	Toolbar,
	IconButton,
	SelectControl,
	RangeControl,
	TextControl,
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
			currentlyEditedItem: "", //set to clientid of heading
			hasIdMismatch: false,
			replacementHeaders: [],
		};
	}

	componentDidMount() {
		const { updateBlockAttributes } =
			dispatch("core/block-editor") || dispatch("core/editor"); //updateBlock doesn't work properly
		const { getBlock } = select("core/block-editor") || select("core/editor");

		const getHeadingBlocks = () => {
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
					} else if (block.name === "generateblocks/headline") {
						if (
							["h1", "h2", "h3", "h4", "h5", "h6"].includes(
								newBlock.attributes.element
							)
						) {
							newBlock.attributes = Object.assign(
								{},
								{
									content: mergeRichTextArray(blockAttributes.content),
									level: Number(blockAttributes.element.charAt(1)),
									anchor: blockAttributes.elementId,
								}
							);
							//also set elementID to generated anchor value
							headings.push(newBlock);
						}
					} else if (block.name === "core/nextpage") {
						pageNum++;
					} else if (block.innerBlocks.length > 0) {
						let internalHeadings = getDescendantBlocks(block).filter((block) =>
							[
								"core/heading",
								"kadence/advancedheading",
								"themeisle-blocks/advanced-heading",
								"uagb/advanced-heading",
								"generateblocks/headline",
							].includes(block.name)
						);

						if (internalHeadings.length > 0) {
							internalHeadings = internalHeadings.map((h) => {
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
									case "generateblocks/headline":
										h.attributes = Object.assign({}, h.attributes);
										h.attributes.level = [...Array(6).keys()]
											.map((a) => `h${a + 1}`)
											.includes(h.attributes.element)
											? Number(h.attributes.element.charAt(1))
											: 0;
										if (Array.isArray(h.attributes.content)) {
											h.attributes.content = mergeRichTextArray(
												h.attributes.content
											);
										}
										break;
									default:
										break;
								}
								return h;
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

		const setHeadings = (checkIDs = true) => {
			const { removeDiacritics } = this.props;
			const headers = getHeadingBlocks().map((header) =>
				Object.assign(header.attributes, {
					clientId: header.clientId,
					blockName: header.name,
				})
			);

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

					heading.anchor = heading.anchor
						.replace(/[^\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s-]/g, "")
						.replace(/-{2,}/g, "-");

					if (removeDiacritics) {
						heading.anchor = filterDiacritics(heading.anchor).replace(
							/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]/g,
							""
						);
					}

					heading.anchor = encodeURIComponent(heading.anchor);

					if (
						heading.blockName === "generateblocks/headline" &&
						heading.anchor !== getBlock(heading.clientId).attributes.elementId
					) {
						updateBlockAttributes(heading.clientId, {
							elementId: heading.anchor,
						});
					}
				}
			});

			const currentIDs = this.state.headers
				? this.state.headers.map((header) => header.clientId)
				: [];

			const hasHeadings =
				Array.isArray(this.state.headers) && this.state.headers.length > 0;

			const newHeaders = headers.map((header, i) => ({
				clientId: header.clientId,
				content: header.content,
				level: header.level,
				anchor: header.anchor,
				index: i,
				disabled:
					hasHeadings &&
					this.state.headers[i] &&
					"disabled" in this.state.headers[i]
						? checkIDs
							? currentIDs.indexOf(header.clientId) > -1
								? this.state.headers[currentIDs.indexOf(header.clientId)]
										.disabled
								: null
							: this.state.headers[i].disabled
						: null,
				customContent:
					hasHeadings &&
					this.state.headers[i] &&
					"customContent" in this.state.headers[i]
						? checkIDs
							? currentIDs.indexOf(header.clientId) > -1
								? this.state.headers[currentIDs.indexOf(header.clientId)]
										.customContent
								: null
							: this.state.headers[i].customContent
						: null,
			}));

			if (JSON.stringify(newHeaders) !== JSON.stringify(this.state.headers)) {
				if (Array.isArray(this.state.headers)) {
					if (this.state.headers.length === newHeaders.length) {
						let hasMismatch = false;

						this.state.headers.some(
							(h, i) => h.clientId !== newHeaders[i].clientId
						);

						if (checkIDs && hasMismatch) {
							this.setState({
								hasIdMismatch: true,
								replacementHeaders: newHeaders,
							});
						} else {
							this.setState({
								headers: this.state.headers.map((hd, i) => {
									const defaultReplacement =
										this.state.headers[
											this.state.headers
												.map((h) => h.clientId)
												.indexOf(newHeaders[i].clientId)
										] || hd;
									return Object.assign({}, newHeaders[i], {
										disabled:
											newHeaders[i].disabled || defaultReplacement.disabled,
										customContent:
											newHeaders[i].customContent ||
											defaultReplacement.customContent,
									});
								}),
							});
						}
					} else {
						this.setState({
							hasIdMismatch: true,
							replacementHeaders: newHeaders,
						});
					}
				} else {
					this.setState({ headers: newHeaders });
				}
			}
		};

		setHeadings(false);

		const unsubscribe = subscribe(() => setHeadings());
		this.setState({ unsubscribe });

		// bind setHeadings to component context
		this.setHeadings = setHeadings.bind(this);
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		// call header manipulation to trigger latin alphabet conversion of links
		const { setAttributes, attributes } = this.props.blockProp;
		const { headers, replacementHeaders, breaks } = this.state;

		if (
			this.props.allowToLatin !== prevProps.allowToLatin ||
			this.props.removeDiacritics !== prevProps.removeDiacritics
		) {
			this.setHeadings();
			setAttributes({ links: JSON.stringify(headers) });
			return;
		}

		if (JSON.stringify(headers) !== JSON.stringify(prevState.headers)) {
			setAttributes({ links: JSON.stringify(headers) });
		}
		if (breaks !== attributes.gaps) {
			setAttributes({ gaps: breaks });
		}

		if (this.state.hasIdMismatch) {
			const oldIDs = Array.isArray(headers)
				? headers.map((h) => h.clientId)
				: [];
			const newIDs = replacementHeaders.map((h) => h.clientId);

			if (oldIDs.length === newIDs.length) {
				let mismatchLocs = [];
				for (let i = 0; i < replacementHeaders.length; i++) {
					if (headers[i].clientId !== replacementHeaders[i].clientId) {
						mismatchLocs.push(i);
					}
				}
				let replacements = JSON.parse(
					JSON.stringify(replacementHeaders)
				).sort((a, b) =>
					newIDs.indexOf(a.clientId) > newIDs.indexOf(b.clientId) ? 1 : -1
				);

				if (mismatchLocs.length < 1) {
					replacements = replacements.map((h, i) =>
						Object.assign({}, h, {
							disabled: headers[newIDs.indexOf(headers[i].clientId)].disabled,
							customContent:
								headers[newIDs.indexOf(headers[i].clientId)].customContent,
						})
					);
				}

				this.setState({ headers: JSON.parse(JSON.stringify(replacements)) });
			} else {
				let diff = [];
				let currentHeaders = JSON.parse(JSON.stringify(headers)) || [];
				if (oldIDs.length < newIDs.length) {
					let insertionSpots = [];
					newIDs.forEach((nh, i) => {
						if (oldIDs.indexOf(nh) === -1) {
							diff.push(nh);
							insertionSpots.push(i);
						}
					});

					insertionSpots.forEach((index, i) => {
						const currentHeader = replacementHeaders.filter(
							(nh) => nh.clientId === diff[i]
						)[0];
						currentHeaders.splice(index, 0, currentHeader);
					});
				} else {
					let deletionSpots = [];

					oldIDs.forEach((nh, i) => {
						if (newIDs.indexOf(nh) === -1) {
							diff.push(nh);
							deletionSpots.push(i);
						}
					});

					deletionSpots.forEach((index) => {
						if (index !== currentHeaders[index].index) {
							//heading split, transfer extra attributes of old heading to first of two new ones
							Object.assign(currentHeaders[currentHeaders[index].index], {
								disabled: currentHeaders[index].disabled,
								customContent: currentHeaders[index].customContent,
							});
						}
						currentHeaders.splice(index, 1);
					});
				}
				this.setState({ headers: currentHeaders });
			}

			this.setState({ hasIdMismatch: false });
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

		const { isSelected } = blockProp;

		const { headers, currentlyEditedItem } = this.state;

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
				.filter((header) => !header.disabled || isSelected)
				.forEach((header) => placeItem(array, header));

			return array;
		};

		const parseList = (list) =>
			list.map((item) => (
				<li>
					<div style={{ display: isSelected ? "flex" : "block" }}>
						{isSelected && currentlyEditedItem === item.clientId ? (
							<input
								type="text"
								value={item.customContent}
								onChange={(e) => {
									const revisedHeaders = JSON.parse(
										JSON.stringify(this.state.headers)
									);
									revisedHeaders[item.index].customContent = e.target.value;
									this.setState({ headers: revisedHeaders });
								}}
								onBlur={() => this.setState({ currentlyEditedItem: "" })}
							/>
						) : (
							<a
								href={`#${item.anchor}`}
								dangerouslySetInnerHTML={{
									__html: `${item.disabled ? "<del>" : ""}${
										item.customContent || item.content.replace(/(<.+?>)/g, "")
									}${item.disabled ? "</del>" : ""}`,
								}}
							/>
						)}
						{isSelected && (
							<div className="ub_toc_button_container">
								{!item.disabled && (
									<button
										onClick={() =>
											this.setState({ currentlyEditedItem: item.clientId })
										}
									>
										<span className="dashicons dashicons-edit-large"></span>
									</button>
								)}
								<button
									onClick={() => {
										const revisedHeaders = JSON.parse(
											JSON.stringify(this.state.headers)
										);
										revisedHeaders[item.index].disabled = !revisedHeaders[
											item.index
										].disabled;
										this.setState({ headers: revisedHeaders });
									}}
								>
									<FontAwesomeIcon icon={item.disabled ? faEye : faEyeSlash} />
								</button>
							</div>
						)}
					</div>
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
						{__("Add a heading to begin generating the table of contents")}
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
		removeDiacritics,
		scrollOption,
		scrollOffset,
		scrollTarget,
		scrollTargetType,
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
							onChange={() =>
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
							onChange={() =>
								setAttributes({
									showList: !showList,
								})
							}
						/>
					</PanelRow>
				)}
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
				<PanelRow>
					<label htmlFor="ub_toc_toggle_diacritics">
						{__("Remove diacritics from generated anchor links")}
					</label>
					<ToggleControl
						id="ub_toc_toggle_diacritics"
						checked={removeDiacritics}
						onChange={(removeDiacritics) => setAttributes({ removeDiacritics })}
					/>
				</PanelRow>
				<PanelBody title={__("Scroll Settings")} initialOpen={true}>
					<SelectControl
						label={__("Scroll offset adjustment options")}
						value={scrollOption}
						options={[
							{
								label: __(
									"Adjust according to first available fixed/sticky element"
								),
								value: "auto",
							},
							{
								label: __("Adjust with respect to a specific element"),
								value: "namedelement",
							},
							{ label: __("Adjust by fixed amount"), value: "fixedamount" },
							{ label: __("Make no adjustments"), value: "off" },
						]}
						onChange={(scrollOption) => setAttributes({ scrollOption })}
					/>
					{scrollOption === "namedelement" && (
						<Fragment>
							<SelectControl
								label={__("Scroll reference name type")}
								value={scrollTargetType}
								options={["id", "class", "element"].map((a) => ({
									label: __(a),
									value: a,
								}))}
								onChange={(scrollTargetType) =>
									setAttributes({ scrollTargetType })
								}
							/>
							<TextControl
								label={__("Reference element for scroll offset")}
								value={scrollTarget}
								onChange={(scrollTarget) => setAttributes({ scrollTarget })}
							/>
						</Fragment>
					)}
					{scrollOption === "fixedamount" && (
						<RangeControl
							label={__("Scroll offset (pixels)")}
							value={scrollOffset}
							onChange={(scrollOffset) => setAttributes({ scrollOffset })}
							min={0}
							max={200}
							allowReset
						/>
					)}
					<PanelRow>
						<label htmlFor="ub_toc_scroll">
							{__("Enable smooth scrolling")}
						</label>
						<ToggleControl
							id="ub_toc_scroll"
							checked={enableSmoothScroll}
							onChange={() => {
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
				</PanelBody>
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
					onClick={() => setAttributes({ numColumns: 1 })}
				/>
				<IconButton
					className={"ub_toc_column_selector"}
					icon={twoColumnsIcon}
					label={__("Two columns")}
					isPrimary={numColumns === 2}
					onClick={() => setAttributes({ numColumns: 2 })}
				/>
				<IconButton
					className={"ub_toc_column_selector"}
					icon={threeColumnsIcon}
					label={__("Three columns")}
					isPrimary={numColumns === 3}
					onClick={() => setAttributes({ numColumns: 3 })}
				/>
			</Toolbar>
			<Toolbar>
				<IconButton
					icon="editor-ul"
					label={__("Bulleted list")}
					onClick={() => setAttributes({ listStyle: "bulleted" })}
				/>
				<IconButton
					icon="editor-ol"
					label={__("Numbered list")}
					onClick={() => setAttributes({ listStyle: "numbered" })}
				/>
				<IconButton
					icon={plainList}
					label={__("Plain list")}
					onClick={() => setAttributes({ listStyle: "plain" })}
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
		removeDiacritics,
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
								onClick={() => setAttributes({ showList: !showList })}
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
					removeDiacritics={removeDiacritics}
				/>
			)}
		</Fragment>
	);
};

export default TableOfContents;
