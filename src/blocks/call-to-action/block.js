//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';
import icon from './icons/icon';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
    registerBlockType,
    RichText,
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
    MediaUpload
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
registerBlockType( 'ub/call-to-action', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Call to Action' ), // Block title.
    icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'call to action' ),
        __( 'Conversion' ),
        __( 'optimize' ),
    ],
    attributes: {
        ub_call_to_action_headline_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_call_to_action_headline_text',
            default: 'This is the Headline of the Call to Action Box'
        },
        ub_call_to_action_content_text: {
            type: 'array',
            source: 'children',
            selector: '.ub_call_to_action_content_text',
            default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed scelerisque sapien. Nulla fermentum in leo ut consectetur. In facilisis id tellus vitae vulputate. Sed tincidunt turpis eu turpis eleifend scelerisque. Cras posuere nisl iaculis augue ultricies, non volutpat velit tincidunt. Donec sed libero sit amet augue finibus ullamcorper nec at erat. In hac habitasse platea dictumst. '
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
    edit: function( props ) {

        const onChangeHeadlineText = value => {
            props.setAttributes( { ub_call_to_action_headline_text: value } );
        };

        const onChangeContentText = value => {
            props.setAttributes( { ub_call_to_action_content_text: value } );
        };

        return (
            <div className={ props.className }>
                <div className="ub_call_to_action">
                    <div className="ub_call_to_action_headline">
                        <RichText
                            tagName="p"
                            className="ub_call_to_action_headline_text"
                            onChange={ onChangeHeadlineText }
                            value={ props.attributes.ub_call_to_action_headline_text }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div className="ub_call_to_action_content">
                        <RichText
                            tagName="p"
                            className="ub_call_to_action_content_text"
                            onChange={ onChangeContentText }
                            value={ props.attributes.ub_call_to_action_content_text }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div className="ub_call_to_action_button">
                        <a href="#">Let's Get Started!</a>
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
                <div className="ub_call_to_action">
                    <div className="ub_call_to_action_headline">
                        <p className="ub_call_to_action_headline_text">{ props.attributes.ub_call_to_action_headline_text }</p>
                    </div>
                    <div className="ub_call_to_action_content">
                        <p className="ub_call_to_action_content_text">{ props.attributes.ub_call_to_action_content_text }</p>
                    </div>
                    <div className="ub_call_to_action_button">
                        <a href="#">Let's Get Started!</a>
                    </div>
                </div>
            </div>
        );
    },
} );
