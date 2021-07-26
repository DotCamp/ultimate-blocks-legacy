import { OldPanelContent, PanelContent } from "./components/editorDisplay";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { InnerBlocks, RichText } = wp.blockEditor || wp.editor;

const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

import icon from "./icon";

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	filterArray: {
		type: "array",
		default: [], // new objects should be { category: '', filters: [], canUseMultiple: false }
	},
	buttonColor: {
		type: "string",
		default: "#eeeeee",
	},
	buttonTextColor: {
		type: "string",
		default: "",
	},
	activeButtonColor: {
		type: "string",
		default: "#fcb900",
	},
	activeButtonTextColor: {
		type: "string",
		default: "",
	},
	initiallyShowAll: {
		type: "boolean",
		default: true,
	},
	matchingOption: {
		type: "string",
		default: "", //options: matchAny (default), matchAll
	},
	/*,allowReset: {
        type: 'boolean',
        default: false
    },
    resetButtonLabel: {
        type: 'string',
        default: 'Reset'
    }*/
};

registerBlockType("ub/content-filter", {
	title: __("Content Filter"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Filtering")],
	attributes,
	supports: { inserter: false },

	edit: compose([
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId
			),
		})),
		withDispatch((dispatch) => {
			const { updateBlockAttributes, insertBlock, replaceBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
				replaceBlock,
			};
		}),
	])(OldPanelContent),

	save(props) {
		const {
			filterArray,
			buttonColor,
			buttonTextColor,
			activeButtonColor,
			activeButtonTextColor,
			//,allowReset,resetButtonLabel
		} = props.attributes;

		const currentSelection = filterArray.map((f) =>
			f.canUseMultiple ? Array(f.filters.length).fill(false) : -1
		);
		return (
			<div data-currentSelection={JSON.stringify(currentSelection)}>
				{filterArray.length > 0 &&
					filterArray.map((f, i) => (
						<div
							className="ub-content-filter-category"
							data-canUseMultiple={f.canUseMultiple}
						>
							<RichText.Content
								tagName="div"
								className="ub-content-filter-category-name"
								value={f.category}
							/>
							{f.filters.map((filter, j) => (
								<div
									data-tagIsSelected={"false"} //can be updated
									data-categoryNumber={i}
									data-filterNumber={j}
									data-normalColor={buttonColor}
									data-normalTextColor={buttonTextColor}
									data-activeColor={activeButtonColor}
									data-activeTextColor={activeButtonTextColor}
									className="ub-content-filter-tag"
									style={{
										backgroundColor: buttonColor,
										color: buttonTextColor,
									}}
								>
									<RichText.Content value={filter} />
								</div>
							))}
						</div>
					))}
				{/*allowReset && (
					<button className="ub-content-filter-reset">
						{resetButtonLabel}
					</button>
                )*/}
				<InnerBlocks.Content />
			</div>
		);
	},
});

registerBlockType("ub/content-filter-block", {
	title: __("Content Filter"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Filtering")],
	attributes,

	transforms: {
		to: [
			{
				type: "block",
				blocks: "core/group",
				transform: (_, innerBlocks) =>
					createBlock(
						"core/group",
						{},
						innerBlocks.map((i) => createBlock("core/group", {}, i.innerBlocks))
					),
			},
		],
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
		withDispatch((dispatch) => {
			const { updateBlockAttributes, insertBlock } =
				dispatch("core/block-editor") || dispatch("core/editor");

			return {
				updateBlockAttributes,
				insertBlock,
			};
		}),
	])(PanelContent),

	save: () => <InnerBlocks.Content />,
});
