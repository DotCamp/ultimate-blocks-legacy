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
	RichText
} = wp.blockEditor || wp.editor;
const {
	Icon,
	IconButton,
	Toolbar,
	ToggleControl,
	FormFileUpload,
	RangeControl,
	PanelBody
} = wp.components;

const { withState, compose } = wp.compose;

const { withSelect } = wp.data;

const attributes = {
	blockID: {
		type: "string",
		default: ""
	},
	images: {
		type: "string",
		default: "[]"
	},
	pics: {
		type: "array",
		default: []
	},
	captions: {
		type: "string",
		default: "[]" //starts as empty, should take {text: '', link: '', id: -1}
	},
	descriptions: {
		type: "array",
		default: []
	},
	wrapsAround: {
		type: "boolean",
		default: true
	},
	isDraggable: {
		type: "boolean",
		default: false
	},
	autoplays: {
		type: "boolean",
		default: false
	},
	autoplayDuration: {
		type: "number",
		default: 3
	},
	sliderHeight: {
		type: "number",
		default: 250
	},
	showPageDots: {
		type: "boolean",
		default: true
	}
};

registerBlockType("ub/image-slider", {
	title: __("Image Slider"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Image Slider"), __("Slideshow"), __("Ultimate Blocks")],
	attributes,

	edit: compose([
		withState({ componentKey: 0, activeSlide: 0 }),
		withSelect((select, ownProps) => ({
			block: (select("core/block-editor") || select("core/editor")).getBlock(
				ownProps.clientId
			)
		}))
	])(function(props) {
		const {
			setAttributes,
			isSelected,
			setState,
			componentKey,
			activeSlide,
			block
		} = props;
		const {
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
			blockID
		} = props.attributes;

		if (images && JSON.parse(images).length !== 0 && pics.length === 0) {
			setAttributes({
				pics: JSON.parse(images),
				images: "[]",
				descriptions: JSON.parse(captions),
				captions: "[]"
			});
		}
		const imageArray = pics;
		const captionArray = descriptions;

		if (blockID !== block.clientId) {
			setAttributes({ blockID: block.clientId });
		}

		return [
			isSelected && (
				<BlockControls>
					{imageArray.length > 0 && (
						<Toolbar>
							<MediaUpload
								value={imageArray.map(img => img.id)}
								allowedTypes={["image"]}
								multiple
								gallery
								render={({ open }) => (
									<IconButton
										icon={editGallery}
										onClick={open}
										label={__("Edit selection")}
									/>
								)}
								onSelect={newImages => {
									const newCaptionArray = newImages.map(img =>
										captionArray.find(c => c.id === img.id)
											? captionArray.find(c => c.id === img.id)
											: {
													text: "",
													link: "",
													id: img.id
											  }
									);

									setAttributes({
										pics: newImages,
										descriptions: newCaptionArray
									});
								}}
							/>
						</Toolbar>
					)}
				</BlockControls>
			),
			isSelected && imageArray.length > 0 && (
				<InspectorControls>
					<PanelBody title={__("Slider Settings")} initialOpen={false}>
						<ToggleControl
							label={__("Wrap around")}
							checked={wrapsAround}
							onChange={_ => {
								setAttributes({ wrapsAround: !wrapsAround });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__("Allow dragging")}
							checked={isDraggable}
							onChange={_ => {
								setAttributes({ isDraggable: !isDraggable });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__("Show page dots")}
							checked={showPageDots}
							onChange={_ => {
								setAttributes({ showPageDots: !showPageDots });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__("Enable autoplay")}
							checked={autoplays}
							onChange={_ => {
								setAttributes({ autoplays: !autoplays });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						{autoplays && (
							<RangeControl
								label={__("Autoplay duration (seconds)")}
								value={autoplayDuration}
								onChange={value => {
									setAttributes({ autoplayDuration: value });
									setState({
										componentKey: componentKey + 1
									});
								}}
								min={1}
								max={10}
							/>
						)}
						<RangeControl
							label={__("Height")}
							value={sliderHeight}
							onChange={newHeight => {
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
				className="ub_image_slider"
				style={{
					minHeight: `${20 + (imageArray.length ? sliderHeight : 200)}px`
				}}
			>
				{imageArray.length === 0 ? (
					<MediaPlaceholder
						onSelect={newImages =>
							props.setAttributes({
								pics: newImages,
								descriptions: newImages.map(img => ({
									id: img.id,
									text: "",
									link: ""
								}))
							})
						}
						labels={{ title: "Image Slider" }}
						allowedTypes={["image"]}
						multiple
					/>
				) : (
					<React.Fragment>
						<Slider
							key={componentKey}
							setActiveSlide={val => {
								if (val !== activeSlide)
									//needed to prevent instance of React error #185
									setState({ activeSlide: val });
							}}
							options={{
								//exclude autoplay, it doesn't work properly
								imagesLoaded: true,
								wrapAround: wrapsAround,
								draggable: isDraggable,
								pageDots: showPageDots,
								initialIndex: activeSlide
							}}
							slides={[
								...[
									imageArray.map((c, i) => (
										<div>
											<img
												key={i}
												src={c.url}
												style={{
													height: `${sliderHeight}px`
												}}
											/>
											<RichText
												formattingControls={[]}
												className="ub_image_silder_image_caption"
												value={captionArray[i].text}
												placeholder={__("Caption goes here")}
												onChange={text => {
													captionArray[i].text = text;
													setAttributes({
														descriptions: captionArray
													});
												}}
											/>
										</div>
									))
								],
								isSelected && (
									<div className="ub_image_slider_extra">
										<FormFileUpload
											multiple
											isLarge
											onChange={event =>
												mediaUpload({
													allowedTypes: ["image"],
													filesList: event.target.files,
													onFileChange: images =>
														setAttributes({
															pics: imageArray.concat(images),
															descriptions: captionArray.concat(
																images.map(img => ({
																	id: img.id,
																	text: "",
																	link: ""
																}))
															)
														})
												})
											}
											className="ub_image_slider_add_images"
											accept="image/*"
											icon="insert"
										>
											{__("Upload an image")}
										</FormFileUpload>
									</div>
								)
							]}
						/>
						{isSelected && activeSlide < captionArray.length && (
							<form
								onSubmit={event => event.preventDefault()}
								className={`editor-format-toolbar__link-modal-line ub_image_slider_url_input flex-container`}
							>
								<div className="ub-icon-holder">
									<Icon icon="admin-links" />
								</div>
								<URLInput
									autoFocus={false}
									className="button-url"
									value={captionArray[activeSlide].link}
									onChange={url => {
										captionArray[activeSlide].link = url;
										setAttributes({
											descriptions: captionArray
										});
									}}
								/>
								<IconButton
									icon={"editor-break"}
									label={__("Apply")}
									type={"submit"}
								/>
							</form>
						)}
					</React.Fragment>
				)}
			</div>
		];
	}),
	save() {
		return null;
	},
	deprecated: [
		{
			attributes,
			save: version_1_1_4,
			migrate: attributes => {
				const { images, captions, ...otherAttributes } = attributes;
				return Object.assign(Object.assign({}, otherAttributes), {
					pics: JSON.parse(images),
					descriptions: JSON.parse(captions)
				});
			}
		}
	]
});
