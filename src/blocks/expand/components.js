import { useEffect } from "react";
import { getDescendantBlocks } from "../../common";

const { __ } = wp.i18n;
const { InnerBlocks } = wp.blockEditor || wp.editor;
const { useSelect } = wp.data;

export function ExpandRoot(props) {
	const {
		block,
		updateBlockAttributes,
		attributes,
		setAttributes,
		getBlock,
		getClientIdsWithDescendants,
	} = props;

	const { blockID } = attributes;

	const selectedBlockID = useSelect((select) => {
		return (
			select("core/block-editor") || select("core/editor")
		).getSelectedBlockClientId();
	}, []);

	useEffect(() => {
		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					ID !== block.clientId &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

	const showPreviewText = __("show more");

	const hidePreviewText = __("show less");

	const fullVersionVisibility =
		selectedBlockID === block.clientId ||
		getDescendantBlocks(block)
			.map((b) => b.clientId)
			.includes(selectedBlockID);

	if (
		block.innerBlocks[1] &&
		block.innerBlocks[1].attributes.isVisible !== fullVersionVisibility
	) {
		updateBlockAttributes(block.innerBlocks[1].clientId, {
			isVisible: fullVersionVisibility,
		});
	}

	return (
		<div className="ub-expand">
			<InnerBlocks
				templateLock={"all"}
				template={[
					[
						"ub/expand-portion",
						{
							displayType: "partial",
							clickText: showPreviewText,
							isVisible: true,
						},
					],
					[
						"ub/expand-portion",
						{
							displayType: "full",
							clickText: hidePreviewText,
							isVisible: false,
						},
					],
				]}
			/>
		</div>
	);
}
