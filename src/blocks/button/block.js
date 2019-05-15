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

import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

const { withState } = wp.compose;
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
	ToggleControl,
	Dropdown,
	CheckboxControl,
	SelectControl
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
		selector: '.ub-button-block-btn',
		default: 'Button Text'
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
		default: '#313131'
	},
	buttonHoverColor: {
		type: 'string',
		default: '#313131'
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff'
	},
	buttonTextHoverColor: {
		type: 'string',
		default: '#ffffff'
	},
	buttonRounded: {
		type: 'boolean',
		default: false
	},
	chosenIcon: {
		type: 'string',
		default: ''
	},
	iconPosition: {
		type: 'string',
		default: 'left'
	},
	buttonIsTransparent: {
		type: 'boolean',
		default: false
	},
	addNofollow: {
		type: 'boolean',
		default: true
	},
	openInNewTab: {
		type: 'boolean',
		default: true
	}
};

const dashesToCamelcase = str =>
	str
		.split('-')
		.map(s => s[0].toUpperCase() + s.slice(1))
		.join('');

const generateIcon = (selectedIcon, size) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height={size}
		width={size}
		viewBox={`0, 0, ${selectedIcon.icon[0]}, ${selectedIcon.icon[1]}`}
	>
		<path fill={'currentColor'} d={selectedIcon.icon[4]} />
	</svg>
);

const iconSize = { small: 25, medium: 30, large: 35, larger: 40 };

