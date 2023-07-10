/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
/**
 * Custom Imports
 */
import Placeholder from "./components/Placeholder";
import { Modal } from "@wordpress/components";
import { invoke, get, isEmpty } from "lodash";

import IconsLibrary from "./components/icon-library";
import { ultimateIcons } from "./icons";
import CustomBlockControls from "./block-controls";

function Edit(props) {
	const [isLibraryOpen, setLibraryOpen] = useState(false);
	const {
		className,
		setAttributes,
		attributes: { icon, svgIcon },
	} = props;

	const finalIcon =
		ultimateIcons
			.find((obj) => obj.type === icon?.type)
			?.icons?.find((ic) => ic.name === icon.iconName) ?? "";
	const hasIcon = !isEmpty(icon);

	return (
		<div className={className}>
			{!hasIcon && isEmpty(svgIcon) && (
				<Placeholder setLibraryOpen={setLibraryOpen} />
			)}
			{hasIcon && <div className="ub_icon">{finalIcon?.icon}</div>}
			{isLibraryOpen && (
				<Modal
					isFullScreen
					className="ub_icons_library_modal"
					title={__("Icons", "ultimate-blocks")}
					onRequestClose={() => setLibraryOpen(false)}
				>
					<IconsLibrary
						value={icon?.name}
						onSelect={(newIcon) => {
							setAttributes({ icon: newIcon });
							setLibraryOpen(false);
						}}
					/>
				</Modal>
			)}
			{hasIcon && <CustomBlockControls onSelect={() => setLibraryOpen(true)} />}
		</div>
	);
}
export default Edit;
