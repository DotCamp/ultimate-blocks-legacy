import {
	__experimentalFontAppearanceControl as WPFontAppearanceControl,
	useBlockEditContext,
} from "@wordpress/block-editor";
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	BaseControl,
} from "@wordpress/components";

function FontAppearanceControl({
	attrKey,
	label,
	showDefault,
	isSingle = true,
}) {
	const { clientId } = useBlockEditContext();
	const attributes = useSelect(
		(select) => select("core/block-editor").getSelectedBlock().attributes,
	);
	const { updateBlockAttributes } = useDispatch("core/block-editor");
	const setAttributes = (newAttributes) => {
		updateBlockAttributes(clientId, newAttributes);
	};
	return (
		<ToolsPanelItem
			className={isSingle ? "single-column" : ""}
			panelId={clientId}
			isShownByDefault={showDefault}
			resetAllFilter={() =>
				setAttributes({
					[attrKey]: {},
				})
			}
			label={label}
			hasValue={() => !isEmpty(attributes[attrKey])}
			onDeselect={() => {
				setAttributes({ [attrKey]: "" });
			}}
		>
			<BaseControl label={label}>
				<div className="ub-hide-label">
					<WPFontAppearanceControl
						size={"__unstable-large"}
						value={attributes[attrKey]}
						onChange={(newValue) => setAttributes({ [attrKey]: newValue })}
					/>
				</div>
			</BaseControl>
		</ToolsPanelItem>
	);
}

export default FontAppearanceControl;
