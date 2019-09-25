const { __ } = wp.i18n;
import { Fragment } from 'react';

const {
	RichText,
	ColorPalette,
	InspectorControls,
	URLInput,
	BlockControls,
	PanelColorSettings
} = wp.editor;

const {
	PanelBody,
	Icon,
	IconButton,
	Toolbar,
	RangeControl,
	CheckboxControl
} = wp.components;

export const blockControls = props => {
	const { editable, attributes, setAttributes } = props;

	const { headAlign, contentAlign } = attributes;

	return (
		<BlockControls>
			{['header', 'content'].includes(editable) && (
				<Toolbar>
					{['left', 'center', 'right', 'justify']
						.slice(0, editable === 'header' ? 3 : 4)
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
								isActive={
									(editable === 'header'
										? headAlign
										: contentAlign) === a
								}
								onClick={_ =>
									setAttributes(
										editable === 'header'
											? { headAlign: a }
											: {
													contentAlign: a
											  }
									)
								}
							/>
						))}
				</Toolbar>
			)}
		</BlockControls>
	);
};

export const inspectorControls = props => {
	const { attributes, setAttributes } = props;

	const {
		ctaBackgroundColor,
		ctaBorderColor,
		headFontSize,
		headColor,
		contentColor,
		contentFontSize,
		buttonWidth,
		buttonFontSize,
		buttonColor,
		buttonTextColor,
		addNofollow,
		openInNewTab
	} = attributes;

	return (
		<InspectorControls>
			<PanelColorSettings
				title={__('Color Settings')}
				initialOpen={false}
				colorSettings={[
					{
						value: ctaBackgroundColor,
						onChange: colorValue =>
							setAttributes({
								ctaBackgroundColor: colorValue
							}),
						label: __('Background Color')
					},
					{
						value: ctaBorderColor,
						onChange: colorValue =>
							setAttributes({
								ctaBorderColor: colorValue
							}),
						label: __('Border Color')
					}
				]}
			/>

			<PanelBody title={__('Headline Settings')} initialOpen={false}>
				<RangeControl
					label={__('Font Size')}
					value={headFontSize}
					onChange={value => setAttributes({ headFontSize: value })}
					min={10}
					max={200}
					beforeIcon="editor-textcolor"
					allowReset
				/>
				<p>{__('Color')}</p>
				<ColorPalette
					value={headColor}
					onChange={colorValue =>
						setAttributes({ headColor: colorValue })
					}
				/>
			</PanelBody>

			<PanelBody title={__('Content Settings')} initialOpen={false}>
				<RangeControl
					label={__('Font Size')}
					value={contentFontSize}
					onChange={value =>
						setAttributes({ contentFontSize: value })
					}
					min={10}
					max={200}
					beforeIcon="editor-textcolor"
					allowReset
				/>
				<p>{__('Color')}</p>
				<ColorPalette
					value={contentColor}
					onChange={colorValue =>
						setAttributes({
							contentColor: colorValue
						})
					}
				/>
			</PanelBody>

			<PanelBody title={__('Button Settings')} initialOpen={false}>
				<RangeControl
					label={__('Button Width')}
					value={buttonWidth}
					onChange={value => setAttributes({ buttonWidth: value })}
					min={10}
					max={500}
					beforeIcon="editor-code"
					allowReset
				/>

				<RangeControl
					label={__('Font Size')}
					value={buttonFontSize}
					onChange={value => setAttributes({ buttonFontSize: value })}
					min={10}
					max={200}
					beforeIcon="editor-textcolor"
					allowReset
				/>
				<p>{__('Button Color')}</p>
				<ColorPalette
					value={buttonColor}
					onChange={colorValue =>
						setAttributes({ buttonColor: colorValue })
					}
				/>

				<p>{__('Button Text Color')}</p>
				<ColorPalette
					value={buttonTextColor}
					onChange={colorValue =>
						setAttributes({
							buttonTextColor: colorValue
						})
					}
				/>
			</PanelBody>
			<PanelBody title={__('Link Settings')} initialOpen={false}>
				<CheckboxControl
					label={__('Add Nofollow to Link')}
					checked={addNofollow}
					onChange={_ => setAttributes({ addNofollow: !addNofollow })}
				/>
				<CheckboxControl
					label={__('Open Link in New Tab')}
					checked={openInNewTab}
					onChange={_ =>
						setAttributes({ openInNewTab: !openInNewTab })
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export const editorDisplay = props => {
	const { isSelected, setState, attributes, setAttributes } = props;

	const {
		ctaBackgroundColor,
		ctaBorderColor,
		ctaBorderSize,
		headFontSize,
		headColor,
		headAlign,
		contentAlign,
		contentColor,
		contentFontSize,
		buttonWidth,
		buttonFontSize,
		buttonColor,
		buttonTextColor,
		ub_call_to_action_headline_text,
		ub_cta_content_text,
		ub_cta_button_text
	} = attributes;
	return (
		<Fragment>
			<div
				className="ub_call_to_action"
				style={{
					backgroundColor: ctaBackgroundColor,
					borderWidth: ctaBorderSize + 'px',
					borderColor: ctaBorderColor
				}}
			>
				<div className="ub_call_to_action_headline">
					<RichText
						tagName="p"
						placeholder={__('CTA Title Goes Here')}
						className="ub_call_to_action_headline_text"
						style={{
							fontSize: headFontSize + 'px',
							color: headColor,
							textAlign: headAlign
						}}
						onChange={value =>
							setAttributes({
								ub_call_to_action_headline_text: value
							})
						}
						value={ub_call_to_action_headline_text}
						formattingControls={['bold', 'italic', 'strikethrough']}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => setState({ editable: 'header' })}
					/>
				</div>

				<div className="ub_call_to_action_content">
					<RichText
						tagName="p"
						placeholder={__('Add Call to Action Text Here')}
						className="ub_cta_content_text"
						style={{
							fontSize: contentFontSize + 'px',
							color: contentColor,
							textAlign: contentAlign
						}}
						onChange={value =>
							setAttributes({
								ub_cta_content_text: value
							})
						}
						value={ub_cta_content_text}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={_ => setState({ editable: 'content' })}
					/>
				</div>

				<div className="ub_call_to_action_button">
					<span
						className={`wp-block-button ub_cta_button`}
						style={{
							backgroundColor: buttonColor,
							width: buttonWidth + 'px'
						}}
					>
						<RichText
							tagName="p"
							placeholder={__('Button Text')}
							className="ub_cta_button_text"
							style={{
								color: buttonTextColor,
								fontSize: buttonFontSize + 'px'
							}}
							onChange={value =>
								setAttributes({
									ub_cta_button_text: value
								})
							}
							value={ub_cta_button_text}
							keepPlaceholderOnFocus={true}
							unstableOnFocus={_ =>
								setState({ editable: 'button' })
							}
						/>
					</span>
				</div>
			</div>
			<div className="ub_call_to_action_url_input">
				{isSelected && (
					<form
						onSubmit={event => event.preventDefault()}
						className={`editor-format-toolbar__link-modal-line ub_cta_url_input_box flex-container`}
					>
						<div className="ub-icon-holder">
							<Icon icon="admin-links" />
						</div>
						<URLInput
							className="button-url"
							value={props.attributes.url}
							onChange={value => setAttributes({ url: value })}
							unstableOnFocus={_ =>
								setState({ editable: 'URLInput' })
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
		</Fragment>
	);
};
