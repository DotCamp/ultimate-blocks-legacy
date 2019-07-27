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
		small: 'S',
		medium: 'M',
		large: 'L',
		larger: 'XL'
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
		openInNewTab
	} = props.attributes;
	return (
		<InspectorControls>
			<PanelBody title={__('Button Size')}>
				<div className="blocks-font-size__main">
					<ButtonGroup aria-label={__('Button Size')}>
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
									label={__('Open icon selection dialog')}
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
					<p>{__('Icon position')}</p>
					<SelectControl
						className="ub-button-grid-selector"
						value={iconPosition}
						options={[
							{ label: __('Left'), value: 'left' },
							{ label: __('Right'), value: 'right' }
						]}
						onChange={pos => setAttributes({ iconPosition: pos })}
					/>
				</div>
			</PanelBody>
			<PanelColorSettings
				title={__('Button Colors')}
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
									label: __('Button Color')
								},
								{
									value: buttonHoverColor,
									onChange: colorValue =>
										setAttributes({
											buttonHoverColor: colorValue
										}),
									label: __('Button Color on Hover')
								}
						  ]
						: [
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
		buttonIsTransparent
	} = attributes;

	return (
		<Fragment>
			<div className={`ub-button-container align-button-${align}`}>
				<div
					className={`ub-button-block-main ub-button-${size}`}
					onMouseEnter={() => setState({ isMouseHovered: true })}
					onMouseLeave={() => setState({ isMouseHovered: false })}
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
						onSubmit={event => event.preventDefault()}
						className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
					>
						<div className="ub-icon-holder">
							<Icon icon="admin-links" />
						</div>
						<URLInput
							className="button-url"
							value={url}
							onChange={value => setAttributes({ url: value })}
						/>
						<IconButton
							icon={'editor-break'}
							label={__('Apply')}
							type={'submit'}
						/>
					</form>
				)}
			</div>
		</Fragment>
	);
};
