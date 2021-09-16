import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove,
} from "react-sortable-hoc";
import Inspector from "./inspector";
import { Component } from "react";
import { upgradeButtonLabel, mergeRichTextArray } from "../../../common";

const { __ } = wp.i18n;
const { createBlock } = wp.blocks;
const { RichText, InnerBlocks, BlockControls } = wp.blockEditor || wp.editor;

const { ToolbarGroup, ToolbarButton } = wp.components;

export class OldTabHolder extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			oldArrangement,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			replaceBlock,
		} = this.props;

		const className = "wp-block-ub-tabbed-content";

		window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

		let block = null;

		for (const bl of window.ubTabbedContentBlocks) {
			if (bl.id === attributes.id) {
				block = bl;
				break;
			}
		}

		if (!block) {
			block = {
				id: window.ubTabbedContentBlocks.length,
				SortableItem: null,
				SortableList: null,
			};
			window.ubTabbedContentBlocks.push(block);
			setAttributes({ id: block.id });
		}

		if (!attributes.tabsTitle) {
			attributes.tabsTitle = [];
		}

		const tabs = this.props.block.innerBlocks;

		const showControls = (type, index) => {
			setAttributes({ activeControl: type + "-" + index });
			setAttributes({ activeTab: index });

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, { isActive: index === i });
			});
		};

		const addTab = (i) => {
			insertBlock(createBlock("ub/tab", {}), i, this.props.block.clientId);
			attributes.tabsTitle[i] = { content: "Tab Title" };
			setAttributes({ tabsTitle: attributes.tabsTitle });

			setAttributes({ activeTab: i });

			showControls("tab-title", i);
		};

		if (attributes.tabsTitle.length === 0) {
			addTab(0);
		}

		const DragHandle = SortableHandle(() => (
			<span className="dashicons dashicons-move drag-handle" />
		));

		if (!block.SortableItem) {
			block.SortableItem = SortableElement(
				({ value, i, propz, onChangeTitle, onRemoveTitle, toggleTitle }) => (
					<div
						className={`${className}-tab-title-wrap SortableItem${
							propz.attributes.activeTab === i ? " active" : ""
						}`}
						style={{
							backgroundColor:
								propz.attributes.activeTab === i
									? propz.attributes.theme
									: "initial",
							color:
								propz.attributes.activeTab === i
									? propz.attributes.titleColor
									: "#000000",
						}}
						onClick={() => toggleTitle("tab-title", i)}
					>
						<RichText
							tagName="div"
							className={className + "-tab-title "}
							value={value.content}
							allowedFormats={["core/bold", "core/italic"]}
							isSelected={
								propz.attributes.activeControl === "tab-title-" + i &&
								propz.isSelected
							}
							onChange={(content) => onChangeTitle(content, i)}
							placeholder="Tab Title"
						/>
						<div className="ub-tab-actions">
							<DragHandle />
							<span
								className={
									"dashicons dashicons-minus remove-tab-icon" +
									(propz.attributes.tabsTitle.length === 1 ? " ub-hide" : "")
								}
								onClick={() => onRemoveTitle(i)}
							/>
						</div>
					</div>
				)
			);
		}

		if (!block.SortableList) {
			block.SortableList = SortableContainer(
				({
					items,
					propz,
					onChangeTitle,
					onRemoveTitle,
					toggleTitle,
					onAddTab,
				}) => (
					<div className={`${className}-tabs-title SortableList`}>
						{items.map((value, index) => (
							<block.SortableItem
								propz={propz}
								key={`item-${index}`}
								i={index}
								index={index}
								value={value}
								onChangeTitle={onChangeTitle}
								onRemoveTitle={onRemoveTitle}
								toggleTitle={toggleTitle}
							/>
						))}
						<div
							className={`${className}-tab-title-wrap`}
							key={propz.attributes.tabsTitle.length}
							onClick={() => onAddTab(propz.attributes.tabsTitle.length)}
						>
							<span className="dashicons dashicons-plus-alt" />
						</div>
					</div>
				)
			);
		}

		const newArrangement = JSON.stringify(
			tabs.map((tab) => tab.attributes.index)
		);

		if (newArrangement !== oldArrangement) {
			tabs.forEach((tab, i) =>
				updateBlockAttributes(tab.clientId, {
					index: i,
					isActive: attributes.activeTab === i,
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		if (selectedBlock && selectedBlock.clientId !== this.props.block.clientId) {
			if (
				tabs.filter((innerblock) => innerblock.attributes.isActive).length === 0
			) {
				showControls("tab-title", tabs.length - 1);
			}
			if (
				tabs.filter((tab) => tab.clientId === selectedBlock.clientId).length >
					0 &&
				!selectedBlock.attributes.isActive
			) {
				selectBlock(this.props.block.clientId);
			}
		}

		return [
			isSelected && <Inspector {...{ attributes, setAttributes }} />,
			<div className={className}>
				<button
					onClick={() => {
						const { activeControl, activeTab, theme, titleColor, tabsTitle } =
							this.props.block.attributes;
						replaceBlock(
							this.props.block.clientId,
							createBlock(
								"ub/tabbed-content-block",
								{
									activeControl,
									activeTab,
									theme,
									titleColor,
									tabsTitle: tabsTitle
										.map((title) => title.content)
										.map((title) =>
											Array.isArray(title) ? mergeRichTextArray(title) : title
										),
								},
								this.props.block.innerBlocks.map((innerBlock, i) =>
									createBlock(
										"ub/tab-block",
										{
											index: i,
											isActive: innerBlock.attributes.isActive,
										},
										innerBlock.innerBlocks
									)
								)
							)
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				<div className={`${className}-holder`}>
					<block.SortableList
						axis="x"
						propz={this.props}
						items={attributes.tabsTitle}
						onSortEnd={({ oldIndex, newIndex }) => {
							const titleItems = attributes.tabsTitle.slice(0);

							setAttributes({
								tabsTitle: arrayMove(titleItems, oldIndex, newIndex),
							});

							moveBlockToPosition(
								tabs.filter((tab) => tab.attributes.index === oldIndex)[0]
									.clientId,
								this.props.block.clientId,
								this.props.block.clientId,
								newIndex
							);

							showControls("tab-title", oldIndex);
							setAttributes({ activeTab: newIndex });
						}}
						useDragHandle={true}
						onChangeTitle={(content, i) => {
							attributes.tabsTitle[i].content = content;
						}}
						onRemoveTitle={(i) => {
							setAttributes({
								tabsTitle: [
									...attributes.tabsTitle.slice(0, i),
									...attributes.tabsTitle.slice(i + 1),
								],
							});

							removeBlock(
								tabs.filter((tab) => tab.attributes.index === i)[0].clientId
							);

							setAttributes({ activeTab: 0 });
							showControls("tab-title", 0);
						}}
						toggleTitle={showControls}
						onAddTab={addTab}
					/>

					<div className={`${className}-tabs-content`}>
						<InnerBlocks templateLock={false} allowedBlocks={["ub/tab"]} />
					</div>
				</div>
			</div>,
		];
	}
}

export class TabHolder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: -1,
		};
	}

	componentDidMount() {
		const { attributes, setAttributes } = this.props;
		const { tabsTitle, tabsTitleAlignment, tabsAnchor, useAnchors } =
			attributes;

		if (tabsTitle.length !== tabsTitleAlignment.length) {
			setAttributes({
				tabsTitleAlignment: Array(tabsTitle.length).fill("center"),
			});
		}

		if (useAnchors && tabsTitle.length > tabsAnchor.length) {
			setAttributes({
				tabsAnchor: tabsAnchor.concat(
					Array(tabsTitle.length - tabsAnchor.length).fill("")
				),
			});
		}
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.checkWidth);
	}
	render() {
		const {
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			oldArrangement,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			getBlock,
			getClientIdsWithDescendants,
		} = this.props;

		let className = "wp-block-ub-tabbed-content";

		window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

		const {
			tabsTitle,
			tabsTitleAlignment,
			useAnchors,
			tabsAnchor,
			activeTab,
			tabsAlignment,
			tabVertical,
			blockID,
			tabStyle,
		} = attributes;
		let block = null;

		for (const bl of window.ubTabbedContentBlocks) {
			if (bl.id === attributes.id) {
				block = bl;
				break;
			}
		}

		if (!block) {
			block = {
				id: this.props.block.clientId,
				SortableItem: null,
				SortableList: null,
			};
			window.ubTabbedContentBlocks.push(block);
			setAttributes({ id: block.id });
		}

		if (!attributes.tabsTitle) {
			attributes.tabsTitle = [];
		}

		const tabs = this.props.block.innerBlocks;

		const showControls = (type, index) => {
			setAttributes({
				activeControl: `${type}-${index}`,
				activeTab: index,
			});

			tabs.forEach((tab, i) => {
				updateBlockAttributes(tab.clientId, { isActive: index === i });
			});
		};

		const addTab = (i) => {
			insertBlock(
				createBlock("ub/tab-block", {}),
				i,
				this.props.block.clientId
			);
			setAttributes({
				tabsTitle: [...tabsTitle, "Tab Title"],
				tabsTitleAlignment: [...tabsTitleAlignment, "left"],
				activeTab: i,
				tabsAnchor: useAnchors ? [...tabsAnchor, ""] : [],
			});

			showControls("tab-title", i);
		};

		if (attributes.tabsTitle.length === 0) {
			addTab(0);
		}

		const DragHandle = SortableHandle(() => (
			<span className="dashicons dashicons-move drag-handle" />
		));

		if (!block.SortableItem) {
			block.SortableItem = SortableElement(
				({ value, i, propz, onChangeTitle, onRemoveTitle, toggleTitle }) => (
					<div
						className={`${className}-tab-title-${
							tabVertical ? "vertical-" : ""
						}wrap SortableItem${
							propz.attributes.activeTab === i ? " active" : ""
						}`}
						style={{
							textAlign: propz.attributes.tabsTitleAlignment[i],
							backgroundColor:
								propz.attributes.tabStyle === "underline"
									? "inherit"
									: propz.attributes.activeTab === i
									? propz.attributes.theme
									: propz.attributes.normalColor || "inherit",
							color:
								propz.attributes.activeTab === i
									? propz.attributes.titleColor || "inherit"
									: propz.attributes.normalTitleColor || "inherit",
							borderBottom:
								propz.attributes.activeTab === i &&
								propz.attributes.tabStyle === "underline"
									? `5px solid ${propz.attributes.titleColor || "inherit"}`
									: null,
						}}
						onClick={() => toggleTitle("tab-title", i)}
					>
						<RichText
							tagName="div"
							className={`${className}-tab-title`}
							value={value}
							allowedFormats={["core/bold", "core/italic"]}
							isSelected={
								propz.attributes.activeControl === `tab-title-${i}` &&
								propz.isSelected
							}
							onChange={(content) => onChangeTitle(content, i)}
							placeholder="Tab Title"
						/>
						<div
							className={`ub-tab-actions${
								propz.attributes.tabsTitle.length === 1 ? " ub-hide" : ""
							}`}
						>
							<DragHandle />
							<span
								className={"dashicons dashicons-minus remove-tab-icon"}
								onClick={() => onRemoveTitle(i)}
							/>
						</div>
					</div>
				)
			);
		}

		if (!block.SortableList) {
			block.SortableList = SortableContainer(
				({
					items,
					propz,
					onChangeTitle,
					onRemoveTitle,
					toggleTitle,
					onAddTab,
				}) => (
					<div
						className={`${className}-tabs-title${
							propz.attributes.tabVertical ? "-vertical-tab" : ""
						} SortableList`}
						style={{
							justifyContent:
								propz.attributes.tabsAlignment === "center"
									? "center"
									: `flex-${
											propz.attributes.tabsAlignment === "left"
												? "start"
												: "end"
									  }`,
						}}
						useWindowAsScrollContainer={true}
					>
						{items.map((value, index) => (
							<block.SortableItem
								propz={propz}
								key={`item-${index}`}
								i={index}
								index={index}
								value={value}
								onChangeTitle={onChangeTitle}
								onRemoveTitle={onRemoveTitle}
								toggleTitle={toggleTitle}
							/>
						))}
						<div
							className={`${className}-tab-title-${
								attributes.tabVertical ? "vertical-" : ""
							}wrap`}
							key={propz.attributes.tabsTitle.length}
							onClick={() => onAddTab(propz.attributes.tabsTitle.length)}
						>
							<span className="dashicons dashicons-plus-alt" />
						</div>
					</div>
				)
			);
		}

		const newArrangement = tabs.map((tab) => tab.attributes.index);

		if (!newArrangement.every((i, j) => i === oldArrangement[j])) {
			tabs.forEach((tab, i) =>
				updateBlockAttributes(tab.clientId, {
					index: i,
					isActive: attributes.activeTab === i,
				})
			);
			setState({ oldArrangement: newArrangement });
		}

		if (selectedBlock && selectedBlock.clientId !== this.props.block.clientId) {
			if (
				tabs.filter((innerblock) => innerblock.attributes.isActive).length === 0
			) {
				showControls("tab-title", tabs.length - 1);
			}
			if (
				tabs.filter((tab) => tab.clientId === selectedBlock.clientId).length >
					0 &&
				!selectedBlock.attributes.isActive
			) {
				selectBlock(this.props.block.clientId);
			}
		}

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === attributes.blockID
			)
		) {
			setAttributes({ blockID: this.props.block.clientId });
		}

		return [
			isSelected && (
				<BlockControls>
					<ToolbarGroup>
						{["left", "center", "right"].map((a) => (
							<ToolbarButton
								icon={`editor-align${a}`}
								label={__(`Align Tab Title ${a[0].toUpperCase() + a.slice(1)}`)}
								isActive={tabsTitleAlignment[activeTab] === a}
								onClick={() =>
									setAttributes({
										tabsTitleAlignment: [
											...tabsTitleAlignment.slice(0, activeTab),
											a,
											...tabsTitleAlignment.slice(activeTab + 1),
										],
									})
								}
							/>
						))}
					</ToolbarGroup>
					<ToolbarGroup>
						{["left", "center", "right"].map((a) => (
							<ToolbarButton
								icon={`align-${a}`}
								label={__(`Align Tabs ${a[0].toUpperCase() + a.slice(1)}`)}
								onClick={() => setAttributes({ tabsAlignment: a })}
							/>
						))}
					</ToolbarGroup>
				</BlockControls>
			),
			isSelected && <Inspector {...{ attributes, setAttributes }} />,
			<div
				className={`${className}${tabStyle === "tabs" ? "" : `-${tabStyle}`}`}
			>
				<div
					className={`${className}-holder ${
						attributes.tabVertical ? "vertical-holder" : ""
					}`}
				>
					<div
						className={`${className}-tab-holder ${
							attributes.tabVertical ? "vertical-tab-width" : ""
						}`}
					>
						<block.SortableList
							axis={attributes.tabVertical ? "y" : "x"}
							propz={this.props}
							items={attributes.tabsTitle}
							onSortEnd={({ oldIndex, newIndex }) => {
								const titleItems = attributes.tabsTitle.slice(0);
								const alignments = attributes.tabsTitleAlignment.slice(0);
								setAttributes({
									tabsTitle: arrayMove(titleItems, oldIndex, newIndex),
									tabsTitleAlignment: arrayMove(alignments, oldIndex, newIndex),
									activeTab: newIndex,
								});

								moveBlockToPosition(
									tabs.filter((tab) => tab.attributes.index === oldIndex)[0]
										.clientId,
									this.props.block.clientId,
									this.props.block.clientId,
									newIndex
								);

								setAttributes({
									activeControl: `tab-title-${newIndex}`,
									activeTab: newIndex,
								});

								tabs.forEach((tab, i) => {
									updateBlockAttributes(tab.clientId, {
										isActive: oldIndex === i,
									});
								});
							}}
							onRemoveTitle={(i) => {
								setAttributes({
									tabsTitle: [
										...tabsTitle.slice(0, i),
										...tabsTitle.slice(i + 1),
									],
									tabsTitleAlignment: [
										...tabsTitleAlignment.slice(0, i),
										...tabsTitleAlignment.slice(i + 1),
									],
									activeTab: 0,
									tabsAnchor: useAnchors
										? [...tabsAnchor.slice(0, i), ...tabsAnchor.slice(i + 1)]
										: [],
								});

								removeBlock(
									tabs.filter((tab) => tab.attributes.index === i)[0].clientId
								);

								showControls("tab-title", 0);
							}}
							onAddTab={addTab}
							toggleTitle={showControls}
							useDragHandle={true}
							onChangeTitle={(content, i) => {
								setAttributes({
									tabsTitle: [
										...attributes.tabsTitle.slice(0, i),
										content,
										...attributes.tabsTitle.slice(i + 1),
									],
								});
							}}
							toggleTitle={showControls}
							onAddTab={addTab}
						/>
					</div>
					<div
						className={`${className}-tabs-content ${
							this.props.attributes.tabVertical ? "vertical-content-width" : ""
						}`}
					>
						<InnerBlocks
							templateLock={false}
							allowedBlocks={["ub/tab-block"]}
							template={[["ub/tab-block"]]}
						/>
					</div>
				</div>
			</div>,
		];
	}
}
