import { useBlockProps } from "@wordpress/block-editor";

function Save(props) {
	const {
		startNumber,
		endNumber,
		prefix,
		suffix,
		animationDuration,
		alignment,
	} = props.attributes;

	const blockProps = useBlockProps.save({
		className: "ub_counter-container",
	});

	return (
		<div {...blockProps}>
			<div
				className={`ub_counter ub_text-${alignment}`}
				data-start_num={startNumber}
				data-end_num={endNumber}
				data-animation_duration={animationDuration}
			>
				<span className="ub_counter-prefix">{prefix}</span>
				<span className="ub_counter-number">0</span>
				<span className="ub_counter-suffix">{suffix}</span>
			</div>
		</div>
	);
}

export default Save;
