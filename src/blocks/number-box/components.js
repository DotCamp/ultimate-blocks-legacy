const { __ } = wp.i18n;

const { InspectorControls, PanelColorSettings, BlockControls, RichText } =
	wp.blockEditor || wp.editor;

const { PanelBody, ToolbarGroup, SelectControl, ToolbarButton } = wp.components;

const { createBlock } = wp.blocks;

export const blockControls = (props) => {
	const { attributes, setAttributes, editable } = props;

	const {
		title1Align,
		title2Align,
		title3Align,
		body1Align,
		body2Align,
		body3Align,
	} = attributes;

	const selectedTextAlignment = (_) => {
		switch ("editable") {
			case "title1":
				return title1Align;
			case "body1":
				return body1Align;
			case "title2":
				return title2Align;
			case "body2":
				return body2Align;
			case "title3":
				return title3Align;
			case "body3":
				return body3Align;
		}
	};
	return (
		<BlockControls>
			<ToolbarGroup>
				{["left", "center", "right", "justify"]
					.slice(0, editable.indexOf("title") > -1 ? 3 : 4)
					.map((a) => (
						<ToolbarButton
							icon={`editor-${a === "justify" ? a : "align" + a}`}
							label={__(
								(a !== "justify" ? "Align " : "") +
									a[0].toUpperCase() +
									a.slice(1)
							)}
							isActive={selectedTextAlignment === a}
							onClick={() => {
								switch (editable) {
									case "title1":
										setAttributes({
											title1Align: a,
										});
										break;
									case "body1":
										setAttributes({
											body1Align: a,
										});
										break;
									case "title2":
										setAttributes({
											title2Align: a,
										});
										break;
									case "body2":
										setAttributes({
											body2Align: a,
										});
										break;
									case "title3":
										setAttributes({
											title3Align: a,
										});
										break;
									case "body3":
										setAttributes({
											body3Align: a,
										});
										break;
								}
							}}
						/>
					))}
			</ToolbarGroup>
		</BlockControls>
	);
};

