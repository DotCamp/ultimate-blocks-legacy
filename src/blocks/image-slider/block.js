import icon, { editGallery } from "./icon";

import { Slider } from "./components";

import { version_1_1_4 } from "./oldVersions";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
	MediaUpload,
	MediaPlaceholder,
	BlockControls,
	URLInput,
	InspectorControls,
	mediaUpload,
	RichText,
} = wp.blockEditor || wp.editor;
const {
	Icon,
	Button,
	ToolbarGroup,
	ToolbarButton,
	ToggleControl,
	FormFileUpload,
	RangeControl,
	PanelBody,
	SelectControl,
} = wp.components;

const { withState, compose } = wp.compose;

const { withSelect } = wp.data;

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

registerBlockType("ub/image-slider", {
	title: __("Image Slider"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Image Slider"), __("Slideshow"), __("Ultimate Blocks")],
	attributes,

	edit: compose([
		withState({ componentKey: 0, activeSlide: 0 }),
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
	])(function (props) {
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
			},
			setAttributes,
			isSelected,
			setState,
			componentKey,
			activeSlide,
			block,
			getBlock,
			getClientIdsWithDescendants,
		} = props;

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

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		} else if (!showPageDots && usePagination) {
			setAttributes({ usePagination: false });
		}

		if (paginationType === "") {
			setAttributes({ paginationType: "bullets" });
		}

		if (paginationType !== "" && componentKey === 0) {
			setState({ componentKey: componentKey + 1 });
		}

		return [
			isSelected && (
				<BlockControls>
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
											  }
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
			),
			isSelected && imageArray.length > 0 && (
				<InspectorControls>
					<PanelBody title={__("Slider Settings")} initialOpen={false}>
						<ToggleControl
							label={__("Wrap around")}
							checked={wrapsAround}
							onChange={() => {
								setAttributes({ wrapsAround: !wrapsAround });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__("Allow dragging")}
							checked={isDraggable}
							onChange={() => {
								setAttributes({ isDraggable: !isDraggable });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__("Use pagination")}
							checked={usePagination}
							onChange={() => {
								setAttributes({ usePagination: !usePagination });
								setState({ componentKey: componentKey + 1 });
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
									setState({ componentKey: componentKey + 1 });
								}}
							/>
						)}
						<SelectControl
							label={__("Transition")}
							value={transition}
							options={["slide", "fade", "cube", "coverflow", "flip"].map(
								(o) => ({
									label: __(o),
									value: o,
								})
							)}
							onChange={(transition) => {
								setAttributes({ transition });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						{["cube", "coverflow", "flip"].includes(transition) && (
							<ToggleControl
								label={__("Enable slide shadows")}
								checked={slideShadows}
								onChange={() => {
									setAttributes({ slideShadows: !slideShadows });
									setState({ componentKey: componentKey + 1 });
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
										setState({
											componentKey: componentKey + 1,
										});
									}}
									min={0}
									max={180} //change if this proves to be excessive
								/>
								<RangeControl
									label={__("Stretch space")}
									value={stretch}
									onChange={(stretch) => {
										setAttributes({ stretch });
										setState({
											componentKey: componentKey + 1,
										});
									}}
									min={0}
									max={180} //change if this proves to be excessive
								/>
								<RangeControl
									label={__("Depth offset")}
									value={depth}
									onChange={(depth) => {
										setAttributes({ depth });
										setState({
											componentKey: componentKey + 1,
										});
									}}
									min={0}
									max={200}
								/>
								<RangeControl
									label={__("Effect multiplier")}
									value={modifier}
									onChange={(modifier) => {
										setAttributes({ modifier });
										setState({
											componentKey: componentKey + 1,
										});
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
										setState({ componentKey: componentKey + 1 });
									}}
								/>
								<RangeControl
									label={__("Shadow offset")}
									value={shadowOffset}
									onChange={(shadowOffset) => {
										setAttributes({ shadowOffset });
										setState({
											componentKey: componentKey + 1,
										});
									}}
									min={1}
									max={100}
								/>
								<RangeControl
									label={__("Shadow scale")}
									value={shadowScale}
									onChange={(shadowScale) => {
										setAttributes({ shadowScale });
										setState({
											componentKey: componentKey + 1,
										});
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
									setState({ componentKey: componentKey + 1 });
								}}
							/>
						)}
						<ToggleControl
							label={__("Enable autoplay")}
							checked={autoplays}
							onChange={() => {
								setAttributes({ autoplays: !autoplays });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						{autoplays && (
							<RangeControl
								label={__("Autoplay duration (seconds)")}
								value={autoplayDuration}
								onChange={(value) => {
									setAttributes({ autoplayDuration: value });
									setState({
										componentKey: componentKey + 1,
									});
								}}
								min={1}
								max={10}
							/>
						)}
						<RangeControl
							label={__("Height")}
							value={sliderHeight}
							onChange={(newHeight) => {
								setAttributes({ sliderHeight: newHeight });
								setState({ componentKey: componentKey + 1 }); //ensure proper placement of arrows and page dots
							}}
							min={200}
							max={500}
						/>
					</PanelBody>
				</InspectorControls>
			),

			<div
				id={`ub_image_slider_${blockID}`}
				className="ub_image_slider"
				style={{
					minHeight: `${20 + (imageArray.length ? sliderHeight : 200)}px`,
				}}
			>
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
									setState({ activeSlide: val });
							}}
							initialSlide={activeSlide}
							draggable={isDraggable}
							wrapAround={wrapsAround}
							pageDots={showPageDots}
							paginationType={usePagination ? paginationType : "none"}
							autoplay={autoplays ? autoplayDuration : 0}
							transition={transition}
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
																}))
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
											descriptions[activeSlide]
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
											captionArray[activeSlide]
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
			</div>,
		];
	}),
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
