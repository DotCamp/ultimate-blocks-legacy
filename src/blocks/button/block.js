/**
 * BLOCK: Button Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icons';

//  Import CSS.
import './style.scss';
import './editor.scss';

import { version_1_1_2, version_1_1_4, version_1_1_5 } from './oldVersions';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	InspectorControls,
	BlockControls,
	URLInput,
	RichText,
	BlockAlignmentToolbar,
	PanelColorSettings
} = wp.editor;
const {
	PanelBody,
	IconButton,
	Icon,
	Button,
	ButtonGroup,
	ToggleControl
} = wp.components;

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

const attributes = {
	buttonText: {
		type: 'array',
		source: 'children',
		selector: '.ub-button-block-btn'
	},
	align: {
		type: 'string',
		default: 'center'
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href'
	},
	size: {
		type: 'string',
		default: 'medium'
	},
	buttonColor: {
		type: 'string',
		default: '#44c767'
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff'
	},
	buttonRounded: {
		type: 'boolean',
		default: 'false'
	}
};

registerBlockType('ub/button-block', {
	title: __('Button (Improved)'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Button'), __('Buttons'), __('Ultimate Blocks')],
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */ attributes,
	edit(props) {
		const { isSelected, setAttributes } = props;

		const {
			buttonText,
			align,
			url,
			size,
			buttonColor,
			buttonTextColor,
			buttonRounded
		} = props.attributes;

		const BUTTON_SIZES = {
			small: 'S',
			medium: 'M',
			large: 'L',
			larger: 'XL'
		};

		return [
			isSelected && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						onChange={newAlignment =>
							setAttributes({ align: newAlignment })
						}
						controls={['left', 'center', 'right']}
					/>
				</BlockControls>
			),

			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Button Size')}>
						<div className="blocks-font-size__main">
							<ButtonGroup aria-label={__('Button Size')}>
								{Object.keys(BUTTON_SIZES).map(b => (
									<Button
										isLarge
										isPrimary={size === b}
										aria-pressed={size === b}
										onClick={() =>
											setAttributes({ size: b })
										}
									>
										{BUTTON_SIZES[b]}
									</Button>
								))}
							</ButtonGroup>
						</div>
					</PanelBody>
					<PanelBody title={__('Button Style')}>
						<ToggleControl
							label={__('Rounded')}
							checked={buttonRounded}
							onChange={() =>
								setAttributes({
									buttonRounded: !buttonRounded
								})
							}
						/>
					</PanelBody>
					<PanelColorSettings
						title={__('Button Colors')}
						initialOpen={true}
						colorSettings={[
							{
								value: buttonColor,
								onChange: colorValue =>
									setAttributes({
										buttonColor: colorValue
									}),
								label: __('Button Background')
							},
							{
								value: buttonTextColor,
								onChange: colorValue =>
									props.setAttributes({
										buttonTextColor: colorValue
									}),
								label: __('Button Text Color')
							}
						]}
					/>
				</InspectorControls>
			),

			<div className={props.className}>
				<div
					className={'ub-button-container' + ' align-button-' + align}
				>
					<RichText
						placeholder={__('Button Text')}
						style={{
							backgroundColor: buttonColor,
							color: buttonTextColor,
							borderRadius: buttonRounded ? '60px' : '0px'
						}}
						className={'ub-button-block-btn' + ' ub-button-' + size}
						onChange={value => setAttributes({ buttonText: value })}
						value={buttonText}
						formattingControls={['bold', 'italic', 'strikethrough']}
						keepPlaceholderOnFocus={true}
					/>
				</div>
				<div className="ub_button_url_input">
					{isSelected && (
						<form
							key={'form-link'}
							onSubmit={event => event.preventDefault()}
							className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
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
								value={url}
								onChange={value =>
									setAttributes({ url: value })
								}
							/>
							<IconButton
								icon={'editor-break'}
								label={__('Apply')}
								type={'submit'}
							/>
						</form>
					)}
				</div>
			</div>
		];
	},

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
			buttonText,
			align,
			url,
			size,
			buttonColor,
			buttonTextColor,
			buttonRounded
		} = props.attributes;

		return (
			<div className={props.className}>
				<div
					className={'ub-button-container' + ' align-button-' + align}
				>
					<a
						href={url}
						target="_blank"
						className={'ub-button-block-btn' + ' ub-button-' + size}
						style={{
							backgroundColor: buttonColor,
							color: buttonTextColor,
							borderRadius: buttonRounded ? '60px' : '0px'
						}}
						rel="noopener noreferrer"
					>
						{buttonText}
					</a>
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
			save: version_1_1_4
		},
		{
			attributes,
			save: version_1_1_5
		}
	]
});
