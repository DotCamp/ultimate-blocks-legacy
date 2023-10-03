import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	BlockControls,
	AlignmentToolbar,
} from "@wordpress/block-editor";

import Inspector from "./inspector";

function Edit(props) {
	const { attributes, setAttributes } = props;

	const { endNumber, prefix, suffix, alignment } = attributes;
	const blockProps = useBlockProps({
		className: `ub_counter-container`,
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
				<span className="ub_counter-prefix">{prefix}</span>
				<span className="ub_counter-number">{endNumber}</span>
				<span className="ub_counter-suffix">{suffix}</span>
			</div>
			<Inspector {...props} />
		</div>
	);
}

export default Edit;
