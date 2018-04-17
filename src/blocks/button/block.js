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

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
    registerBlockType,
    InspectorControls,
    AlignmentToolbar,
    BlockControls,
    ColorPalette,
    UrlInput,
    RichText,
    BlockAlignmentToolbar
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
    PanelBody,
    Toolbar,
    IconButton,
    RangeControl,
    Dashicon,
    withState,
    Button,
    ButtonGroup
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
registerBlockType( 'ub/button-block', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Button (Improved)' ), // Block title.
    icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'Button' ),
        __( 'Buttons' ),
        __( 'Content' ),
    ],
    attributes: {
        buttonText: {
            type: 'array',
            source: 'children',
            selector: '.ub-button-block-btn',
            default: 'Default Button Text'
        },
        align: {
            type: 'string',
            default: 'left'
        },
        url: {
            type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'href',
        },
        size: {
            type: 'string',
            default: 'medium'
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
    edit: withState( { editable: 'content', } ) ( function( props )
        {
            const {
                isSelected,
                editable,
                setState
            } = props;

            const onSetActiveEditable = ( newEditable ) => () => {
                setState( { editable: newEditable } )
            };

            const {
                buttonText,
                align,
                url,
                size
            } = props.attributes;

            const BUTTON_SIZES = {
                small: 'small',
                medium: 'medium',
                large: 'large',
                larger: 'larger'
            };

            const changeButtonSize = ( buttonSizeValue ) => () => {
                props.setAttributes( { size: buttonSizeValue } )
            };

            return [

                isSelected && (
                    <BlockControls key="controls"/>,
                        <BlockControls>
                            <BlockAlignmentToolbar
                                value={ align }
                                onChange={ ( newAlignment ) => props.setAttributes( { align: newAlignment } ) }
                                controls={ [ 'left', 'center', 'right' ] }
                            />
                        </BlockControls>
                ),

                isSelected && (
                    <InspectorControls>
                        <PanelBody title={ __( 'Button Size' ) }>
                            <div className="blocks-font-size__main">
                                <ButtonGroup aria-label={ __( 'Button Size' ) }>
                                    <Button
                                        isLarge
                                        isPrimary={ props.attributes.size === BUTTON_SIZES [ 'small' ] }
                                        aria-pressed={ props.attributes.size === BUTTON_SIZES [ 'small' ] }
                                        onClick={ () => props.setAttributes( { size: 'small' } ) }
                                    >
                                        S
                                    </Button>
                                    <Button
                                        isLarge
                                        isPrimary={ props.attributes.size === BUTTON_SIZES [ 'medium' ] }
                                        aria-pressed={ props.attributes.size === BUTTON_SIZES [ 'medium' ] }
                                        onClick={ () => props.setAttributes( { size: 'medium' } ) }
                                    >
                                        M
                                    </Button>
                                    <Button
                                        isLarge
                                        isPrimary={ props.attributes.size === BUTTON_SIZES [ 'large' ] }
                                        aria-pressed={ props.attributes.size === BUTTON_SIZES [ 'large' ] }
                                        onClick={ () => props.setAttributes( { size: 'large' } ) }
                                    >
                                        L
                                    </Button>
                                    <Button
                                        isLarge
                                        isPrimary={ props.attributes.size === BUTTON_SIZES [ 'larger' ] }
                                        aria-pressed={ props.attributes.size === BUTTON_SIZES [ 'larger' ] }
                                        onClick={ () => props.setAttributes( { size: 'larger' } ) }
                                    >
                                        XL
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </PanelBody>
                    </InspectorControls>
                ),

                <div key={ 'editable' } className={ props.className }>
                    <div
                        className={ 'ub-button-container' + ' align-button-' + props.attributes.align }
                    >
                        <RichText
                            tagName="p"
                            className="ub-button-block-btn"
                            onChange={ ( value ) => props.setAttributes( { buttonText: value } ) }
                            value={ buttonText }
                            isSelected={ isSelected && editable === 'button_text' }
                            onFocus={ onSetActiveEditable( 'button_text' ) }
                            keepPlaceholderOnFocus={ true }
                        />
                    </div>
                    <br/>
                    <div className="ub_button_url_input">
                        {
                            focus && (
                                <form
                                    key={ 'form-link' }
                                    onSubmit={ ( event ) => event.preventDefault() }
                                    className={ `blocks-button__inline-link ub_button_input_box`}>
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
        }
    ),

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
                    className={ 'ub-button-container' + ' align-button-' + props.attributes.align }
                >
                    <p className="ub-button-block-btn"> { props.attributes.buttonText } </p>
                </div>
            </div>
        );
    },
} );
