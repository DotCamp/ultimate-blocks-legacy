const { __ } = wp.i18n;

const { registerBlockType, createBlock } = wp.blocks;

const { withState, compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

import { EmptyStar, BlockIcon, FullStar } from "./icons";
import {
	oldAttributes,
	version_1_1_2,
	version_1_1_5,
	version_2_0_0,
	updateFrom,
} from "./oldVersions";
import { blockControls, inspectorControls, editorDisplay } from "./components";
import { mergeRichTextArray, upgradeButtonLabel } from "../../common";

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	starCount: {
		type: "number",
		default: 5,
	},
	starSize: {
		type: "number",
		default: 20,
	},
	starColor: {
		type: "string",
		default: "#FFB901", //previous defaut is #ffff00, new default is #ffb901, seet in uppercase to facilitate reverse compatibility
	},
	selectedStars: {
		type: "number",
		default: 0,
	},
	reviewText: {
		type: "string",
		default: "",
	},
	reviewTextAlign: {
		type: "string",
		default: "text",
	},
	reviewTextColor: {
		type: "string",
		default: "",
	},
	starAlign: {
		type: "string",
		default: "left",
	},
};

registerBlockType("ub/star-rating", {
	title: __("Star Rating"),
	icon: BlockIcon,
	category: "ultimateblocks",

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
		withState({ highlightedStars: 0 }),
	])(function (props) {
		const { isSelected, block, replaceBlock, attributes } = props;

		return [
			isSelected && blockControls(props),
			isSelected && inspectorControls(props),
			<div className="ub-star-rating">
				<button
					onClick={() => {
						const { reviewText, ...otherAttributes } = attributes;
						replaceBlock(
							block.clientId,
							createBlock(
								"ub/star-rating-block",
								Object.assign(otherAttributes, {
									reviewText: mergeRichTextArray(reviewText),
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
			starCount,
			starSize,
			starColor,
			selectedStars,
			reviewText,
			reviewTextAlign,
			starAlign,
		} = props.attributes;
		return (
			<div className="ub-star-rating">
				<div
					className="ub-star-outer-container"
					style={{
						justifyContent:
							starAlign === "center"
								? "center"
								: `flex-${starAlign === "left" ? "start" : "end"}`,
					}}
				>
					<div className="ub-star-inner-container">
						{[...Array(starCount)].map((e, i) => (
							<div key={i}>
								{i < selectedStars ? (
									<FullStar size={starSize} fillColor={starColor} />
								) : (
									<EmptyStar size={starSize} />
								)}
							</div>
						))}
					</div>
				</div>
				<div className="ub-review-text" style={{ textAlign: reviewTextAlign }}>
					{reviewText}
				</div>
			</div>
		);
	},

	deprecated: [
		updateFrom(version_1_1_2),
		updateFrom(version_1_1_5),
		updateFrom(version_2_0_0),
	],
});

registerBlockType("ub/star-rating-block", {
	title: __("Star Rating"),
	icon: BlockIcon,
	category: "ultimateblocks",

	attributes,

	edit: compose([
		withState({ highlightedStars: 0 }),
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
	])(function (props) {
		const {
			isSelected,
			block,
			getBlock,
			getClientIdsWithDescendants,
			attributes: { starColor, blockID },
			setAttributes,
		} = props;

		if (blockID === "") {
			setAttributes({
				blockID: block.clientId,
				starColor: "#ffb901",
			});
		} else if (
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && blockControls(props),
			isSelected && inspectorControls(props),
			<div className="ub-star-rating">{editorDisplay(props)}</div>,
		];
	}),
	save: () => null,
});
