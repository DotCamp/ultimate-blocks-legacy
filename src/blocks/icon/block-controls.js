/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { ToolbarGroup, ToolbarDropdownMenu } from "@wordpress/components";
import {
	BlockControls,
	useBlockEditContext,
	JustifyContentControl,
} from "@wordpress/block-editor";
import CustomLinkControl from "./components/LinkControl";
import IconReplaceControl from "./components/MediaReplaceControl";

function CustomBlockControls({ onReset, onLibraryOpen, onCustomInserterOpen }) {
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
			<CustomLinkControl
				attributes={attributes}
				setAttributes={setAttributes}
			/>
			<ToolbarGroup>
				<IconReplaceControl
					onReset={onReset}
					onLibraryOpen={onLibraryOpen}
					onCustomInserterOpen={onCustomInserterOpen}
				/>
			</ToolbarGroup>
		</BlockControls>
	);
}
export default CustomBlockControls;
