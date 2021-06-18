import { textTransformOptions, fontWeightOptions } from "../settings-options";

const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { applyFormat, toggleFormat } = wp.richText;
const { InspectorControls, PanelColorSettings, RichTextToolbarButton } =
	wp.blockEditor || wp.editor;
const { PanelBody, RangeControl, SelectControl } = wp.components;
const { withSelect } = wp.data;
const { compose, ifCondition } = wp.compose;

/* methods */
const getAttributesList = (attributesStyle) => {
	const list = {};
	attributesStyle
		.slice(0, -1)
		.split(";")
		.forEach((p) => {
			const attribute = p.split(":");
			list[attribute[0]] = attribute[1];
		});

	return list;
};

const attributesToString = (attributesList) => {
	let str = "";
	for (const attribute in attributesList) {
		str += `${attribute}:${attributesList[attribute]};`;
	}

	return str;
};

/* format name */
let name = "ultimate-blocks/highlight";

/* format edit function */
const highlightEdit = ({ isActive, value, onChange }) => {
	/* get the current selected block */
	const selectedBlock = document.querySelector(".wp-block.is-selected");

	/* set a default style */
	const defaultStyle = "background-color:yellow;";

	/* hooks */
	const [headingFontSize, setHeadingFontSize] = useState(0);
	const [headingFontWeight, setHeadingFontWeight] = useState("Bold");
	const [headingLetterSpacing, setHeadingLetterSpacing] = useState(0);
	const [highlightedElements, setHighlightedElements] = useState(false);
	const [elementsToChange, setElementsToChange] = useState([]);
	const [attributesList, setAttributesList] = useState(
		getAttributesList(defaultStyle)
	);

	/* useEffect */
	useEffect(() => {
		if (elementsToChange.length > 0) {
			const newElementsToChange = [...elementsToChange];
			let currentElementToChange = newElementsToChange.shift();
			setElementsToChange(newElementsToChange);

			let start = currentElementToChange.start;
			let end = currentElementToChange.end;

			onChange(
				applyFormat(
					value,
					{
						type: name,
						attributes: {
							style: attributesToString(attributesList),
							start,
							end,
						},
					},
					parseInt(start),
					parseInt(end)
				)
			);
		}
	}, [elementsToChange]);

	useEffect(() => {
		/* check if there are highlighted elements */
		setHighlightedElements(
			selectedBlock
				? selectedBlock.querySelectorAll(".has-highlight").length > 0
				: false
		);

		/* set default attributes */
		if (highlightedElements) {
			let hasHightlight = selectedBlock.querySelector(".has-highlight");

			if (hasHightlight) {
				let highlightedStyle = hasHightlight.getAttribute("style");

				if (attributesToString(attributesList) !== highlightedStyle) {
					setAttributesList(getAttributesList(highlightedStyle));
				}

				if (!attributesList["font-size"]) {
					setHeadingFontSize(
						window.getComputedStyle(selectedBlock.firstElementChild).fontSize
					);
				}

				if (!attributesList["letter-spacing"]) {
					let parent = window.getComputedStyle(selectedBlock.firstElementChild)
						.letterSpacing;
					setHeadingLetterSpacing(parent !== "normal" ? parent : "0");
				}

				if (!attributesList["font-weight"]) {
					setHeadingFontWeight(
						window.getComputedStyle(selectedBlock.firstElementChild).fontWeight
					);
				}
			}
		}
	});

	/* toggle the highlight format */
	const onToggle = () => {
		const start = value.start.toString();
		const end = value.end.toString();
		onChange(
			toggleFormat(value, {
				type: name,
				attributes: {
					style: attributesToString(attributesList),
					start,
					end,
				},
			})
		);
	};

	/* update the style with the new value */
	const onChangeAttribute = (newValue, attribute) => {
		// Get an array of the highlighted sections to style them
		const { formats } = value;
		let elementsArr = [];
		for (let i = 0; i <= formats.length; i++) {
			if (formats[i]) {
				let formatIndex = formats[i].findIndex(
					(format) => format.type === name
				);
				if (formatIndex !== -1) {
					const start = formats[i][formatIndex].attributes.start;
					const end = formats[i][formatIndex].attributes.end;
					i = end;
					elementsArr.push({
						start,
						end,
					});
				}
			}
		}

		setAttributesList((attributesList) => {
			let newList = { ...attributesList };
			newList[attribute] = newValue;

			setElementsToChange(elementsArr);
			return newList;
		});
	};

	return (
		<>
			<RichTextToolbarButton
				icon="editor-underline"
				title={__("Highlight")}
				onClick={onToggle}
				isActive={isActive}
			/>
			{highlightedElements && (
				<InspectorControls>
					<PanelBody
						title={__("Highlight Settings", "ultimate-blocks")}
						intialOpen={false}
					>
						{/* Background & Text Color */}
						<PanelColorSettings
							title={__("Highlight Colors", "ultimate-blocks")}
							colorSettings={[
								{
									value: attributesList["color"],
									onChange: (newColor) => onChangeAttribute(newColor, "color"),
									label: __("Highlight Text Color", "ultimate-blocks"),
								},
								{
									value: attributesList["background-color"],
									onChange: (newColor) =>
										onChangeAttribute(newColor, "background-color"),
									label: __("Highlight Background Color", "ultimate-blocks"),
								},
							]}
						/>
						{/* Font Size */}
						<RangeControl
							label={__("Highlight Font Size", "ultimate-blocks")}
							value={parseInt(
								attributesList["font-size"]
									? attributesList["font-size"]
									: headingFontSize
							)}
							onChange={(newFontSize) =>
								onChangeAttribute(newFontSize + "px", "font-size")
							}
							min={12}
							max={100}
						/>
						{/* Text Transform */}
						<SelectControl
							label={__("Highlight Text transform", "ultimate-blocks")}
							options={textTransformOptions}
							value={
								attributesList["text-transform"]
									? attributesList["text-transform"]
									: __("None", "ultimate-blocks")
							}
							onChange={(newTextTransform) =>
								onChangeAttribute(newTextTransform, "text-transform")
							}
						/>
						{/* Letter Spacing */}
						<RangeControl
							label={__("Highlight Letter Spacing", "ultimate-blocks")}
							value={parseInt(
								attributesList["letter-spacing"]
									? attributesList["letter-spacing"]
									: headingLetterSpacing
							)}
							onChange={(newLetterSpacing) =>
								onChangeAttribute(newLetterSpacing + "px", "letter-spacing")
							}
							min={-2}
							max={6}
						/>
						{/* Font Weight */}
						<SelectControl
							label={__("Highlight Font Weight", "ultimate-blocks")}
							options={fontWeightOptions}
							value={
								attributesList["font-weight"]
									? attributesList["font-weight"]
									: headingFontWeight
							}
							onChange={(newFontWeight) =>
								onChangeAttribute(newFontWeight, "font-weight")
							}
						/>
					</PanelBody>
				</InspectorControls>
			)}
		</>
	);
};

/* register highlight format only for advanced-heading */
const exclusiveHighlight = compose(
	withSelect((select) => ({
		selectedBlock: select("core/block-editor").getSelectedBlock(),
	})),
	ifCondition(
		(props) =>
			props.selectedBlock && props.selectedBlock.name === "ub/advanced-heading"
	)
)(highlightEdit);

/* format settings */
const highlight = {
	name,
	title: __("Highlight"),
	tagName: "span",
	className: "has-highlight",
	attributes: {
		style: "style",
		start: "start",
		end: "end",
	},
	edit: exclusiveHighlight,
};

export default highlight;
