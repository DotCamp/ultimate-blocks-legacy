/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	MenuGroup,
	MenuItem,
	DropdownMenu,
	ToolbarDropdownMenu,
} from "@wordpress/components";
import { code } from "@wordpress/icons";
import { blockIcon } from "../icons/block-icon";

function IconReplaceControl({ onReset, onLibraryOpen, onCustomInserterOpen }) {
	return (
		<DropdownMenu
			icon=""
			popoverProps={{
				className: "outermost-ultimate-blocks__replace-popover is-alternate",
			}}
			text={__("Replace", "ultimate-blocks")}
		>
			{({ onClose }) => (
				<>
					<MenuGroup>
						<MenuItem
							onClick={() => {
								onLibraryOpen();
								onClose(true);
							}}
							icon={blockIcon}
						>
							{__("Open Icon Library", "ultimate-blocks")}
						</MenuItem>

						<MenuItem
							onClick={() => {
								onCustomInserterOpen();
								onClose(true);
							}}
							icon={code}
						>
							{__("Change Custom SVG", "ultimate-blocks")}
						</MenuItem>
					</MenuGroup>
					<MenuGroup>
						<MenuItem
							onClick={() => {
								onReset();
								onClose(true);
							}}
						>
							{__("Clear icon", "ultimate-blocks")}
						</MenuItem>
					</MenuGroup>
				</>
			)}
		</DropdownMenu>
	);
}
export default IconReplaceControl;
