import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
	useBlockProps,
	BlockControls,
	AlignmentToolbar,
	RichText,
} from "@wordpress/block-editor";

import Inspector from "./inspector";
import { getStyles } from "./get-styles";
import { useCounter } from "./hooks/use-counter";

function Edit(props) {
	const { attributes, setAttributes } = props;
	let counter = useCounter(attributes);
	const { endNumber, prefix, suffix, alignment, label, labelPosition } =
		attributes;
	const blockProps = useBlockProps({
		className: `ub_counter-container`,
		style: getStyles(attributes),
	});

	return (
		<div {...blockProps}>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(newValue) => setAttributes({ alignment: newValue })}
				/>
			</BlockControls>
			<div className={`ub_counter ub_text-${alignment}`}>
				{labelPosition === "top" && (
					<div className="ub_counter-label-wrapper">
						<RichText
							tagName="span"
							value={label}
							placeholder={__("Add a Label", "ultimate-blocks")}
							className="ub_counter-label"
							onChange={(newLabel) => setAttributes({ label: newLabel })}
						/>
					</div>
				)}
				<div className="ub_counter-number-wrapper">
					<span className="ub_counter-prefix">{prefix}</span>
					<span className="ub_counter-number">{counter}</span>
					<span className="ub_counter-suffix">{suffix}</span>
				</div>
				{labelPosition === "bottom" && (
					<div className="ub_counter-label-wrapper">
						<RichText
							tagName="span"
							value={label}
							placeholder={__("Add a Label", "ultimate-blocks")}
							className="ub_counter-label"
							onChange={(newLabel) => setAttributes({ label: newLabel })}
						/>
					</div>
				)}
			</div>
			<Inspector {...props} />
		</div>
	);
}

export default Edit;
