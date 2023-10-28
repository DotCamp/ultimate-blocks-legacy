/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";
import { useBlockEditContext } from "@wordpress/block-editor";
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

/**
 *
 * @param {string} label - Group control label
 * @param {Array} options - Group control available options
 * @param {string} attributeKey - Attribute key
 * @param {boolean} [isBlock=false] - Toggle group control prop
 * @param {boolean} [isAdaptiveWidth=false] - Toggle group control prop
 */
function CustomToggleGroupControl({
	label,
	options,
	attributeKey,
	isBlock = false,
	isAdaptiveWidth = false,
}) {
	const { clientId } = useBlockEditContext();
	const { updateBlockAttributes } = useDispatch("core/block-editor");

	const attributes = useSelect((select) => {
		return select("core/block-editor").getBlockAttributes(clientId);
	});
	const setAttributes = (newAttributes) =>
		updateBlockAttributes(clientId, newAttributes);

	return (
		<ToggleGroupControl
			label={label}
			isBlock={isBlock}
			isAdaptiveWidth={isAdaptiveWidth}
			__nextHasNoMarginBottom
			value={attributes[attributeKey]}
			onChange={(newValue) => {
				setAttributes({
					[attributeKey]: newValue,
				});
			}}
		>
			{options.map(({ value, icon = null, label }) => {
				return icon ? (
					<ToggleGroupControlOptionIcon
						key={value}
						value={value}
						icon={icon}
						label={label}
					/>
				) : (
					<ToggleGroupControlOption key={value} value={value} label={label} />
				);
			})}
		</ToggleGroupControl>
	);
}

export default CustomToggleGroupControl;
