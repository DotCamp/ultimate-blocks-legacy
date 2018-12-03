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

const { withState } = wp.compose;

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
registerBlockType('ub/button-block', {
	title: __('Button (Improved)'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Button'), __('Buttons'), __('Ultimate Blocks')],
	attributes: {
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
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withState({ editable: 'content' })(function(props) {
		const { isSelected, editable, setState } = props;

		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};

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
			small: 'small',
			medium: 'medium',
			large: 'large',
			larger: 'larger'
		};

		return [
			isSelected && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						onChange={newAlignment =>
							props.setAttributes({ align: newAlignment })
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
								<Button
									isLarge
									isPrimary={size === BUTTON_SIZES['small']}
									aria-pressed={
										size === BUTTON_SIZES['small']
									}
									onClick={() =>
										props.setAttributes({ size: 'small' })
									}
								>
									S
								</Button>
								<Button
									isLarge
									isPrimary={size === BUTTON_SIZES['medium']}
									aria-pressed={
										size === BUTTON_SIZES['medium']
									}
									onClick={() =>
										props.setAttributes({ size: 'medium' })
									}
								>
									M
								</Button>
								<Button
									isLarge
									isPrimary={size === BUTTON_SIZES['large']}
									aria-pressed={
										size === BUTTON_SIZES['large']
									}
									onClick={() =>
										props.setAttributes({ size: 'large' })
									}
								>
									L
								</Button>
								<Button
									isLarge
									isPrimary={size === BUTTON_SIZES['larger']}
									aria-pressed={
										size === BUTTON_SIZES['larger']
									}
									onClick={() =>
										props.setAttributes({ size: 'larger' })
									}
								>
									XL
								</Button>
							</ButtonGroup>
						</div>
					</PanelBody>
					<PanelBody title={__('Button Style')}>
						<ToggleControl
							label={__('Rounded')}
							checked={buttonRounded}
							onChange={() =>
								props.setAttributes({
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
									props.setAttributes({
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

			<div key={'editable'} className={props.className}>
				<div
					className={'ub-button-container' + ' align-button-' + align}
				>
					<RichText
						tagName="p"
						placeholder={__('Button Text')}
						style={{
							backgroundColor: buttonColor,
							color: buttonTextColor,
							borderRadius: buttonRounded ? '60px' : '0px'
						}}
						className={'ub-button-block-btn' + ' ub-button-' + size}
						onChange={value =>
							props.setAttributes({ buttonText: value })
						}
						value={buttonText}
						formattingControls={['bold', 'italic', 'strikethrough']}
						isSelected={isSelected && editable === 'button_text'}
						onFocus={onSetActiveEditable('button_text')}
						keepPlaceholderOnFocus={true}
					/>
				</div>
				<div className="ub_button_url_input">
					{focus && (
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
									props.setAttributes({ url: value })
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
					>
						{buttonText}
					</a>
				</div>
			</div>
		);
	}
});
