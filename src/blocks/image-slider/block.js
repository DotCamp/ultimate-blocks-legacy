import icon, { editGallery } from './icon';

import Flickity from 'react-flickity-component';

import './style.scss';

import { version_1_1_4 } from './oldVersions';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
	MediaUpload,
	MediaPlaceholder,
	BlockControls,
	InspectorControls,
	mediaUpload
} = wp.editor;
const {
	IconButton,
	Toolbar,
	ToggleControl,
	FormFileUpload,
	SelectControl,
	RangeControl
} = wp.components;

const { withState } = wp.compose;

const attributes = {
	ID: {
		type: 'string',
		default: ''
	},
	images: {
		type: 'string',
		default: '[]'
	},
	captions: {
		type: 'string',
		default: '[]'
	},
	links: {
		type: 'string',
		default: '[]'
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
	navOption: {
		type: 'string',
		default: 'Page Dots'
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
	keywords: [__('Image Slider'), __('Ultimate Blocks')],
	attributes,

	edit: withState({ componentKey: 0 })(function(props) {
		const { setAttributes, isSelected, setState, componentKey } = props;
		const {
			ID,
			images,
			wrapsAround,
			isDraggable,
			autoplays,
			autoplayDuration,
			navOption,
			sliderHeight
		} = props.attributes;
		const imageArray = JSON.parse(images);

		if (ID === '') {
			setAttributes({
				ID: Math.random()
					.toString(36)
					.replace(/[^a-z0-9]+/g, '')
					.substr(1, 10)
			});
		}

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						<MediaUpload
							value={imageArray.map(img => img.id)}
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
								setAttributes({
									images: JSON.stringify(newImages)
								});
							}}
						/>
					</Toolbar>
				</BlockControls>
			),
			isSelected && imageArray.length > 0 && (
				<InspectorControls>
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
						label={__('Enable autoplay')}
						checked={autoplays}
						onChange={() => {
							setAttributes({ autoplays: !autoplays });
							setState({ componentKey: componentKey + 1 });
						}}
					/>
					{autoplays && (
						<RangeControl
							label={__('Autoplay duration')}
							value={autoplayDuration}
							onChange={value => {
								setAttributes({ autoplayDuration: value });
								setState({ componentKey: componentKey + 1 });
							}}
							min={1}
							max={10}
						/>
					)}
					<SelectControl
						label={__('Gallery Navigation')}
						value={navOption}
						options={[
							{ label: __('None'), value: 'None' },
							{ label: __('Page Dots'), value: 'Page Dots' },
							{ label: __('Mini Gallery'), value: 'Mini Gallery' }
						]}
						onChange={option => {
							setAttributes({ navOption: option });
							setState({ componentKey: componentKey + 1 });
						}}
					/>
					<RangeControl
						label={__('Height')}
						value={sliderHeight}
						onChange={newHeight =>
							setAttributes({ sliderHeight: newHeight })
						}
						min={200}
						max={500}
					/>
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
								images: JSON.stringify(newImages)
							});
						}}
						allowedTypes={['image']}
						multiple
					/>
				) : (
					<React.Fragment>
						<Flickity
							key={componentKey}
							className={`ub_image_slider_${ID}`}
							elementType={'div'}
							options={{
								imagesLoaded: true,
								wrapAround: wrapsAround,
								draggable: isDraggable,
								autoPlay: autoplays
									? autoplayDuration * 1000
									: autoplays,
								pageDots: navOption === 'Page Dots'
							}}
							reloadOnUpdate={true}
							imagesLoaded={true}
						>
							{JSON.parse(images).map((c, i) => (
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
								</div>
							))}
							{isSelected && (
								<div style={{ width: '100%', height: '100%' }}>
									<FormFileUpload
										multiple
										isLarge
										onChange={event => {
											mediaUpload({
												allowedTypes: ['image'],
												filesList: event.target.files,
												onFileChange: images => {
													setAttributes({
														images: JSON.sttringify(
															imageArray.concat(
																images
															)
														)
													});
												}
											});
										}}
										className="ub_image_slider_add_images"
										accept="image/*"
										icon="insert"
										style={{
											display: 'block',
											top: '50%',
											margin: 'auto'
										}}
									>
										{__('Upload an image')}
									</FormFileUpload>
								</div>
							)}
						</Flickity>
						{navOption === 'Mini Gallery' && (
							<div
								data-flickity={JSON.stringify({
									asNavFor: `.ub_image_slider_${ID}`,
									contain: true,
									pageDots: false
								})}
							>
								{JSON.parse(images).map((c, i) => (
									<img
										style={{
											maxHeight: '100px',
											objectFit: 'contain'
										}}
										key={i}
										src={c.url}
									/>
								))}
							</div>
						)}
					</React.Fragment>
				)}
			</div>
		];
	}),
	save(props) {
		const {
			ID,
			images,
			isDraggable,
			wrapsAround,
			autoplays,
			autoplayDuration,
			navOption,
			sliderHeight
		} = props.attributes;
		const imageArray = JSON.parse(images);

		return (
			<div>
				<div
					className="ub_image_slider"
					id={ID}
					data-flickity={JSON.stringify({
						draggable: isDraggable,
						pageDots: navOption === 'Page Dots',
						wrapAround: wrapsAround,
						autoPlay: autoplays
							? autoplayDuration * 1000
							: autoplays,
						adaptiveHeight: true
					})}
				>
					{imageArray.map((c, i) => (
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
						</div>
					))}
				</div>
				{navOption === 'Mini Gallery' && (
					<div
						data-flickity={JSON.stringify({
							asNavFor: `#${ID}`,
							contain: true,
							pageDots: false
						})}
					>
						{imageArray.map((c, i) => (
							<img
								style={{
									maxHeight: '100px',
									objectFit: 'contain'
								}}
								key={i}
								src={c.url}
							/>
						))}
					</div>
				)}
			</div>
		);
	},
	deprecated: [{ attributes, save: version_1_1_4 }]
});
