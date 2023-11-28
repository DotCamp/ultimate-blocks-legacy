/**
 * WordPress dependencies
 */
import { SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

function UBSelectControl({ label, value, onChange = () => {}, options }) {
	const displayValue = value ?? "auto";
	return (
		<SelectControl
			label={label}
			value={displayValue}
			options={options}
			onChange={onChange}
			size={"__unstable-large"}
			__nextHasNoMarginBottom
		/>
	);
}
export default UBSelectControl;
