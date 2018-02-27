//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
    registerBlockType,
    RichText,
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.blocks;

const {
    Toolbar,
    Button,
    Tooltip
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
    icon: 'admin-comments', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
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

        const onChangeTestimonialText = value => {
            props.setAttributes( { ub_testimonial_text: value } );
        };

        const onChangeTestimonialAuthor = value => {
            props.setAttributes( { ub_testimonial_author: value } );
        };

        const onChangeTestimonialAuthorRole = value => {
            props.setAttributes( { ub_testimonial_author_role: value } );
        };

        // Creates a <p class='wp-block-cgb-block-click-to-tweet-block'></p>.
        return (
            <div className={ props.className }>
                <div className="ub_testimonial">
                    <div className="ub_testimonial_img">
                        <img height="100" width="100" src="https://whatswp.com/wp-content/uploads/2013/11/hostgator.jpg"/>
                    </div>
                    <div className="ub_testimonial_content">
                        <RichText
                            tagName="p"
                            className="ub_testimonial_text"
                            onChange={ onChangeTestimonialText }
                            value={ props.attributes.ub_testimonial_text }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div className="ub_testimonial_sign">
                        <RichText
                            tagName="p"
                            className="ub_testimonial_author"
                            onChange={ onChangeTestimonialAuthor }
                            value={ props.attributes.ub_testimonial_author }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="i"
                            className="ub_testimonial_author_role"
                            onChange={ onChangeTestimonialAuthorRole }
                            value={ props.attributes.ub_testimonial_author_role }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                </div>
            </div>
        );
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
                <div className="ub_testimonial">
                    <div className="ub_testimonial_img">
                        <img height="100" width="100" src="https://whatswp.com/wp-content/uploads/2013/11/hostgator.jpg"/>
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