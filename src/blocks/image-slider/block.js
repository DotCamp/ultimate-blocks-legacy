import { isEmpty } from "lodash";
import icon, { editGallery } from "./icon";

import { Slider } from "./components";

import { version_1_1_4 } from "./oldVersions";

import { useEffect, useState } from "react";
import { getStyles } from "./get-styles";
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
	ColorSettings,
	ColorSettingsWithGradient,
	SpacingControl,
} from "../components";
import {
	MediaUpload,
	MediaPlaceholder,
	BlockControls,
	URLInput,
	InspectorControls,
	mediaUpload,
	RichText,
	useBlockProps,
	BlockAlignmentToolbar,
} from "@wordpress/block-editor";
import {
	Icon,
	Button,
	ToolbarGroup,
	ToolbarButton,
	ToggleControl,
	FormFileUpload,
	RangeControl,
	PanelBody,
	SelectControl,
} from "@wordpress/components";

import { withSelect } from "@wordpress/data";
import metadata from "./block.json";
import { getParentBlock } from "../../common";
const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	images: {
		type: "string",
		default: "[]",
	},
	pics: {
		type: "array",
		default: [],
	},
	captions: {
		type: "string",
		default: "[]", //starts as empty, should take {text: '', link: '', id: -1}
	},
	descriptions: {
		type: "array",
		default: [],
	},
	wrapsAround: {
		type: "boolean",
		default: true,
	},
	isDraggable: {
		type: "boolean",
		default: false,
	},
	autoplays: {
		type: "boolean",
		default: false,
	},
	autoplayDuration: {
		type: "number",
		default: 3,
	},
	sliderHeight: {
		type: "number",
		default: 250,
	},
	showPageDots: {
		//phase out this property
		type: "boolean",
		default: true,
	},
	usePagination: {
		type: "boolean",
		default: true,
	},
	paginationType: {
		type: "string",
		default: "", //available types: bullets, progressbar and fraction
	},
	transition: {
		type: "string",
		default: "slide", //other available options: fade, cube, coverflow, flip
	},
	//for cube, coverflow and flip
	slideShadows: {
		type: "boolean",
		default: true,
	},
	//exclusive for coverflow
	rotate: {
		type: "number",
		default: 50, //degrees
	},
	stretch: {
		type: "number",
		default: 0, //pixels
	},
	depth: {
		type: "number",
		default: 100, //pixels, z-axis
	},
	modifier: {
		type: "number",
		default: 1, //effect multiplier
	},
	//exclusive for flip
	limitRotation: {
		type: "boolean",
		default: true,
	},
	//exclusive for cube
	shadow: {
		type: "boolean",
		default: true,
	},
	shadowOffset: {
		type: "number",
		defaut: 20,
	},
	shadowScale: {
		type: "number",
		default: 0.94,
	},
};

