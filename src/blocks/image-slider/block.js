import icon, { editGallery } from './icon';

import { Slider } from './components';

import './editor.scss';
import './style.scss';

import { version_1_1_4 } from './oldVersions';

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
} = wp.editor;
const {
	Icon,
	IconButton,
	Toolbar,
	ToggleControl,
	FormFileUpload,
	RangeControl,
	PanelBody
} = wp.components;

const { withState } = wp.compose;

const attributes = {
	images: {
		type: 'string',
		default: '[]'
	},
	captions: {
		type: 'string',
		default: '[]' //starts as empty, should take {text: '', link: '', id: -1}
	},
	wrapsAround: {
		type: 'boolean',
		default: true
	},
	isDraggable: {
		type: 'boolean',
		default: false
	},
	autoplays: {
		type: 'boolean',
		default: false
	},
	autoplayDuration: {
		type: 'number',
		default: 3
	},
	sliderHeight: {
		type: 'number',
		default: 250
	},
	showPageDots: {
		type: 'boolean',
		default: true
	}
};

registerBlockType('ub/image-slider', {
	title: __('Image Slider'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Image Slider'), __('Slideshow'), __('Ultimate Blocks')],
	attributes,

	edit: withState({ componentKey: 0, activeSlide: 0 })(function(props) {
		const {
			setAttributes,
			isSelected,
			setState,
			componentKey,
			activeSlide
		} = props;
		const {
			images,
			captions,
			wrapsAround,
			isDraggable,
			autoplays,
			autoplayDuration,
			sliderHeight,
			showPageDots
		} = props.attributes;
		const imageArray = JSON.parse(images);
		const captionArray = JSON.parse(captions);

		return [
			isSelected && (
				<BlockControls>
					{imageArray.length > 0 && (
						<Toolbar>
							<MediaUpload
								value={JSON.parse(images).map(img => img.id)}
								allowedTypes={['image']}
								multiple
								gallery
								render={({ open }) => (
									<IconButton
										icon={editGallery}
										onClick={open}
										label={__('Edit selection')}
									/>
								)}
								onSelect={newImages => {
									const newCaptionArray = newImages.map(
										(img, i) => {
											return captionArray.find(
												c => c.id === img.id
											)
												? captionArray.find(
														c => c.id === img.id
												  )
												: {
														text: '',
														link: '',
														id: img.id
												  };
										}
									);

									setAttributes({
										images: JSON.stringify(newImages),
										captions: JSON.stringify(
											newCaptionArray
										)
									});
								}}
							/>
						</Toolbar>
					)}
				</BlockControls>
			),
			isSelected && imageArray.length > 0 && (
				<InspectorControls>
					<PanelBody
						title={__('Slider Settings')}
						initialOpen={false}
					>
						<ToggleControl
							label={__('Wrap around')}
							checked={wrapsAround}
							onChange={() => {
								setAttributes({ wrapsAround: !wrapsAround });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__('Allow dragging')}
							checked={isDraggable}
							onChange={() => {
								setAttributes({ isDraggable: !isDraggable });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__('Show page dots')}
							checked={showPageDots}
							onChange={() => {
								setAttributes({ showPageDots: !showPageDots });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						<ToggleControl
							label={__('Enable autoplay')}
							checked={autoplays}
							onChange={() => {
								setAttributes({ autoplays: !autoplays });
								setState({ componentKey: componentKey + 1 });
							}}
						/>
						{autoplays && (
							<RangeControl
								label={__('Autoplay duration (seconds)')}
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
							label={__('Height')}
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
					minHeight: `${20 +
						(imageArray.length ? sliderHeight : 200)}px`,
					display: 'block'
				}}
			>
				{imageArray.length === 0 ? (
					<MediaPlaceholder
						value={imageArray}
						onSelect={newImages => {
							props.setAttributes({
								images: JSON.stringify(newImages),
								captions: JSON.stringify(
									newImages.map(img => {
										return {
											id: img.id,
											text: '',
											link: ''
										};
									})
								)
							});
						}}
						allowedTypes={['image']}
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
									JSON.parse(images).map((c, i) => (
										<div style={{ width: '100%' }}>
											<img
												key={i}
												src={c.url}
												style={{
													display: 'block',
													height: `${sliderHeight}px`,
													objectFit: 'contain',
													margin: '0 auto'
												}}
											/>
											<RichText
												formattingControls={[]}
												className="ub_image_silder_image_caption"
												value={
													JSON.parse(captions)[i].text
												}
												placeholder={__(
													'Caption goes here'
												)}
												onChange={text => {
													captionArray[i].text = text;
													setAttributes({
														captions: JSON.stringify(
															captionArray
														)
													});
												}}
											/>
										</div>
									))
								],
								isSelected && (
									<div
										style={{
											width: '100%',
											height: '100%'
										}}
									>
										<FormFileUpload
											multiple
											isLarge
											onChange={event => {
												mediaUpload({
													allowedTypes: ['image'],
													filesList:
														event.target.files,
													onFileChange: images => {
														setAttributes({
															images: JSON.stringify(
																imageArray.concat(
																	images
																)
															),
															captions: JSON.stringify(
																captionArray.concat(
																	images.map(
																		img => {
																			return {
																				id:
																					img.id,
																				text:
																					'',
																				link:
																					''
																			};
																		}
																	)
																)
															)
														});
													}
												});
											}}
											className="ub_image_slider_add_images"
											accept="image/*"
											icon="insert"
										>
											{__('Upload an image')}
										</FormFileUpload>
									</div>
								)
							]}
						/>
						{isSelected && activeSlide < captionArray.length && (
							<form
								key={'form-link'}
								onSubmit={event => event.preventDefault()}
								className={`editor-format-toolbar__link-modal-line ub_image_slider_url_input flex-container`}
							>
								<div
									style={{
										position: 'relative',
										transform: 'translate(-25%,25%)'
									}}
								>
									<Icon icon="admin-links" />
								</div>
								<URLInput
									className="button-url"
									value={
										JSON.parse(captions)[activeSlide].link
									}
									onChange={url => {
										captionArray[activeSlide].link = url;
										setAttributes({
											captions: JSON.stringify(
												captionArray
											)
										});
									}}
								/>
								<IconButton
									icon={'editor-break'}
									label={__('Apply')}
									type={'submit'}
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
	deprecated: [{ attributes, save: version_1_1_4 }]
});
