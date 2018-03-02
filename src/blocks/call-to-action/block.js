//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';
import icon from './icons/icon';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component } = wp.element;
const {
    registerBlockType,
    RichText,
    ColorPalette,
    InspectorControls,
    UrlInput,
} = wp.blocks;

const {
    Toolbar,
    Button,
    PanelColor,
    PanelBody,
    PanelRow,
    Dashicon,
    IconButton,
    FormToggle,
    RangeControl
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
registerBlockType( 'ub/call-to-action', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Call to Action' ), // Block title.
    icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'call to action' ),
        __( 'conversion' ),
        __( 'optimize' ),
    ],
    attributes: {
        ub_call_to_action_headline_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_call_to_action_headline_text',
            default: 'This is the headline.'
        },
        ub_cta_content_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_cta_content_text',
            default: 'Content area for the call to action box. Utilize it to state why the action should be taken.'
        },
        ub_cta_button_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_cta_button_text',
            default: 'Get Started'
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
            default: 14
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

    },

    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     *
     * The "edit" property must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    edit: function( props ) {

        // Creates a <p class='wp-block-cgb-block-click-to-tweet-block'></p>.
        return [

            !! props.focus && (
                <InspectorControls key="inspectors">

                    <p>Background Color</p>
                    <ColorPalette
                        value={ props.attributes.ctaBackgroundColor }
                        onChange={ ( colorValue ) => props.setAttributes( { ctaBackgroundColor: colorValue } ) }
                        allowReset
                    />

                    <p>Border Color</p>
                    <ColorPalette
                        value={ props.attributes.ctaBorderColor }
                        onChange={ ( colorValue ) => props.setAttributes( { ctaBorderColor: colorValue } ) }
                        allowReset
                    />

                    <PanelBody
                        title={ __( 'Headline Settings' ) }
                        initialOpen={ false }
                    >

                        <RangeControl
                            label={ __( 'Font Size' ) }
                            value={ props.attributes.headFontSize }
                            onChange={ ( value ) => props.setAttributes( { headFontSize: value } ) }
                            min={ 10 }
                            max={ 200 }
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <p>Color</p>
                        <ColorPalette
                            value={ props.attributes.headColor }
                            onChange={ ( colorValue ) => props.setAttributes( { headColor: colorValue } ) }
                        />

                    </PanelBody>

                    <PanelBody
                        title={ __( 'Content Settings' ) }
                        initialOpen={ false }
                    >

                        <RangeControl
                            label={ __( 'Font Size' ) }
                            value={ props.attributes.contentFontSize }
                            onChange={ ( value ) => props.setAttributes( { contentFontSize: value } ) }
                            min={ 10 }
                            max={ 200 }
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <p>Color</p>
                        <ColorPalette
                            value={ props.attributes.contentColor }
                            onChange={ ( colorValue ) => props.setAttributes( { contentColor: colorValue } ) }
                        />

                    </PanelBody>

                    <PanelBody
                        title={ __( 'Button Settings' ) }
                        initialOpen={ false }
                    >

                        <RangeControl
                            label={ __( 'Button Width' ) }
                            value={ props.attributes.buttonWidth }
                            onChange={ ( value ) => props.setAttributes( { buttonWidth: value } ) }
                            min={ 10 }
                            max={ 500 }
                            beforeIcon="editor-code"
                            allowReset
                        />

                        <RangeControl
                            label={ __( 'Font Size' ) }
                            value={ props.attributes.buttonFontSize }
                            onChange={ ( value ) => props.setAttributes( { buttonFontSize: value } ) }
                            min={ 10 }
                            max={ 200 }
                            beforeIcon="editor-textcolor"
                            allowReset
                        />
                        <p>Button Color</p>
                        <ColorPalette
                            value={ props.attributes.buttonColor }
                            onChange={ ( colorValue ) => props.setAttributes( { buttonColor: colorValue } ) }
                        />

                        <p>Button Text Color</p>
                        <ColorPalette
                            value={ props.attributes.buttonTextColor }
                            onChange={ ( colorValue ) => props.setAttributes( { buttonTextColor: colorValue } ) }
                        />

                        <br/>

                    </PanelBody>
                    <br/>
                </InspectorControls>

            ),

            <div className={ props.className }>
                <div
                    className="ub_call_to_action"
                    style={{
                        backgroundColor: props.attributes.ctaBackgroundColor,
                        border: props.attributes.ctaBorderSize + 'px solid',
                        borderColor: props.attributes.ctaBorderColor
                    }}
                >

                    <div className="ub_call_to_action_headline">
                        <RichText
                            tagName="p"
                            className="ub_call_to_action_headline_text"
                            style={{
                                fontSize: props.attributes.headFontSize + 'px',
                                color: props.attributes.headColor
                            }}
                            onChange={ ( value ) => props.setAttributes( { ub_call_to_action_headline_text: value } ) }
                            value={ props.attributes.ub_call_to_action_headline_text }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>

                    <div className="ub_call_to_action_content">
                        <RichText
                            tagName="p"
                            className="ub_cta_content_text"
                            style={{
                                fontSize: props.attributes.contentFontSize + 'px',
                                color: props.attributes.contentColor
                            }}
                            onChange={ ( value ) => props.setAttributes( { ub_cta_content_text: value } ) }
                            value={ props.attributes.ub_cta_content_text }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>

                    <div className="ub_call_to_action_button">
                        <span
                            className={`wp-block-button ub_cta_button`}
                            style={{
                                backgroundColor: props.attributes.buttonColor,
                                width: props.attributes.buttonWidth + 'px'
                            }}
                        >
                            <RichText
                                tagName="p"
                                className="ub_cta_button_text"
                                style={{
                                    color: props.attributes.buttonTextColor,
                                    fontSize: props.attributes.buttonFontSize + 'px'
                                }}
                                onChange={ ( value ) => props.setAttributes( { ub_cta_button_text: value } ) }
                                value={ props.attributes.ub_cta_button_text }
                                focus={ props.focus }
                                keepPlaceholderOnFocus={true}
                            />
                        </span>
                    </div>
                </div>
                <div className="ub_call_to_action_url_input">
                    {
                        focus && (
                            <form
                                key={ 'form-link' }
                                onSubmit={ ( event ) => event.preventDefault() }
                                className={ `blocks-button__inline-link ub_cta_url_input_box`}>
                                <Dashicon icon={ 'admin-links' } />
                                <UrlInput
                                    value={ props.attributes.url }
                                    onChange={ ( value ) => props.setAttributes( { url: value } ) }
                                />
                                <IconButton
                                    icon={ 'editor-break' }
                                    label={ __( 'Apply' ) }
                                    type={ 'submit' }
                                />
                            </form>
                        )
                    }
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
    save: function( props ) {
        return (
            <div className={ props.className }>
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
                            { props.attributes.ub_call_to_action_headline_text }
                        </p>
                    </div>
                    <div className="ub_call_to_action_content">
                        <p
                            className="ub_cta_content_text"
                            style={{
                                fontSize: props.attributes.contentFontSize + 'px',
                                color: props.attributes.contentColor
                            }}
                        >
                            { props.attributes.ub_cta_content_text }
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
                            <a href={ props.attributes.url } target="_blank">
                                <p
                                    className="ub_cta_button_text"
                                    style={{
                                        color: props.attributes.buttonTextColor,
                                        fontSize: props.attributes.buttonFontSize + 'px'
                                    }}
                                >
                                    { props.attributes.ub_cta_button_text }
                                </p>
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        );
    },
} );