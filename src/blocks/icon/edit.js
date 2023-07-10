/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { Modal } from "@wordpress/components";
/**
 * Custom Imports
 */
import { ultimateIcons } from "./icons";
import { getStyles } from "./get-styles";
import CustomInspectorControls from "./inspector";
import CustomBlockControls from "./block-controls";
import Placeholder from "./components/Placeholder";
import IconsLibrary from "./components/icon-library";

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

	const blockStyles = getStyles(props.attributes);

	return (
		<div className={className} style={blockStyles}>
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
						value={finalIcon?.name}
						onSelect={(newIcon) => {
							setAttributes({ icon: newIcon });
							setLibraryOpen(false);
						}}
					/>
				</Modal>
			)}
			{hasIcon && <CustomBlockControls onSelect={() => setLibraryOpen(true)} />}
			<CustomInspectorControls {...props} />
		</div>
	);
}
export default Edit;
