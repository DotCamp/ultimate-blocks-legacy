import { __ } from "@wordpress/i18n";
import metadata from "./block.json";
import { registerBlockType, createBlock } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, useSelect } from "@wordpress/data";
import { getStyles } from "./get-styles";
import { EmptyStar, BlockIcon, FullStar } from "./icons";
import {
	oldAttributes,
	version_1_1_2,
	version_1_1_5,
	version_2_0_0,
	updateFrom,
} from "./oldVersions";
import { blockControls, inspectorControls, editorDisplay } from "./components";
import {
	mergeRichTextArray,
	upgradeButtonLabel,
	getParentBlock,
} from "../../common";
import { useState, useEffect } from "react";

function OldStarRating(props) {
	const [highlightedStars, setHighlightedStars] = useState(0);

	const { isSelected, block, replaceBlock, attributes } = props;

	return (
		<>
			{isSelected && blockControls(props)}
			{isSelected && inspectorControls(props)}
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
								}),
							),
						);
					}}
				>
					{upgradeButtonLabel}
				</button>
				{editorDisplay({ ...props, highlightedStars, setHighlightedStars })}
			</div>
		</>
	);
}

function StarRating(props) {
	const [highlightedStars, setHighlightedStars] = useState(0);
	const {
		isSelected,
		attributes: { starColor, blockID, textPosition, starAlign },
		setAttributes,
	} = props;
	const { block, rootBlockClientId } = useSelect((select) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(props.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			rootBlockClientId,
		};
	});

	useEffect(() => {
		if (blockID === "") {
			setAttributes({
				blockID: block.clientId,
				starColor: "#ffb901",
			});
		}
	});
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const blockProps = useBlockProps();
	const styles = getStyles(props.attributes);
	const alignClass =
		starAlign !== "" ? ` ub-star-rating-align-${starAlign}` : "";
	return (
		<div {...blockProps}>
			{isSelected && blockControls(props)}
			{isSelected && inspectorControls(props)}
			<div
				className={`ub-star-rating ub-star-rating-text-${textPosition}${alignClass}`}
				style={styles}
			>
				{editorDisplay({ ...props, highlightedStars, setHighlightedStars })}
			</div>
		</div>
	);
}

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
				ownProps.clientId,
			),
		})),
		withDispatch((dispatch) => ({
			replaceBlock: (dispatch("core/block-editor") || dispatch("core/editor"))
				.replaceBlock,
		})),
	])(OldStarRating),

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

registerBlockType(metadata.name, {
	...metadata,
	icon: BlockIcon,
	attributes: metadata.attributes,
	example: {
		attributes: {
			selectedStars: 4,
		},
	},
	edit: StarRating,
	save: () => null,
});
