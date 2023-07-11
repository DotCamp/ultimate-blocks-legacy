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
import CustomInserterModal from "./components/CustomSvgInserter";

function Edit(props) {
	const [isLibraryOpen, setLibraryOpen] = useState(false);
	const [isCustomInserterOpen, setCustomInserterOpen] = useState(false);
	const {
		className,
		setAttributes,
		attributes: { icon, svgIcon },
	} = props;
	const hasIcon = !isEmpty(icon);
	const hasSVGIcon = !isEmpty(svgIcon);

	const finalIcon = hasIcon
		? ultimateIcons
				.find((obj) => obj.type === icon?.type)
				?.icons?.find((ic) => ic.name === icon.iconName)?.icon ?? ""
		: svgIcon;

	const blockStyles = getStyles(props.attributes);

	const customInserterProps = {
		attributes: props.attributes,
		setAttributes,
		isCustomInserterOpen,
		setCustomInserterOpen,
	};

	return (
		<div className={className} style={blockStyles}>
			{!hasIcon && !hasSVGIcon && (
				<Placeholder
					setCustomInserterOpen={setCustomInserterOpen}
					setLibraryOpen={setLibraryOpen}
				/>
			)}
			{hasSVGIcon && (
				<div
					className="ub_icon"
					dangerouslySetInnerHTML={{ __html: finalIcon }}
				></div>
			)}
			{hasIcon && <div className="ub_icon">{finalIcon}</div>}
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
			{isCustomInserterOpen && <CustomInserterModal {...customInserterProps} />}
			{(hasIcon || hasSVGIcon) && (
				<CustomBlockControls onSelect={() => setLibraryOpen(true)} />
			)}
			<CustomInspectorControls {...props} />
		</div>
	);
}
export default Edit;
