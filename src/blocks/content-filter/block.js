import { OldPanelContent, NewPanelContent } from "./components/editorDisplay";

import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";
import { InnerBlocks, RichText } from "@wordpress/blockEditor";

import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import metadata from "./block.json";
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
	padding: {
		type: "object",
		default: {},
	},
	margin: {
		type: "object",
		default: {},
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
				ownProps.clientId,
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
			f.canUseMultiple ? Array(f.filters.length).fill(false) : -1,
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

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	attributes: metadata.attributes,
	example: {
		attributes: {
			filterArray: [
				{
					category: "First Category",
					filters: ["Filter One", " Filter Two"],
					canUseMultiple: true,
				},
				{
					category: "Second Category",
					filters: ["Filter One", " Filter Two"],
					canUseMultiple: false,
				},
			],
		},
	},
	transforms: {
		to: [
			{
				type: "block",
				blocks: "core/group",
				transform: (_, innerBlocks) =>
					createBlock(
						"core/group",
						{},
						innerBlocks.map((i) =>
							createBlock("core/group", {}, i.innerBlocks),
						),
					),
			},
		],
	},

	edit: NewPanelContent,

	save: () => <InnerBlocks.Content />,
});
