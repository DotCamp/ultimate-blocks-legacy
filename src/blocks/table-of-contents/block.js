import icon from "./icon";
import TableOfContents, {
	inspectorControls,
	blockControls,
	editorDisplay,
} from "./components";
import {
	version_1_0_8,
	version_1_0_9,
	version_1_1_3,
	version_1_1_5,
	version_1_1_6,
	version_1_1_8,
	version_2_0_0,
	oldAttributes,
	updateFrom,
} from "./oldVersions";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType, createBlock } = wp.blocks;
const { ToggleControl, PanelRow, PanelBody, CheckboxControl } = wp.components;

const { InspectorControls, RichText } = wp.blockEditor || wp.editor;

const { withDispatch, withSelect } = wp.data;

const { withState, compose } = wp.compose;

import { upgradeButtonLabel, mergeRichTextArray } from "../../common";

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	title: {
		type: "string",
		default: "",
	},
	allowedHeaders: {
		type: "array",
		default: Array(6).fill(true),
	},
	links: {
		type: "string",
		default: "",
	},
	gaps: {
		type: "array",
		default: [],
	},
	allowToCHiding: {
		type: "boolean",
		default: false,
	},
	hideOnMobile: {
		type: "boolean",
		default: false,
	},
	showList: {
		type: "boolean",
		default: true,
	},
	numColumns: {
		type: "number",
		default: 1,
	},
	listStyle: {
		type: "string",
		default: "bulleted", //other options: numbered, plain
	},
	enableSmoothScroll: {
		type: "boolean",
		default: false,
	},
	titleAlignment: {
		type: "string",
		default: "left",
	},
	allowToLatin: {
		type: "boolean",
		default: false,
	},
	removeDiacritics: {
		type: "boolean",
		default: false,
	},
	scrollOption: {
		type: "string",
		default: "auto", //other options: namedelement, fixedamount, off
	},
	scrollOffset: {
		type: "number",
		default: 0,
	},
	scrollTarget: {
		type: "string",
		default: "",
	},
	scrollTargetType: {
		type: "string",
		default: "id", //other types: class, element
	},
	titleColor: {
		type: "string",
		default: "",
	},
	titleBackgroundColor: {
		type: "string",
		default: "",
	},
	listColor: {
		//must override link color in both frontend and editor
		type: "string",
		default: "",
	},
	listBackgroundColor: {
		type: "string",
		default: "",
	},
	listIconColor: {
		type: "string",
		default: "",
	},
};

registerBlockType("ub/table-of-contents", {
	title: __("Table of Contents"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Table of Contents"), __("Ultimate Blocks")],

	attributes: oldAttributes,

	supports: {
		inserter: false,
	},

	edit: compose([
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId
			),
		})),
		withDispatch((dispatch) => ({
			replaceBlock: (dispatch("core/block-editor") || dispatch("core/editor"))
				.replaceBlock,
		})),
	])(function (props) {
		const { block, replaceBlock, isSelected, attributes, setAttributes } =
			props;
		const { allowedHeaders, showList, allowToCHiding } = attributes;
		return [
			isSelected && (
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
									onChange={() => setAttributes({ showList: !showList })}
								/>
							</PanelRow>
						)}
					</PanelBody>
				</InspectorControls>
			),
			isSelected && blockControls(props),
			<div className="ub_table-of-contents">
				<button
					onClick={() => {
						const { title, ...otherAttributes } = props.attributes;
						replaceBlock(
							block.clientId,
							createBlock(
								"ub/table-of-contents-block",
								Object.assign(otherAttributes, {
									title: mergeRichTextArray(title),
								})
							)
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				{editorDisplay(props)}
			</div>,
		];
	}),

	save(props) {
		const {
			links,
			title,
			allowedHeaders,
			showList,
			numColumns,
			allowToCHiding,
			listStyle,
		} = props.attributes;
		return (
			<div
				className="ub_table-of-contents"
				data-showText={__("show")}
				data-hideText={__("hide")}
			>
				{(title.length > 1 || (title.length === 1 && title[0] !== "")) && (
					<div className="ub_table-of-contents-header">
						<RichText.Content
							tagName="div"
							className="ub_table-of-contents-title"
							value={title}
						/>
						{allowToCHiding && (
							<div id="ub_table-of-contents-header-toggle">
								<div id="ub_table-of-contents-toggle">
									[
									<a className="ub_table-of-contents-toggle-link" href="#">
										{showList ? __("hide") : __("show")}
									</a>
									]
								</div>
							</div>
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
							(title.length === 1 && title[0] === "")
								? "block"
								: "none",
					}}
					allowedHeaders={allowedHeaders}
					headers={links && JSON.parse(links)}
				/>
			</div>
		);
	},
	deprecated: [
		updateFrom(version_1_0_8),
		updateFrom(version_1_0_9),
		updateFrom(version_1_1_3),
		updateFrom(version_1_1_5),
		updateFrom(version_1_1_6),
		updateFrom(version_1_1_8),
		updateFrom(version_2_0_0),
	],
});

registerBlockType("ub/table-of-contents-block", {
	title: __("Table of Contents"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Table of Contents"), __("Ultimate Blocks")],
	attributes,
	supports: {
		reusable: false,
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
		withState({ canRemoveItemFocus: false }),
	])(function (props) {
		const {
			isSelected,
			block,
			attributes: { blockID, showList },
			getBlock,
			getClientIdsWithDescendants,
		} = props;

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			props.setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && inspectorControls(props),
			isSelected && blockControls(props),
			<div
				className={`ub_table-of-contents${
					showList ? "" : " ub_table-of-contents-collapsed"
				}`}
				id={`ub_table-of-contents-${blockID}`}
			>
				{editorDisplay(props)}
			</div>,
		];
	}),
	save: () => null,
});
