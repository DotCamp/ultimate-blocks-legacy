/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import {
	BlockControls,
	useBlockEditContext,
	JustifyContentControl,
} from "@wordpress/block-editor";

function CustomBlockControls({ onSelect }) {
	const { clientId } = useBlockEditContext();

	const block = useSelect((select) =>
		select("core/block-editor").getBlock(clientId)
	);
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const attributes = block?.attributes;
	const setAttributes = (newAttributes) =>
		updateBlockAttributes(clientId, newAttributes);
	return (
		<BlockControls>
			<ToolbarGroup>
				<JustifyContentControl
					value={attributes.justification}
					allowedControls={["left", "center", "right"]}
					onChange={(next) => {
						setAttributes({ justification: next });
					}}
				/>
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarButton onClick={onSelect}>
					{__("Replace Icon", "ultimate-blocks")}
				</ToolbarButton>
			</ToolbarGroup>
		</BlockControls>
	);
}
export default CustomBlockControls;
