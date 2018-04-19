import icons from './icons';

//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';
import Inspector from "../social-share/inspector";

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
    registerBlockType,
    RichText,
    BlockControls,
    MediaUpload,
    InspectorControls,
    ColorPalette
} = wp.blocks;

const {
    Button,
    PanelColor,
    withState
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
registerBlockType( 'ub/testimonial-block', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Testimonial' ), // Block title.
    icon: icons.testimonial, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'testimonial' ),
        __( 'quotes' ),
        __( 'customer' ),
    ],
    attributes: {
        ub_testimonial_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_testimonial_text',
            default: 'This is the testimonial body. Replace this with the testimonial text you want to add here.'
        },
        ub_testimonial_author: {
            type: 'array',
            source: 'children',
            selector: '.ub_testimonial_author',
            default: 'John Doe'
        },
        ub_testimonial_author_role: {
            type: 'array',
            source: 'children',
            selector: '.ub_testimonial_author_role',
            default: 'Founder, Company X'
        },
        imgURL: {
            type: 'string',
            source: 'attribute',
            attribute: 'src',
            selector: 'img',
        },
        imgID: {
            type: 'number',
        },
        imgAlt: {
            type: 'string',
            source: 'attribute',
            attribute: 'alt',
            selector: 'img',
        },
        backgroundColor: {
            type: 'string',
            default: '#f4f6f6'
        },
        textColor: {
            type: 'string',
            default: '#444444'
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

            const onChangeTestimonialText = value => {
                props.setAttributes( { ub_testimonial_text: value } );
            };

            const onChangeTestimonialAuthor = value => {
                props.setAttributes( { ub_testimonial_author: value } );
            };

            const onChangeTestimonialAuthorRole = value => {
                props.setAttributes( { ub_testimonial_author_role: value } );
            };

            const onSelectImage = img => {
                props.setAttributes( {
                    imgID: img.id,
                    imgURL: img.url,
                    imgAlt: img.alt,
                } );
            };
            const onRemoveImage = () => {
                props.setAttributes({
                    imgID: null,
                    imgURL: null,
                    imgAlt: null,
                });
            };

            return [

                isSelected && (
                    <BlockControls key="controls"/>
                ),

                isSelected && (
                    <InspectorControls>
                        <PanelColor
                            title={ __( 'Background Color' ) }
                            colorValue={ props.attributes.backgroundColor }
                            initialOpen={ true }
                        >
                            <ColorPalette
                                value={ props.attributes.backgroundColor }
                                onChange={ ( colorValue ) => props.setAttributes( { backgroundColor: colorValue } ) }
                                allowReset
                            />
                        </PanelColor>
                        <PanelColor
                            title={ __( 'Text Color' ) }
                            colorValue={ props.attributes.textColor }
                            initialOpen={ true }
                        >
                            <ColorPalette
                                value={ props.attributes.textColor }
                                onChange={ ( colorValue ) => props.setAttributes( { textColor: colorValue } ) }
                                allowReset
                            />
                        </PanelColor>
                    </InspectorControls>
                ),

                <div className={ props.className }>
                    <div
                        className="ub_testimonial"
                        style={{
                            backgroundColor: props.attributes.backgroundColor,
                            color: props.attributes.textColor
                        }}
                    >
                        <div className="ub_testimonial_img">
                            { ! props.attributes.imgID ? (

                                <div className="ub_testimonial_upload_button">
                                    <MediaUpload
                                        onSelect={ onSelectImage }
                                        type="image"
                                        value={ props.attributes.imgID }
                                        render={ ( { open } ) => (
                                            <Button
                                                className="components-button button button-medium"
                                                onClick={ open }>
                                                Upload Image
                                            </Button>
                                        ) }
                                    />
                                    <p>Ideal Image size is Square i.e 150x150.</p>
                                </div>

                            ) : (

                                <p>
                                    <img
                                        src={ props.attributes.imgURL }
                                        alt={ props.attributes.imgAlt }
                                        height={ 100 }
                                        width={ 100 }
                                    />
                                    { props.focus ? (
                                        <Button
                                            className="remove-image"
                                            onClick={ onRemoveImage }
                                        >
                                            { icons.remove }
                                        </Button>
                                    ) : null }
                                </p>
                            )}
                        </div>
                        <div className="ub_testimonial_content">
                            <RichText
                                tagName="p"
                                className="ub_testimonial_text"
                                onChange={ onChangeTestimonialText }
                                value={ props.attributes.ub_testimonial_text }
                                isSelected={ isSelected && editable === 'testimonial_content' }
                                onFocus={ onSetActiveEditable( 'testimonial_content' ) }
                                keepPlaceholderOnFocus={ true }
                            />
                        </div>
                        <div className="ub_testimonial_sign">
                            <RichText
                                tagName="p"
                                className="ub_testimonial_author"
                                onChange={ onChangeTestimonialAuthor }
                                value={ props.attributes.ub_testimonial_author }
                                isSelected={ isSelected && editable === 'testimonial_author' }
                                onFocus={ onSetActiveEditable( 'testimonial_author' ) }
                                keepPlaceholderOnFocus={ true }
                            />
                            <RichText
                                tagName="i"
                                className="ub_testimonial_author_role"
                                onChange={ onChangeTestimonialAuthorRole }
                                value={ props.attributes.ub_testimonial_author_role }
                                isSelected={ isSelected && editable === 'testimonial_author_role' }
                                onFocus={ onSetActiveEditable( 'testimonial_author_role' ) }
                                keepPlaceholderOnFocus={ true }
                            />
                        </div>
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
    save: function( props ) {
        return (
            <div className={ props.className }>
                <div
                    className="ub_testimonial"
                    style={{
                        backgroundColor: props.attributes.backgroundColor,
                        color: props.attributes.textColor
                    }}
                >
                    <div className="ub_testimonial_img">
                        <img
                            src={ props.attributes.imgURL }
                            alt={ props.attributes.imgAlt }
                            height={ 100 }
                            width={ 100 }
                        />
                    </div>
                    <div className="ub_testimonial_content">
                        <p className="ub_testimonial_text">{ props.attributes.ub_testimonial_text }</p>
                    </div>
                    <div className="ub_testimonial_sign">
                        <p className="ub_testimonial_author">{ props.attributes.ub_testimonial_author }</p>
                        <i className="ub_testimonial_author_role">{ props.attributes.ub_testimonial_author_role }</i>
                    </div>
                </div>
            </div>
        );
    },
} );