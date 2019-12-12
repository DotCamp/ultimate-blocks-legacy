import { Fragment } from 'react';
import { generateIcon, dashesToCamelcase } from '../../common';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

const {
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
	PanelColorSettings,
	URLInput,
	RichText
} = wp.blockEditor || wp.editor;
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
const { __ } = wp.i18n;

export const allIcons = Object.assign(fas, fab);

export const iconSize = { small: 25, medium: 30, large: 35, larger: 40 };

export const blockControls = props => {
	return (
		<BlockControls>
			<BlockAlignmentToolbar
				value={props.attributes.align}
				onChange={newAlignment =>
					props.setAttributes({ align: newAlignment })
				}
				controls={['left', 'center', 'right']}
			/>
		</BlockControls>
	);
};

export const inspectorControls = props => {
	const BUTTON_SIZES = {
		small: __('S', 'ultimate-blocks'),
		medium: __('M', 'ultimate-blocks'),
		large: __('L', 'ultimate-blocks'),
		larger: __('XL', 'ultimate-blocks')
	};

	const BUTTON_WIDTHS = {
		fixed: __('Fixed', 'ultimate-blocks'),
		flex: __('Flexible', 'ultimate-blocks'),
		full: __('Full', 'ultimate-blocks')
	};

	const { setAttributes, setState, availableIcons, iconSearchTerm } = props;

	const {
		size,
		buttonRounded,
		chosenIcon,
		iconPosition,
		buttonColor,
		buttonHoverColor,
		buttonTextColor,
		buttonTextHoverColor,
		buttonIsTransparent,
		addNofollow,
		openInNewTab,
		buttonWidth
	} = props.attributes;
	return (
		<InspectorControls>
			<PanelBody title={__('Button Size', 'ultimate-blocks')}>
				<div className="blocks-font-size__main">
					<ButtonGroup
						aria-label={__('Button Size', 'ultimate-blocks')}
					>
						{Object.keys(BUTTON_SIZES).map(b => (
							<Button
								isLarge
								isPrimary={size === b}
								aria-pressed={size === b}
								onClick={() => setAttributes({ size: b })}
							>
								{BUTTON_SIZES[b]}
							</Button>
						))}
					</ButtonGroup>
				</div>
			</PanelBody>
			<PanelBody title={__('Button Width', 'ultimate-blocks')}>
				<div className="blocks-font-size__main">
					<ButtonGroup
						aria-label={__('Button Width', 'ultimate-blocks')}
					>
						{Object.keys(BUTTON_WIDTHS).map(b => (
							<Button
								isLarge
								isPrimary={buttonWidth === b}
								aria-pressed={buttonWidth === b}
								onClick={() =>
									setAttributes({ buttonWidth: b })
								}
							>
								{BUTTON_WIDTHS[b]}
							</Button>
						))}
					</ButtonGroup>
				</div>
			</PanelBody>
			<PanelBody title={__('Button Link Settings', 'ultimate-blocks')}>
				<CheckboxControl
					label={__('Open Link in New Tab', 'ultimate-blocks')}
					checked={openInNewTab}
					onChange={_ =>
						setAttributes({ openInNewTab: !openInNewTab })
					}
				/>
				<CheckboxControl
					label={__('Add Nofollow to Link', 'ultimate-blocks')}
					checked={addNofollow}
					onChange={_ => setAttributes({ addNofollow: !addNofollow })}
				/>
			</PanelBody>
			<PanelBody title={__('Button Style', 'ultimate-blocks')}>
				<ToggleControl
					label={__('Rounded', 'ultimate-blocks')}
					checked={buttonRounded}
					onChange={() =>
						setAttributes({
							buttonRounded: !buttonRounded
						})
					}
				/>
				<ToggleControl
					label={__('Transparent', 'ultimate-blocks')}
					checked={buttonIsTransparent}
					onChange={() =>
						setAttributes({
							buttonIsTransparent: !buttonIsTransparent
						})
					}
				/>
			</PanelBody>
			<PanelBody title={__('Button Icon', 'ultimate-blocks')}>
				<div className="ub-button-grid">
					<p>{__('Selected icon', 'ultimate-blocks')}</p>
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
										'Open icon selection dialog',
										'ultimate-blocks'
									)}
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							)}
							renderContent={_ => (
								<div>
									<input
										type="text"
										value={iconSearchTerm}
										onChange={e =>
											setState({
												iconSearchTerm: e.target.value
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
											{__('No icon', 'ultimate-blocks')}
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
													icon={generateIcon(i, 35)}
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
					<p>{__('Icon position', 'ultimate-blocks')}</p>
					<SelectControl
						className="ub-button-grid-selector"
						value={iconPosition}
						options={[
							{
								label: __('Left', 'ultimate-blocks'),
								value: 'left'
							},
							{
								label: __('Right', 'ultimate-blocks'),
								value: 'right'
							}
						]}
						onChange={pos => setAttributes({ iconPosition: pos })}
					/>
				</div>
			</PanelBody>
			<PanelColorSettings
				title={__('Button Colors', 'ultimate-blocks')}
				initialOpen={true}
				colorSettings={
					buttonIsTransparent
						? [
								{
									value: buttonColor,
									onChange: colorValue =>
										setAttributes({
											buttonColor: colorValue
										}),
									label: __('Button Color', 'ultimate-blocks')
								},
								{
									value: buttonHoverColor,
									onChange: colorValue =>
										setAttributes({
											buttonHoverColor: colorValue
										}),
									label: __(
										'Button Color on Hover',
										'ultimate-blocks'
									)
								}
						  ]
						: [
								{
									value: buttonColor,
									onChange: colorValue =>
										setAttributes({
											buttonColor: colorValue
										}),
									label: __(
										'Button Background',
										'ultimate-blocks'
									)
								},
								{
									value: buttonTextColor,
									onChange: colorValue =>
										setAttributes({
											buttonTextColor: colorValue
										}),
									label: __(
										'Button Text Color',
										'ultimate-blocks'
									)
								},
								{
									value: buttonHoverColor,
									onChange: colorValue =>
										setAttributes({
											buttonHoverColor: colorValue
										}),
									label: __(
										'Button Background on Hover',
										'ultimate-blocks'
									)
								},
								{
									value: buttonTextHoverColor,
									onChange: colorValue =>
										setAttributes({
											buttonTextHoverColor: colorValue
										}),
									label: __(
										'Button Text Color on Hover',
										'ultimate-blocks'
									)
								}
						  ]
				}
			/>
		</InspectorControls>
	);
};

export const editorDisplay = props => {
	const {
		isSelected,
		isMouseHovered,
		setState,
		setAttributes,
		attributes
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
		buttonWidth
	} = attributes;

	return (
		<Fragment>
			<div className={`ub-button-container align-button-${align}`}>
				<div
					className={`ub-button-block-main ub-button-${size} ${
						buttonWidth === 'full'
							? 'ub-button-full-width'
							: buttonWidth === 'flex'
							? `ub-button-flex-${size}`
							: ''
					}`}
					onMouseEnter={_ => setState({ isMouseHovered: true })}
					onMouseLeave={_ => setState({ isMouseHovered: false })}
					style={{
						backgroundColor: buttonIsTransparent
							? 'transparent'
							: isMouseHovered
							? buttonHoverColor
							: buttonColor,
						color: isMouseHovered
							? buttonIsTransparent
								? buttonHoverColor
								: buttonTextHoverColor
							: buttonIsTransparent
							? buttonColor
							: buttonTextColor,
						borderRadius: buttonRounded ? '60px' : '0px',
						borderStyle: buttonIsTransparent ? 'solid' : 'none',
						borderColor: buttonIsTransparent
							? isMouseHovered
								? buttonHoverColor
								: buttonColor
							: null
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
								<div className="ub-button-icon-holder">
									{generateIcon(
										allIcons[
											`fa${dashesToCamelcase(chosenIcon)}`
										],
										iconSize[size]
									)}
								</div>
							)}
						<RichText
							className="ub-button-block-btn"
							placeholder={__('Button Text', 'ultimate-blocks')}
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
						onSubmit={event => event.preventDefault()}
						className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
					>
						<div className="ub-icon-holder">
							<Icon icon="admin-links" />
						</div>
						<URLInput
							autoFocus={false}
							className="button-url"
							value={url}
							onChange={value => setAttributes({ url: value })}
						/>
						<IconButton
							icon={'editor-break'}
							label={__('Apply', 'ultimate-blocks')}
							type={'submit'}
						/>
					</form>
				)}
			</div>
		</Fragment>
	);
};