function ImageSliderMain(props) {
	const [componentKey, setComponentKey] = useState(0);
	const [activeSlide, setActiveSlide] = useState(0);

	const {
		attributes: {
			images,
			pics,
			captions,
			descriptions,
			wrapsAround,
			isDraggable,
			autoplays,
			autoplayDuration,
			sliderHeight,
			showPageDots,
			usePagination,
			paginationType,
			blockID,
			transition,
			slideShadows,
			rotate,
			stretch,
			depth,
			modifier,
			limitRotation,
			shadow,
			shadowOffset,
			shadowScale,
			slidesPerView,
			spaceBetween,
			useNavigation,
			align,
			speed,
		},
		setAttributes,
		isSelected,
		block,
		rootBlockClientId,
	} = props;

	//maybe use useEffect for some of the values here?

	if (images && JSON.parse(images).length !== 0 && pics.length === 0) {
		setAttributes({
			pics: JSON.parse(images),
			images: "[]",
			descriptions: JSON.parse(captions),
			captions: "[]",
		});
	}
	const imageArray = pics;
	const captionArray = descriptions;

	if (blockID === "") {
		setAttributes({ blockID: block.clientId });
	} else if (!showPageDots && usePagination) {
		setAttributes({ usePagination: false });
	}
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	if (paginationType === "") {
		setAttributes({ paginationType: "bullets" });
	}

	if (paginationType !== "" && componentKey === 0) {
		setComponentKey(componentKey + 1);
	}
	let classes = ["ub_image_slider"];
	if (!isEmpty(align)) {
		classes.push("align" + align);
	}
	const blockProps = useBlockProps({
		id: `ub_image_slider_${blockID}`,
		className: classes.join(" "),
		style: {
			minHeight: `${30 + (imageArray.length ? sliderHeight : 200)}px`,
			...getStyles(props.attributes),
		},
	});
	return (
		<>
			{isSelected && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						controls={["full", "wide"]}
						onChange={(newAlign) => setAttributes({ align: newAlign })}
					/>
					{imageArray.length > 0 && (
						<ToolbarGroup>
							<MediaUpload
								value={imageArray.map((img) => img.id)}
								allowedTypes={["image"]}
								multiple
								gallery
								render={({ open }) => (
									<ToolbarButton
										icon={editGallery}
										onClick={open}
										label={__("Edit selection")}
									/>
								)}
								onSelect={(newImages) => {
									const newCaptionArray = newImages.map((img) =>
										captionArray.find((c) => c.id === img.id)
											? captionArray.find((c) => c.id === img.id)
											: {
													text: img.caption,
													link: "",
													id: img.id,
												},
									);

									setAttributes({
										pics: newImages,
										descriptions: newCaptionArray,
									});
								}}
							/>
						</ToolbarGroup>
					)}
				</BlockControls>
			)}
			{isSelected && imageArray.length > 0 && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Slider Settings")}>
							<RangeControl
								min={1}
								max={6}
								allowReset
								value={slidesPerView}
								resetFallbackValue={1}
								label={__("Slides Per View", "ultimate-blocks")}
								onChange={(newValue) =>
									setAttributes({ slidesPerView: newValue })
								}
							/>
							<RangeControl
								min={0}
								max={500}
								allowReset
								value={spaceBetween}
								resetFallbackValue={20}
								label={__("Space Between", "ultimate-blocks")}
								onChange={(newValue) =>
									setAttributes({ spaceBetween: newValue })
								}
							/>
							<RangeControl
								min={50}
								max={5000}
								allowReset
								value={speed}
								step={50}
								resetFallbackValue={300}
								label={__("Speed", "ultimate-blocks")}
								onChange={(newValue) => setAttributes({ speed: newValue })}
							/>
							<ToggleControl
								label={__("Wrap around")}
								checked={wrapsAround}
								onChange={() => {
									setAttributes({ wrapsAround: !wrapsAround });
									setComponentKey(componentKey + 1);
								}}
							/>
							<ToggleControl
								label={__("Allow dragging")}
								checked={isDraggable}
								onChange={() => {
									setAttributes({ isDraggable: !isDraggable });
									setComponentKey(componentKey + 1);
								}}
							/>
							<ToggleControl
								label={__("Use Navigation Arrows", "ultimate-blocks")}
								checked={useNavigation}
								onChange={() => {
									setAttributes({ useNavigation: !useNavigation });
									setComponentKey(componentKey + 1);
								}}
							/>
							<ToggleControl
								label={__("Use pagination")}
								checked={usePagination}
								onChange={() => {
									setAttributes({ usePagination: !usePagination });
									setComponentKey(componentKey + 1);
								}}
							/>
							{usePagination && (
								<SelectControl
									label={__("Pagination type")}
									value={paginationType}
									options={["bullets", "fraction", "progressbar"].map((o) => ({
										label: __(o),
										value: o,
									}))}
									onChange={(paginationType) => {
										setAttributes({ paginationType });
										setComponentKey(componentKey + 1);
									}}
								/>
							)}

							<ToggleControl
								label={__("Enable autoplay")}
								checked={autoplays}
								onChange={() => {
									setAttributes({ autoplays: !autoplays });
									setComponentKey(componentKey + 1);
								}}
							/>
							{autoplays && (
								<RangeControl
									label={__("Autoplay duration (seconds)")}
									value={autoplayDuration}
									onChange={(value) => {
										setAttributes({ autoplayDuration: value });
										setComponentKey(componentKey + 1);
									}}
									min={1}
									max={10}
								/>
							)}
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody title={__("Slider Settings")}>
							<SelectControl
								label={__("Transition")}
								value={transition}
								options={["slide", "fade", "cube", "coverflow", "flip"].map(
									(o) => ({
										label: __(o),
										value: o,
									}),
								)}
								onChange={(transition) => {
									setAttributes({ transition });
									setComponentKey(componentKey + 1);
								}}
							/>
							{["cube", "coverflow", "flip"].includes(transition) && (
								<ToggleControl
									label={__("Enable slide shadows")}
									checked={slideShadows}
									onChange={() => {
										setAttributes({ slideShadows: !slideShadows });
										setComponentKey(componentKey + 1);
									}}
								/>
							)}
							{transition === "coverflow" && (
								<>
									<RangeControl
										label={__("Slide rotation")}
										value={rotate}
										onChange={(rotate) => {
											setAttributes({ rotate });
											setComponentKey(componentKey + 1);
										}}
										min={0}
										max={180} //change if this proves to be excessive
									/>
									<RangeControl
										label={__("Stretch space")}
										value={stretch}
										onChange={(stretch) => {
											setAttributes({ stretch });
											setComponentKey(componentKey + 1);
										}}
										min={0}
										max={180} //change if this proves to be excessive
									/>
									<RangeControl
										label={__("Depth offset")}
										value={depth}
										onChange={(depth) => {
											setAttributes({ depth });
											setComponentKey(componentKey + 1);
										}}
										min={0}
										max={200}
									/>
									<RangeControl
										label={__("Effect multiplier")}
										value={modifier}
										onChange={(modifier) => {
											setAttributes({ modifier });
											setComponentKey(componentKey + 1);
										}}
										min={0}
										max={3} //change if this proves to be excessive
										step={0.05}
									/>
								</>
							)}
							{transition === "cube" && (
								<>
									<ToggleControl
										label={__("Enable main slider shadow")}
										checked={shadow}
										onChange={() => {
											setAttributes({ shadow: !shadow });
											setComponentKey(componentKey + 1);
										}}
									/>
									<RangeControl
										label={__("Shadow offset")}
										value={shadowOffset}
										onChange={(shadowOffset) => {
											setAttributes({ shadowOffset });
											setComponentKey(componentKey + 1);
										}}
										min={1}
										max={100}
									/>
									<RangeControl
										label={__("Shadow scale")}
										value={shadowScale}
										onChange={(shadowScale) => {
											setAttributes({ shadowScale });
											setComponentKey(componentKey + 1);
										}}
										min={0}
										max={2}
										scale={0.01}
									/>
								</>
							)}
							{transition === "flip" && (
								<ToggleControl
									label={__("Limit rotation")}
									checked={limitRotation}
									onChange={() => {
										setAttributes({ limitRotation: !limitRotation });
										setComponentKey(componentKey + 1);
									}}
								/>
							)}
							<RangeControl
								label={__("Height")}
								value={sliderHeight}
								onChange={(newHeight) => {
									setAttributes({ sliderHeight: newHeight });
									setComponentKey(componentKey + 1); //ensure proper placement of arrows and page dots
								}}
								min={200}
								max={500}
							/>
						</PanelBody>
						<PanelBody
							title={__("Dimension Settings", "ultimate-blocks")}
							initialOpen={false}
						>
							<SpacingControl
								showByDefault
								attrKey="padding"
								label={__("Padding", "ultimate-blocks")}
							/>
							<SpacingControl
								minimumCustomValue={-Infinity}
								showByDefault
								attrKey="margin"
								label={__("Margin", "ultimate-blocks")}
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="color">
						<ColorSettings
							attrKey="navigationColor"
							label={__("Navigation Color", "ultimate-blocks")}
						/>
						<ColorSettings
							attrKey="paginationColor"
							label={__("Inactive Pagination Color", "ultimate-blocks")}
						/>
						<ColorSettings
							attrKey="activePaginationColor"
							label={__("Active Pagination Color", "ultimate-blocks")}
						/>
						<ColorSettingsWithGradient
							attrBackgroundKey="navigationBackgroundColor"
							attrGradientKey="navigationGradientColor"
							label={__("Navigation Background", "ultimate-blocks")}
						/>
					</InspectorControls>
				</>
			)}

			<div {...blockProps}>
				{imageArray.length === 0 ? (
					<MediaPlaceholder
						onSelect={(newImages) =>
							setAttributes({
								pics: newImages,
								descriptions: newImages.map((img) => ({
									id: img.id,
									text: img.caption,
									link: "",
								})),
							})
						}
						labels={{ title: "Image Slider" }}
						allowedTypes={["image"]}
						multiple
					/>
				) : (
					<>
						<Slider
							key={componentKey}
							setActiveSlide={(val) => {
								if (val !== activeSlide)
									//needed to prevent infinite loop
									setActiveSlide(val);
							}}
							initialSlide={activeSlide}
							draggable={isDraggable}
							wrapAround={wrapsAround}
							pageDots={showPageDots}
							speed={speed}
							useNavigation={useNavigation}
							paginationType={usePagination ? paginationType : "none"}
							autoplay={autoplays ? autoplayDuration : 0}
							transition={transition}
							slidesPerView={slidesPerView}
							spaceBetween={spaceBetween}
							slides={[
								...imageArray.map((c, i) => (
									<figure>
										<img
											key={i}
											src={c.url}
											style={{
												height: `${sliderHeight}px`,
											}}
										/>
										{/* CAPTION INPUT DOESN'T WORK IF PLACED HERE */}
									</figure>
								)),
								isSelected && (
									<div
										className="ub_image_slider_extra"
										style={{ height: `${sliderHeight + 30}px` }}
									>
										<FormFileUpload
											multiple
											isLarge
											onChange={(event) =>
												mediaUpload({
													allowedTypes: ["image"],
													filesList: event.target.files,
													onFileChange: (images) =>
														setAttributes({
															pics: imageArray.concat(images),
															descriptions: captionArray.concat(
																images.map((img) => ({
																	id: img.id,
																	text: img.text,
																	link: "",
																})),
															),
														}),
												})
											}
											className="ub_image_slider_add_images"
											accept="image/*"
											icon="insert"
										>
											{__("Upload an image")}
										</FormFileUpload>
									</div>
								),
							]}
						/>
						{activeSlide < captionArray.length && (
							<>
								<RichText
									tagName="figcaption"
									allowedFormats={[]}
									className="ub_image_slider_image_caption"
									value={descriptions[activeSlide].text}
									placeholder={__("Caption goes here")}
									onChange={(text) => {
										const currentItem = Object.assign(
											{},
											descriptions[activeSlide],
										);

										setAttributes({
											descriptions: [
												...descriptions.slice(0, activeSlide),
												Object.assign(currentItem, { text }),
												...descriptions.slice(activeSlide + 1),
											],
										});
									}}
								/>
								<RichText
									allowedFormats={[]}
									className="ub_image_slider_image_caption ub_image_slider_image_alt"
									value={pics[activeSlide].alt}
									placeholder={__("Image alt text")}
									onChange={(alt) =>
										setAttributes({
											pics: [
												...pics.slice(0, activeSlide),
												Object.assign(pics[activeSlide], { alt }),
												...pics.slice(activeSlide + 1),
											],
										})
									}
								/>
							</>
						)}
						{isSelected && activeSlide < captionArray.length && (
							<form
								onSubmit={(event) => event.preventDefault()}
								className={`editor-format-toolbar__link-modal-line ub_image_slider_url_input flex-container`}
							>
								<div className="ub-icon-holder">
									<Icon icon="admin-links" />
								</div>
								<URLInput
									autoFocus={false}
									className="button-url"
									value={captionArray[activeSlide].link}
									onChange={(link) => {
										const currentItem = Object.assign(
											{},
											captionArray[activeSlide],
										);

										setAttributes({
											descriptions: [
												...descriptions.slice(0, activeSlide),
												Object.assign(currentItem, { link }),
												...descriptions.slice(activeSlide + 1),
											],
										});
									}}
								/>
								<Button
									icon={"editor-break"}
									label={__("Apply")}
									type={"submit"}
								/>
							</form>
						)}
					</>
				)}
			</div>
		</>
	);
}

registerBlockType(metadata.name, {
	...metadata,
	icon: icon,
	example: {},
	attributes: metadata.attributes,
	edit: withSelect((select, ownProps) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(ownProps.clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);
		return {
			block,
			rootBlockClientId,
		};
	})(ImageSliderMain),
	save() {
		return null;
	},
	deprecated: [
		{
			attributes,
			save: version_1_1_4,
			migrate: (attributes) => {
				const { images, captions, ...otherAttributes } = attributes;
				return Object.assign(Object.assign({}, otherAttributes), {
					pics: JSON.parse(images),
					descriptions: JSON.parse(captions),
				});
			},
		},
	],
});