const allIcons = Object.assign(fas, fab);

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
	edit: withState({
		isMouseHovered: false,
		availableIcons: [],
		iconSearchTerm: ''
	})(function(props) {
		const {
			isSelected,
			setAttributes,
			isMouseHovered,
			setState,
			availableIcons,
			iconSearchTerm
		} = props;

		const {
			buttonText,
			align,
			url,
			size,
			buttonColor,
			buttonTextColor,
			buttonHoverColor,
			buttonTextHoverColor,
			buttonRounded,
			chosenIcon,
			iconPosition,
			buttonIsTransparent,
			addNofollow,
			openInNewTab
		} = props.attributes;

		const BUTTON_SIZES = {
			small: 'S',
			medium: 'M',
			large: 'L',
			larger: 'XL'
		};

		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map(name => allIcons[name]) });
		}

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
					<PanelBody title={__('Button Link Settings')}>
						<CheckboxControl
							label={__('Open Link in New Tab')}
							checked={openInNewTab}
							onChange={() =>
								setAttributes({ openInNewTab: !openInNewTab })
							}
						/>
						<CheckboxControl
							label={__('Add Nofollow to Link')}
							checked={addNofollow}
							onChange={() =>
								setAttributes({ addNofollow: !addNofollow })
							}
						/>
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
						<ToggleControl
							label={__('Transparent')}
							checked={buttonIsTransparent}
							onChange={() =>
								setAttributes({
									buttonIsTransparent: !buttonIsTransparent
								})
							}
						/>
					</PanelBody>
					<PanelBody title={__('Button Icon')}>
						<div className="ub-button-grid">
							<p>{__('Selected icon')}</p>
							<div className="ub-button-grid-selector">
								<Dropdown
									position="bottom right"
									renderToggle={({ isOpen, onToggle }) => (
										<IconButton
											className="ub-button-icon-select"
											icon={
												chosenIcon !== '' &&
												generateIcon(
													allIcons[
														`fa${dashesToCamelcase(
															chosenIcon
														)}`
													],
													35
												)
											}
											label={__(
												'Open icon selection dialog'
											)}
											onClick={onToggle}
											aria-expanded={isOpen}
										/>
									)}
									renderContent={() => (
										<div>
											<input
												type="text"
												value={iconSearchTerm}
												onChange={e =>
													setState({
														iconSearchTerm:
															e.target.value
													})
												}
											/>
											{iconSearchTerm === '' && (
												<Button
													className="ub-button-available-icon"
													onClick={() =>
														setAttributes({
															chosenIcon: ''
														})
													}
												>
													{__('No icon')}
												</Button>
											)}
											<br />
											{availableIcons.length > 0 &&
												availableIcons
													.filter(i =>
														i.iconName.includes(
															iconSearchTerm
														)
													)
													.map(i => (
														<IconButton
															className="ub-button-available-icon"
															icon={generateIcon(
																i,
																35
															)}
															label={i.iconName}
															onClick={() => {
																setAttributes({
																	chosenIcon:
																		i.iconName
																});
															}}
														/>
													))}
										</div>
									)}
								/>
							</div>
							<p>{__('Icon position')}</p>
							<SelectControl
								className="ub-button-grid-selector"
								value={iconPosition}
								options={[
									{ label: __('Left'), value: 'left' },
									{ label: __('Right'), value: 'right' }
								]}
								onChange={pos =>
									setAttributes({ iconPosition: pos })
								}
							/>
						</div>
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
									setAttributes({
										buttonTextColor: colorValue
									}),
								label: __('Button Text Color')
							},
							{
								value: buttonHoverColor,
								onChange: colorValue =>
									setAttributes({
										buttonHoverColor: colorValue
									}),
								label: __('Button Background on Hover')
							},
							{
								value: buttonTextHoverColor,
								onChange: colorValue =>
									setAttributes({
										buttonTextHoverColor: colorValue
									}),
								label: __('Button Text Color on Hover')
							}
						]}
					/>
				</InspectorControls>
			),

			<div className={props.className}>
				<div
					className={`ub-button-container align-button-${align}`}
					onMouseEnter={() => setState({ isMouseHovered: true })}
					onMouseLeave={() => setState({ isMouseHovered: false })}
				>
					<div
						className={`ub-button-block-main ub-button-${size}`}
						style={{
							backgroundColor: buttonIsTransparent
								? 'transparent'
								: isMouseHovered
								? buttonHoverColor
								: buttonColor,
							color: isMouseHovered
								? buttonTextHoverColor
								: buttonTextColor,
							borderRadius: buttonRounded ? '60px' : '0px',
							borderStyle: buttonIsTransparent ? 'solid' : 'none',
							borderColor: buttonIsTransparent
								? buttonColor
								: null
						}}
					>
						<div
							className="ub-button-content-holder"
							style={{
								flexDirection:
									iconPosition === 'left'
										? 'row'
										: 'row-reverse'
							}}
						>
							{chosenIcon !== '' &&
								allIcons.hasOwnProperty(
									`fa${dashesToCamelcase(chosenIcon)}`
								) && (
									<div className="ub-button-icon-holder">
										{generateIcon(
											allIcons[
												`fa${dashesToCamelcase(
													chosenIcon
												)}`
											],
											iconSize[size]
										)}
									</div>
								)}
							<RichText
								className="ub-button-block-btn"
								placeholder={__('Button Text')}
								onChange={value =>
									setAttributes({ buttonText: value })
								}
								value={buttonText}
								formattingControls={[
									'bold',
									'italic',
									'strikethrough'
								]}
								keepPlaceholderOnFocus={true}
							/>
						</div>
					</div>
				</div>
				<div className="ub_button_url_input">
					{isSelected && (
						<form
							key={'form-link'}
							onSubmit={event => event.preventDefault()}
							className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
						>
							<div className="ub-button-confirm-url">
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
			buttonHoverColor,
			buttonTextHoverColor,
			buttonRounded,
			chosenIcon,
			iconPosition,
			buttonIsTransparent,
			addNofollow,
			openInNewTab
		} = props.attributes;

		return (
			<div
				className={`${
					props.className
				} ub-button-container align-button-${align}`}
			>
				<a
					href={url}
					target={openInNewTab ? '_blank' : '_self'}
					rel={`noopener noreferrer${addNofollow ? ' nofollow' : ''}`}
					className={`ub-button-block-main ub-button-${size}`}
					data-defaultColor={buttonColor}
					data-defaultTextColor={buttonTextColor}
					data-hoverColor={buttonHoverColor}
					data-hoverTextColor={buttonTextHoverColor}
					data-buttonIsTransparent={buttonIsTransparent}
					style={{
						backgroundColor: buttonIsTransparent
							? 'transparent'
							: buttonColor,
						color: buttonTextColor,
						borderRadius: buttonRounded ? '60px' : '0px',
						borderStyle: buttonIsTransparent ? 'solid' : 'none',
						borderColor: buttonIsTransparent ? buttonColor : null
					}}
				>
					<div
						className="ub-button-content-holder"
						style={{
							flexDirection:
								iconPosition === 'left' ? 'row' : 'row-reverse'
						}}
					>
						{chosenIcon !== '' &&
							allIcons.hasOwnProperty(
								`fa${dashesToCamelcase(chosenIcon)}`
							) && (
								<span className="ub-button-icon-holder">
									{generateIcon(
										allIcons[
											`fa${dashesToCamelcase(chosenIcon)}`
										],
										iconSize[size]
									)}
								</span>
							)}
						<span className={'ub-button-block-btn'}>
							{buttonText}
						</span>
					</div>
				</a>
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
