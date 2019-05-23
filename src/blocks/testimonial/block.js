import icons from './icons';
import { version_1_1_2, version_1_1_5 } from './oldVersions';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const {
	RichText,
	BlockControls,
	MediaUpload,
	InspectorControls,
	ColorPalette,
	PanelColorSettings
} = wp.editor;

const { Button, PanelBody, RangeControl, Toolbar, IconButton } = wp.components;

const { withState } = wp.compose;

const attributes = {
	ub_testimonial_text: {
		type: 'array',
		source: 'children',
		selector: '.ub_testimonial_text'
	},
	textAlign: {
		type: 'string',
		default: 'justify'
	},
	ub_testimonial_author: {
		type: 'array',
		source: 'children',
		selector: '.ub_testimonial_author'
	},
	authorAlign: {
		type: 'string',
		default: 'right'
	},
	ub_testimonial_author_role: {
		type: 'array',
		source: 'children',
		selector: '.ub_testimonial_author_role'
	},
	authorRoleAlign: {
		type: 'string',
		default: 'right'
	},
	imgURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: 'img'
	},
	imgID: {
		type: 'number'
	},
	imgAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: 'img'
	},
	backgroundColor: {
		type: 'string',
		default: '#f4f6f6'
	},
	textColor: {
		type: 'string',
		default: '#444444'
	},
	textSize: {
		type: 'number',
		default: 17
	}
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('ub/testimonial-block', {
	title: __('Testimonial'),
	icon: icons.testimonial,
	category: 'ultimateblocks',
	keywords: [__('testimonial'), __('quotes'), __('Ultimate Blocks')],
	attributes,

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withState({ editable: '' })(function(props) {
		const { isSelected, editable, setState, setAttributes } = props;

		const {
			backgroundColor,
			textColor,
			textSize,
			imgID,
			imgURL,
			imgAlt,
			ub_testimonial_author,
			ub_testimonial_author_role,
			ub_testimonial_text,
			textAlign,
			authorAlign,
			authorRoleAlign
		} = props.attributes;

		const onChangeTestimonialText = value => {
			setAttributes({ ub_testimonial_text: value });
		};

		const onChangeTestimonialAuthor = value => {
			setAttributes({ ub_testimonial_author: value });
		};

		const onChangeTestimonialAuthorRole = value => {
			setAttributes({ ub_testimonial_author_role: value });
		};

		const onSelectImage = img => {
			setAttributes({
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt
			});
		};
		const onRemoveImage = () => {
			setAttributes({
				imgID: null,
				imgURL: null,
				imgAlt: null
			});
		};

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						{['left', 'center', 'right', 'justify']
							.slice(0, editable.indexOf('text') > 0 ? 4 : 3)
							.map(a => (
								<IconButton
									icon={`editor-${
										a === 'justify' ? a : 'align' + a
									}`}
									label={__(
										(a !== 'justify' ? 'Align ' : '') +
											a[0].toUpperCase() +
											a.slice(1)
									)}
									isActive={() => {
										switch (editable) {
											case 'testimonial_text':
												return textAlign === a;
											case 'author':
												return authorAlign === a;
											case 'author_role':
												return authorRoleAlign === a;
										}
									}}
									onClick={() => {
										switch (editable) {
											case 'testimonial_text':
												setAttributes({ textAlign: a });
												break;
											case 'author':
												setAttributes({
													authorAlign: a
												});
												break;
											case 'author_role':
												setAttributes({
													authorRoleAlign: a
												});
												break;
										}
									}}
								/>
							))}
					</Toolbar>
				</BlockControls>
			),

			isSelected && (
				<InspectorControls>
					<PanelColorSettings
						title={__('Background Color')}
						initialOpen={true}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: colorValue =>
									setAttributes({
										backgroundColor: colorValue
									}),
								label: ''
							}
						]}
					/>
					<PanelBody title={__('Testimonial Body')}>
						<p>Font Color</p>
						<ColorPalette
							value={textColor}
							onChange={colorValue =>
								setAttributes({ textColor: colorValue })
							}
							allowReset
						/>
						<RangeControl
							label={__('Font Size')}
							value={textSize}
							onChange={value =>
								setAttributes({ textSize: value })
							}
							min={14}
							max={200}
							beforeIcon="editor-textcolor"
							allowReset
						/>
					</PanelBody>
				</InspectorControls>
			),

			<div className={props.className}>
				<div
					className="ub_testimonial"
					style={{
						backgroundColor: backgroundColor,
						color: textColor
					}}
				>
					<div className="ub_testimonial_img">
						{!imgID ? (
							<div className="ub_testimonial_upload_button">
								<MediaUpload
									onSelect={onSelectImage}
									type="image"
									value={imgID}
									render={({ open }) => (
										<Button
											className="components-button button button-medium"
											onClick={open}
										>
											Upload Image
										</Button>
									)}
								/>
								<p>Ideal Image size is Square i.e 150x150.</p>
							</div>
						) : (
							<div>
								<img
									src={imgURL}
									alt={imgAlt}
									height={100}
									width={100}
								/>
								{isSelected ? (
									<Button onClick={onRemoveImage}>
										{icons.remove}
									</Button>
								) : null}
							</div>
						)}
					</div>
					<div className="ub_testimonial_content">
						<RichText
							tagName="p"
							placeholder={__(
								'This is the testimonial body. Add the testimonial text you want to add here.'
							)}
							className="ub_testimonial_text"
							style={{
								fontSize: textSize,
								textAlign: textAlign
							}}
							onChange={onChangeTestimonialText}
							value={ub_testimonial_text}
							keepPlaceholderOnFocus={true}
							formattingControls={[
								'bold',
								'strikethrough',
								'link'
							]}
							unstableOnFocus={() =>
								setState({ editable: 'testimonial_text' })
							}
						/>
					</div>
					<div className="ub_testimonial_sign">
						<RichText
							tagName="p"
							placeholder={__('John Doe')}
							style={{ textAlign: authorAlign }}
							className="ub_testimonial_author"
							onChange={onChangeTestimonialAuthor}
							value={ub_testimonial_author}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={() =>
								setState({ editable: 'author' })
							}
						/>
						<RichText
							tagName="p"
							placeholder={__('Founder, Company X')}
							style={{ textAlign: authorRoleAlign }}
							className="ub_testimonial_author_role"
							onChange={onChangeTestimonialAuthorRole}
							value={ub_testimonial_author_role}
							keepPlaceholderOnFocus={true}
							formattingControls={[
								'bold',
								'strikethrough',
								'link'
							]}
							unstableOnFocus={() =>
								setState({ editable: 'author_role' })
							}
						/>
					</div>
				</div>
			</div>
		];
	}),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function(props) {
		const {
			backgroundColor,
			textColor,
			textSize,
			imgURL,
			imgAlt,
			ub_testimonial_author,
			ub_testimonial_author_role,
			ub_testimonial_text,
			textAlign,
			authorAlign,
			authorRoleAlign
		} = props.attributes;
		return (
			<div className={props.className}>
				<div
					className="ub_testimonial"
					style={{
						backgroundColor: backgroundColor,
						color: textColor
					}}
				>
					<div className="ub_testimonial_img">
						<img
							src={imgURL}
							alt={imgAlt}
							height={100}
							width={100}
						/>
					</div>
					<div className="ub_testimonial_content">
						<p
							className="ub_testimonial_text"
							style={{
								fontSize: textSize,
								textAlign: textAlign
							}}
						>
							{ub_testimonial_text}
						</p>
					</div>
					<div className="ub_testimonial_sign">
						<p
							className="ub_testimonial_author"
							style={{ textAlign: authorAlign }}
						>
							{ub_testimonial_author}
						</p>
						<p
							className="ub_testimonial_author_role"
							style={{ textAlign: authorRoleAlign }}
						>
							{ub_testimonial_author_role}
						</p>
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes,
			save: version_1_1_2
		},
		{
			attributes,
			save: version_1_1_5
		}
	]
});
