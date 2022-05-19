import { oneColumnIcon, twoColumnsIcon, threeColumnsIcon } from "./icons/icon";
import remove_icon from "./icons/remove_icon";

const { __ } = wp.i18n;

const { BlockControls, RichText, MediaUpload } = wp.blockEditor || wp.editor;

const { Button, ToolbarGroup, ToolbarButton } = wp.components;

const { createBlock } = wp.blocks;

export const blockControls = (props) => {
	const { editable, attributes, setAttributes } = props;

	const {
		column,
		title1Align,
		body1Align,
		title2Align,
		body2Align,
		title3Align,
		body3Align,
	} = attributes;

	const selectedTextAlignment = () => {
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
				<ToolbarButton
					icon={oneColumnIcon}
					label={__("One column")}
					isActive={column === "1"}
					onClick={() => setAttributes({ column: "1" })}
				/>
				<ToolbarButton
					icon={twoColumnsIcon}
					label={__("Two columns")}
					isActive={column === "2"}
					onClick={() => setAttributes({ column: "2" })}
				/>
				<ToolbarButton
					icon={threeColumnsIcon}
					label={__("Three columns")}
					isActive={column === "3"}
					onClick={() => setAttributes({ column: "3" })}
				/>
			</ToolbarGroup>
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

export const editorDisplay = (props) => {
	const { isSelected, setState, setAttributes } = props;

	const {
		column,
		columnOneTitle,
		columnTwoTitle,
		columnThreeTitle,
		columnOneBody,
		columnTwoBody,
		columnThreeBody,
		imgOneURL,
		imgOneID,
		imgOneAlt,
		imgTwoURL,
		imgTwoID,
		imgTwoAlt,
		imgThreeURL,
		imgThreeID,
		imgThreeAlt,
		title1Align,
		body1Align,
		title2Align,
		body2Align,
		title3Align,
		body3Align,
	} = props.attributes;

	return (
		<div className={`ub_feature_box column_${column}`}>
			<div className="ub_feature_1">
				{!imgOneID ? (
					<div className="ub_feature_upload_button">
						<MediaUpload
							onSelect={(img) =>
								setAttributes({
									imgOneID: img.id,
									imgOneURL: img.url,
									imgOneAlt: img.alt,
								})
							}
							allowedTypes={["image"]}
							value={imgOneID}
							render={({ open }) => (
								<Button
									className="components-button button button-medium"
									onClick={open}
								>
									{__("Upload Image")}
								</Button>
							)}
						/>
					</div>
				) : (
					<>
						{isSelected && (
							<Button
								className="remove-image"
								onClick={() =>
									setAttributes({
										imgOneID: null,
										imgOneURL: null,
										imgOneAlt: null,
									})
								}
							>
								{remove_icon}
							</Button>
						)}
						<img
							className="ub_feature_one_img"
							src={imgOneURL}
							alt={imgOneAlt}
						/>
					</>
				)}
				<RichText
					tagName="p"
					className="ub_feature_one_title"
					style={{ textAlign: title1Align }}
					value={columnOneTitle}
					onChange={(value) => setAttributes({ columnOneTitle: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() => setState({ editable: "title1" })}
				/>
				<RichText
					tagName="p"
					className="ub_feature_one_body"
					style={{ textAlign: body1Align }}
					value={columnOneBody}
					onChange={(value) => setAttributes({ columnOneBody: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() => setState({ editable: "body1" })}
				/>
			</div>
			<div className="ub_feature_2">
				{!imgTwoID ? (
					<div className="ub_feature_upload_button">
						<MediaUpload
							onSelect={(img) =>
								setAttributes({
									imgTwoID: img.id,
									imgTwoURL: img.url,
									imgTwoAlt: img.alt,
								})
							}
							allowedTypes={["image"]}
							value={imgTwoID}
							render={({ open }) => (
								<Button
									className="components-button button button-medium"
									onClick={open}
								>
									{__("Upload Image")}
								</Button>
							)}
						/>
					</div>
				) : (
					<>
						{isSelected && (
							<Button
								className="remove-image"
								onClick={() =>
									setAttributes({
										imgTwoID: null,
										imgTwoURL: null,
										imgTwoAlt: null,
									})
								}
							>
								{remove_icon}
							</Button>
						)}
						<img
							className="ub_feature_two_img"
							src={imgTwoURL}
							alt={imgTwoAlt}
						/>
					</>
				)}
				<RichText
					tagName="p"
					className="ub_feature_two_title"
					style={{ textAlign: title2Align }}
					value={columnTwoTitle}
					onChange={(value) => setAttributes({ columnTwoTitle: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() => setState({ editable: "title2" })}
				/>
				<RichText
					tagName="p"
					className="ub_feature_two_body"
					style={{ textAlign: body2Align }}
					value={columnTwoBody}
					onChange={(value) => setAttributes({ columnTwoBody: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() => setState({ editable: "body2" })}
				/>
			</div>
			<div className="ub_feature_3">
				{!imgThreeID ? (
					<div className="ub_feature_upload_button">
						<MediaUpload
							onSelect={(img) =>
								setAttributes({
									imgThreeID: img.id,
									imgThreeURL: img.url,
									imgThreeAlt: img.alt,
								})
							}
							allowedTypes={["image"]}
							value={imgThreeID}
							render={({ open }) => (
								<Button
									className="components-button button button-medium"
									onClick={open}
								>
									{__("Upload Image")}
								</Button>
							)}
						/>
					</div>
				) : (
					<>
						{isSelected && (
							<Button
								className="remove-image"
								onClick={() =>
									setAttributes({
										imgThreeID: null,
										imgThreeURL: null,
										imgThreeAlt: null,
									})
								}
							>
								{remove_icon}
							</Button>
						)}
						<img
							className="ub_feature_three_img"
							src={imgThreeURL}
							alt={imgThreeAlt}
						/>
					</>
				)}
				<RichText
					tagName="p"
					className="ub_feature_three_title"
					style={{ textAlign: title3Align }}
					value={columnThreeTitle}
					onChange={(value) => setAttributes({ columnThreeTitle: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() => setState({ editable: "title3" })}
				/>
				<RichText
					tagName="p"
					className="ub_feature_three_body"
					style={{ textAlign: body3Align }}
					value={columnThreeBody}
					onChange={(value) => setAttributes({ columnThreeBody: value })}
					keepPlaceholderOnFocus={true}
					unstableOnFocus={() => setState({ editable: "body3" })}
				/>
			</div>
		</div>
	);
};

export const upgradeToStyledBox = (attributes) => {
	let currentTitles = [attributes.columnOneTitle];
	let currentTitleAligns = [attributes.title1Align];
	let currentTexts = [attributes.columnOneBody];
	let currentTextAligns = [attributes.body1Align];
	let currentImages = [
		{
			id: attributes.imgOneID || null,
			alt: attributes.imgOneAlt || "",
			url: attributes.imgOneURL || "",
		},
	];

	if (parseInt(attributes.column) >= 2) {
		currentTitles.push(attributes.columnTwoTitle);
		currentTitleAligns.push(attributes.title2Align);
		currentTexts.push(attributes.columnTwoBody);
		currentTextAligns.push(attributes.body2Align);
		currentImages.push({
			id: attributes.imgTwoID || null,
			alt: attributes.imgTwoAlt || "",
			url: attributes.imgTwoURL || "",
		});
	}

	if (parseInt(attributes.column) === 3) {
		currentTitles.push(attributes.columnThreeTitle);
		currentTitleAligns.push(attributes.title3Align);
		currentTexts.push(attributes.columnThreeBody);
		currentTextAligns.push(attributes.body3Align);
		currentImages.push({
			id: attributes.imgThreeID || null,
			alt: attributes.imgThreeAlt || "",
			url: attributes.imgThreeURL || "",
		});
	}

	return createBlock("ub/styled-box", {
		mode: "feature",
		title: currentTitles,
		titleAlign: currentTitleAligns,
		text: currentTexts,
		textAlign: currentTextAligns,
		image: currentImages,
	});
};
