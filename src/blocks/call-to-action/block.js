//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';
import icon from './icons/icon';

const { __ } = wp.i18n;
const { Component } = wp.element;
const { registerBlockType } = wp.blocks;
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
    Dashicon,
    IconButton,
    RangeControl,
    SelectControl
} = wp.components;

const {
    withState,
} = wp.compose;


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
registerBlockType('ub/call-to-action', {

    title: __('Call to Action'),
    icon: icon,
    category: 'ultimateblocks',
    keywords: [
        __('call to action'),
        __('conversion'),
        __('Ultimate Blocks'),
    ],
    attributes: {
        ub_call_to_action_headline_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_call_to_action_headline_text',
        },
        ub_cta_content_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_cta_content_text',
        },
        ub_cta_button_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_cta_button_text'
        },
        headFontSize: {
            type: 'number',
            default: 30
        },
        headColor: {
            type: 'string',
            default: '#444444'
        },
        contentFontSize: {
            type: 'number',
            default: 15
        },
        contentColor: {
            type: 'string',
            default: '#444444'
        },
        buttonFontSize: {
            type: 'number',
            default: 14
        },
        buttonColor: {
            type: 'string',
            default: '#E27330'
        },
        buttonTextColor: {
            type: 'string',
            default: '#ffffff'
        },
        buttonWidth: {
            type: 'number',
            default: 250
        },
        ctaBackgroundColor: {
            type: 'string',
            default: '#f8f8f8'
        },
        ctaBorderColor: {
            type: 'string',
            default: '#ECECEC'
        },
        ctaBorderSize: {
            type: 'number',
            default: 2
        },
        url: {
            type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'href',
        },
        contentAlign: {
            type: 'string',
            default: 'center'
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
    edit: withState({ editable: 'content' })(function (props) {

        const {
            isSelected,
            editable,
            setState
        } = props;

        const {
            ctaBackgroundColor,
            ctaBorderColor,
            ctaBorderSize,
            headFontSize,
            headColor,
            contentAlign,
            contentColor,
            contentFontSize,
            buttonWidth,
            buttonFontSize,
            buttonColor,
            buttonTextColor
        } = props.attributes

        const onSetActiveEditable = (newEditable) => () => {
            setState({ editable: newEditable })
        };

        // Creates a <p class='wp-block-cgb-block-click-to-tweet-block'></p>.
        return [

            isSelected && (
                <BlockControls key="controls" />
            ),

            isSelected && (
                <InspectorControls key="inspectors">
                    <PanelColorSettings
                        title={__('Color Settings')}
                        initialOpen={false}
                        colorSettings={[
                            {
                                value: ctaBackgroundColor,
                                onChange: colorValue => props.setAttributes({ ctaBackgroundColor: colorValue }),
                                label: __('Background Color')
                            },
                            {
                                value: ctaBorderColor,
                                onChange: colorValue => props.setAttributes({ ctaBorderColor: colorValue }),
                                label: __('Border Color')
                            }
                        ]}
                    />

                    <PanelBody
                        title={__('Headline Settings')}
                        initialOpen={false}
                    >

                        <RangeControl
                            label={__('Font Size')}
                            value={headFontSize}
                            onChange={(value) => props.setAttributes({ headFontSize: value })}
                            min={10}
                            max={200}
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <p>Color</p>
                        <ColorPalette
                            value={headColor}
                            onChange={(colorValue) => props.setAttributes({ headColor: colorValue })}
                        />

                    </PanelBody>

                    <PanelBody
                        title={__('Content Settings')}
                        initialOpen={false}
                    >
                        <SelectControl
                            label={__('Content Align')}
                            value={contentAlign}
                            onChange={(value) => props.setAttributes({ contentAlign: value })}
                            options={[
                                { value: 'left', label: __('Left') },
                                { value: 'center', label: __('Center') },
                                { value: 'right', label: __('Right') },
                                { value: 'justify', label: __('Justify') }
                            ]}
                        />

                        <RangeControl
                            label={__('Font Size')}
                            value={contentFontSize}
                            onChange={(value) => props.setAttributes({ contentFontSize: value })}
                            min={10}
                            max={200}
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <p>Color</p>
                        <ColorPalette
                            value={contentColor}
                            onChange={(colorValue) => props.setAttributes({ contentColor: colorValue })}
                        />

                    </PanelBody>

                    <PanelBody
                        title={__('Button Settings')}
                        initialOpen={false}
                    >

                        <RangeControl
                            label={__('Button Width')}
                            value={buttonWidth}
                            onChange={(value) => props.setAttributes({ buttonWidth: value })}
                            min={10}
                            max={500}
                            beforeIcon="editor-code"
                            allowReset
                        />

                        <RangeControl
                            label={__('Font Size')}
                            value={buttonFontSize}
                            onChange={(value) => props.setAttributes({ buttonFontSize: value })}
                            min={10}
                            max={200}
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <p>Button Color</p>
                        <ColorPalette
                            value={buttonColor}
                            onChange={(colorValue) => props.setAttributes({ buttonColor: colorValue })}
                        />

                        <p>Button Text Color</p>
                        <ColorPalette
                            value={buttonTextColor}
                            onChange={(colorValue) => props.setAttributes({ buttonTextColor: colorValue })}
                        />

                        <br />

                    </PanelBody>
                    <br />
                </InspectorControls>

            ),

            <div key={'editable'} className={props.className}>
                <div
                    className="ub_call_to_action"
                    style={{
                        backgroundColor: ctaBackgroundColor,
                        border: ctaBorderSize + 'px solid',
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
                                color: headColor
                            }}
                            onChange={(value) => props.setAttributes({ ub_call_to_action_headline_text: value })}
                            value={props.attributes.ub_call_to_action_headline_text}
                            isSelected={isSelected && editable === 'cta_headline'}
                            onFocus={onSetActiveEditable('cta_headline')}
                            keepPlaceholderOnFocus={true}
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
                            onChange={(value) => props.setAttributes({ ub_cta_content_text: value })}
                            value={props.attributes.ub_cta_content_text}
                            isSelected={isSelected && editable === 'cta_content'}
                            onFocus={onSetActiveEditable('cta_content')}
                            keepPlaceholderOnFocus={true}
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
                                onChange={(value) => props.setAttributes({ ub_cta_button_text: value })}
                                value={props.attributes.ub_cta_button_text}
                                isSelected={isSelected && editable === 'cta_button_text'}
                                onFocus={onSetActiveEditable('cta_button_text')}
                                keepPlaceholderOnFocus={true}
                            />
                        </span>
                    </div>
                </div>
                <div className="ub_call_to_action_url_input">
                    {
                        isSelected && (
                            <form
                                key={'form-link'}
                                onSubmit={(event) => event.preventDefault()}
                                className={`editor-format-toolbar__link-modal-line ub_cta_url_input_box`}>
                                <Dashicon icon={'admin-links'} />
                                <URLInput
                                    className="button-url"
                                    value={props.attributes.url}
                                    onChange={(value) => props.setAttributes({ url: value })}
                                />
                                <IconButton
                                    icon={'editor-break'}
                                    label={__('Apply')}
                                    type={'submit'}
                                />
                            </form>
                        )
                    }
                </div>
            </div>
        ];
    },
    ),

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    save: function (props) {
        return (
            <div className={props.className}>
                <div
                    className="ub_call_to_action"
                    style={{
                        backgroundColor: props.attributes.ctaBackgroundColor,
                        border: props.attributes.ctaBorderSize + 'px solid',
                        borderColor: props.attributes.ctaBorderColor
                    }}
                >
                    <div className="ub_call_to_action_headline">
                        <p
                            className="ub_call_to_action_headline_text"
                            style={{
                                fontSize: props.attributes.headFontSize + 'px',
                                color: props.attributes.headColor
                            }}
                        >
                            {props.attributes.ub_call_to_action_headline_text}
                        </p>
                    </div>
                    <div className="ub_call_to_action_content">
                        <p
                            className="ub_cta_content_text"
                            style={{
                                fontSize: props.attributes.contentFontSize + 'px',
                                color: props.attributes.contentColor,
                                textAlign: props.attributes.contentAlign

                            }}
                        >
                            {props.attributes.ub_cta_content_text}
                        </p>
                    </div>
                    <div className="ub_call_to_action_button">
                        <span
                            className={`wp-block-button ub_cta_button`}
                            style={{
                                backgroundColor: props.attributes.buttonColor,
                                width: props.attributes.buttonWidth + 'px'
                            }}
                        >
                            <a href={props.attributes.url} target="_blank">
                                <p
                                    className="ub_cta_button_text"
                                    style={{
                                        color: props.attributes.buttonTextColor,
                                        fontSize: props.attributes.buttonFontSize + 'px'
                                    }}
                                >
                                    {props.attributes.ub_cta_button_text}
                                </p>
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        );
    },
});
