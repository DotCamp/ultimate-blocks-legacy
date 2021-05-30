import info from "./icons/info";
import success from "./icons/success";
import warning from "./icons/warning";

const { RichText, BlockControls } = wp.blockEditor || wp.editor;

const { ToolbarGroup, ToolbarButton } = wp.components;

const { __ } = wp.i18n;

const { createBlock } = wp.blocks;

export const blockControls = (props) => {
	const { setAttributes } = props;

	const { align } = props.attributes;
	return (
		<BlockControls>
			<ToolbarGroup className="components-toolbar">
				<ToolbarButton
					className="components-icon-button components-toolbar-control"
					onClick={() =>
						setAttributes({
							ub_selected_notify: "ub_notify_info",
						})
					}
				>
					{info}
				</ToolbarButton>
				<ToolbarButton
					className="components-icon-button components-toolbar-control"
					onClick={() =>
						setAttributes({
							ub_selected_notify: "ub_notify_success",
						})
					}
				>
					{success}
				</ToolbarButton>
				<ToolbarButton
					className="components-icon-button components-toolbar-control"
					onClick={() =>
						setAttributes({
							ub_selected_notify: "ub_notify_warning",
						})
					}
				>
					{warning}
				</ToolbarButton>
			</ToolbarGroup>
			<ToolbarGroup>
				{["left", "center", "right", "justify"].map((a) => (
					<ToolbarButton
						icon={`editor-${a === "justify" ? a : "align" + a}`}
						label={__(
							(a !== "justify" ? "Align " : "") +
								a[0].toUpperCase() +
								a.slice(1)
						)}
						isActive={align === a}
						onClick={() => setAttributes({ align: a })}
					/>
				))}
			</ToolbarGroup>
		</BlockControls>
	);
};

export const editorDisplay = (props) => {
	const { setAttributes } = props;

	const { align, ub_selected_notify, ub_notify_info } = props.attributes;
	return (
		<RichText
			style={{ textAlign: align }}
			tagName="div"
			placeholder={__("Add Your Content Here")}
			allowedFormats={["core/bold", "core/italic", "core/link", "core/strikethrough"]}
			className={ub_selected_notify}
			onChange={(value) => setAttributes({ ub_notify_info: value })}
			value={ub_notify_info}
			keepPlaceholderOnFocus={true}
		/>
	);
};

export const upgradeToStyledBox = (attributes) => {
	let firstColor;
	let secondColor;
	switch (attributes.ub_selected_notify) {
		case "ub_notify_success":
			[firstColor, secondColor] = ["#3c763d", "#dff0d8"];
			break;
		case "ub_notify_warning":
			[firstColor, secondColor] = ["#d8000c", "#ffd2d2"];
			break;
		case "ub_notify_info":
		default:
			[firstColor, secondColor] = ["#31708f", "#d9edf7"];
			break;
	}
	return createBlock("ub/styled-box", {
		mode: "notification",
		text: [attributes.ub_notify_info],
		textAlign: [attributes.align],
		backColor: secondColor,
		foreColor: firstColor,
		outlineColor: firstColor,
	});
};
