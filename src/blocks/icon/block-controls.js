/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";

function CustomBlockControls({ onSelect }) {
	return (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton onClick={onSelect}>
					{__("Replace Icon", "ultimate-blocks")}
				</ToolbarButton>
			</ToolbarGroup>
		</BlockControls>
	);
}
export default CustomBlockControls;
