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
import { getClasses, getStyles } from "./get-styles";
import CustomInspectorControls from "./inspector";
import CustomBlockControls from "./block-controls";
import Placeholder from "./components/Placeholder";
import IconsLibrary from "./components/icon-library";
import CustomInserterModal from "./components/CustomSvgInserter";
import { useBlockProps } from "@wordpress/block-editor";

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
	const blockProps = useBlockProps({
		style: getStyles(props.attributes),
		className: getClasses(props.attributes),
	});
	const finalIcon = hasIcon
		? ultimateIcons
				.find((obj) => obj.type === icon?.type)
				?.icons?.find((ic) => ic.name === icon.iconName)?.icon ?? ""
		: svgIcon;

	const customInserterProps = {
		attributes: props.attributes,
		setAttributes,
		isCustomInserterOpen,
		setCustomInserterOpen,
	};

	return (
		<div {...blockProps}>
			{!hasIcon && !hasSVGIcon && (
				<Placeholder
					setCustomInserterOpen={setCustomInserterOpen}
					setLibraryOpen={setLibraryOpen}
				/>
			)}
			{hasSVGIcon && !hasIcon && (
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
							setAttributes({ icon: newIcon, svgIcon: "" });
							setLibraryOpen(false);
						}}
					/>
				</Modal>
			)}
			{isCustomInserterOpen && <CustomInserterModal {...customInserterProps} />}
			{(hasIcon || hasSVGIcon) && (
				<CustomBlockControls
					onReset={() =>
						setAttributes({
							icon: {},
							svgIcon: "",
						})
					}
					onLibraryOpen={() => setLibraryOpen(true)}
					onCustomInserterOpen={() => setCustomInserterOpen(true)}
				/>
			)}
			<CustomInspectorControls {...props} />
		</div>
	);
}
export default Edit;
