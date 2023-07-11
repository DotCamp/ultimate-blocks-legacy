/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { Placeholder as WPPlaceHolder, Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { useBlockEditContext } from "@wordpress/block-editor";

/**
 * Custom import
 */
import { blockIcon } from "../icons/block-icon";
function Placeholder(props) {
	const { setLibraryOpen, setCustomInserterOpen } = props;
	return (
		<WPPlaceHolder
			icon={blockIcon}
			className="ub_icon_placeholder"
			label={__("Icon", "ultimate-blocks")}
			instructions={__(
				"Choose an icon from the library or insert custom svg",
				"ultimate-blocks"
			)}
		>
			<div className="ub_placeholder_inner_wrapper">
				<Button variant="primary" onClick={() => setLibraryOpen(true)}>
					{__("Icon Library", "ultimate-blocks")}
				</Button>
				<Button variant="tertiary" onClick={() => setCustomInserterOpen(true)}>
					{__("Insert Custom SVG", "ultimate-blocks")}
				</Button>
			</div>
		</WPPlaceHolder>
	);
}

export default Placeholder;