export const inspectorControls = (props) => {
	const { attributes, setAttributes } = props;

	const { column, numberBackground, numberColor, borderColor } = attributes;

	const columns = [
		{ value: "1", label: __("One Column") },
		{ value: "2", label: __("Two Column") },
		{ value: "3", label: __("Three Column") },
	];
	return (
		<InspectorControls>
			<PanelBody title={__("Number Box Settings")}>
				<SelectControl
					label={__("Number of Columns")}
					value={column}
					options={columns.map(({ value, label }) => ({
						value: value,
						label: label,
					}))}
					onChange={(value) => {
						setAttributes({ column: value });
					}}
				/>
				<PanelColorSettings
					title={__("Color Scheme")}
					initialOpen={false}
					colorSettings={[
						{
							value: numberBackground,
							onChange: (colorValue) =>
								setAttributes({
									numberBackground: colorValue,
								}),
							label: __("Number Background Color"),
						},
						{
							value: numberColor,
							onChange: (colorValue) =>
								setAttributes({
									numberColor: colorValue,
								}),
							label: __("Number Color"),
						},
						{
							value: borderColor,
							onChange: (colorValue) =>
								setAttributes({
									borderColor: colorValue,
								}),
							label: __("Border Color"),
						},
					]}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export const editorDisplay = (props) => {
	const { attributes, setAttributes, setState } = props;

	const {
		column,
		columnOneNumber,
		columnTwoNumber,
		columnThreeNumber,
		columnOneTitle,
		columnTwoTitle,
		columnThreeTitle,
		columnOneBody,
		columnTwoBody,
		columnThreeBody,
		numberBackground,
		numberColor,
		borderColor,
		title1Align,
		title2Align,
		title3Align,
		body1Align,
		body2Align,
		body3Align,
	} = attributes;
	return (
		<div className={`ub_number_box column_${column}`}>
			<div
				className="ub_number_1"
				style={{
					borderColor: borderColor,
				}}
			>
				<div
					className="ub_number_box_number"
					style={{
						backgroundColor: numberBackground,
					}}
				>
					<RichText
						tagName="p"
						placeholder={__("1")}
						className="ub_number_one_number"
						style={{
							color: numberColor,
						}}
						value={columnOneNumber}
						onChange={(value) =>
							setAttributes({
								columnOneNumber: value,
							})
						}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={(_) => setState({ editable: "" })}
					/>
				</div>
				<RichText
					tagName="p"
					placeholder={__("Title One")}
					style={{ textAlign: title1Align }}
					className="ub_number_one_title"
					value={columnOneTitle}
					onChange={(value) => setAttributes({ columnOneTitle: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={(_) => setState({ editable: "title1" })}
				/>
				<RichText
					tagName="p"
					placeholder={__("Your content goes here.")}
					style={{ textAlign: body1Align }}
					className="ub_number_one_body"
					value={columnOneBody}
					onChange={(value) => setAttributes({ columnOneBody: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={(_) => setState({ editable: "body1" })}
				/>
			</div>
			<div
				className="ub_number_2"
				style={{
					borderColor: borderColor,
				}}
			>
				<div
					className="ub_number_box_number"
					style={{
						backgroundColor: numberBackground,
					}}
				>
					<RichText
						tagName="p"
						placeholder={__("2")}
						className="ub_number_two_number"
						style={{
							color: numberColor,
						}}
						value={columnTwoNumber}
						onChange={(value) =>
							setAttributes({
								columnTwoNumber: value,
							})
						}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={(_) => setState({ editable: "" })}
					/>
				</div>
				<RichText
					tagName="p"
					placeholder={__("Title Two")}
					style={{ textAlign: title2Align }}
					className="ub_number_two_title"
					value={columnTwoTitle}
					onChange={(value) => setAttributes({ columnTwoTitle: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={(_) => setState({ editable: "title2" })}
				/>
				<RichText
					tagName="p"
					placeholder={__("Your content goes here.")}
					style={{ textAlign: body2Align }}
					className="ub_number_two_body"
					value={columnTwoBody}
					onChange={(value) => setAttributes({ columnTwoBody: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={(_) => setState({ editable: "body2" })}
				/>
			</div>
			<div
				className="ub_number_3"
				style={{
					borderColor: borderColor,
				}}
			>
				<div
					className="ub_number_box_number"
					style={{
						backgroundColor: numberBackground,
					}}
				>
					<RichText
						tagName="p"
						placeholder={__("3")}
						className="ub_number_three_number"
						style={{
							color: numberColor,
						}}
						value={columnThreeNumber}
						onChange={(value) =>
							setAttributes({
								columnThreeNumber: value,
							})
						}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={(_) => setState({ editable: "" })}
					/>
				</div>
				<RichText
					tagName="p"
					placeholder={__("Title Three")}
					style={{ textAlign: title3Align }}
					className="ub_number_three_title"
					value={columnThreeTitle}
					onChange={(value) => setAttributes({ columnThreeTitle: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={(_) => setState({ editable: "title3" })}
				/>
				<RichText
					tagName="p"
					placeholder={__("Your content goes here.")}
					style={{ textAlign: body3Align }}
					className="ub_number_three_body"
					value={columnThreeBody}
					onChange={(value) => setAttributes({ columnThreeBody: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={(_) => setState({ editable: "body3" })}
				/>
			</div>
		</div>
	);
};

export const upgradeToStyledBox = (attributes) => {
	let currentNumbers = [attributes.columnOneNumber];
	let currentTitles = [attributes.columnOneTitle];
	let currentTitleAligns = [attributes.title1Align];
	let currentTexts = [attributes.columnOneBody];
	let currentTextAligns = [attributes.body1Align];

	if (parseInt(attributes.column) >= 2) {
		currentNumbers.push(attributes.columnTwoNumber);
		currentTitles.push(attributes.columnTwoTitle);
		currentTitleAligns.push(attributes.title2Align);
		currentTexts.push(attributes.columnTwoBody);
		currentTextAligns.push(attributes.body2Align);
	}
	if (parseInt(attributes.column) === 3) {
		currentNumbers.push(attributes.columnThreeNumber);
		currentTitles.push(attributes.columnThreeTitle);
		currentTitleAligns.push(attributes.title3Align);
		currentTexts.push(attributes.columnThreeBody);
		currentTextAligns.push(attributes.body3Align);
	}

	return createBlock("ub/styled-box", {
		mode: "number",
		number: currentNumbers,
		title: currentTitles,
		titleAlign: currentTitleAligns,
		text: currentTexts,
		textAlign: currentTextAligns,
		backColor: attributes.numberBackground,
		foreColor: attributes.numberColor,
		outlineColor: attributes.borderColor,
	});
};
