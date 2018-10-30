/**
 * BLOCK: ultimate-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icons
import icon from './icons/icon';
import info from './icons/info';
import success from './icons/success';
import warning from './icons/warning';

//Importing Classname
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
    RichText,
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.editor;

const {
    Toolbar,
    Button,
    Tooltip,
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
registerBlockType('ub/notification-box', {

    title: __('Notification Box'),
    icon: icon,
    category: 'ultimateblocks',
    keywords: [
        __('notification'),
        __('warning info'),
        __('Ultimate Blocks'),
    ],
    attributes: {
        ub_notify_info: {
            type: 'array',
            source: 'children',
            selector: '.ub_notify_text'
        },
        ub_selected_notify: {
            type: 'string',
            default: 'ub_notify_info'
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

        const onSetActiveEditable = (newEditable) => () => {
            setState({ editable: newEditable })
        };

        const onChangeNotifyInfo = value => {
            props.setAttributes({ ub_notify_info: value });
        };

        const infoClassChange = value => {
            props.setAttributes({ ub_selected_notify: 'ub_notify_info' });
        };

        const successClassChange = value => {
            props.setAttributes({ ub_selected_notify: 'ub_notify_success' });
        };

        const warningClassChange = value => {
            props.setAttributes({ ub_selected_notify: 'ub_notify_warning' });
        };

        return [

            isSelected && (
                <BlockControls key="controls" />
            ),

            isSelected && (
                <BlockControls key="custom-controls">

                    <Toolbar className="components-toolbar">
                        <Button
                            className={classnames(
                                'components-icon-button',
                                'components-toolbar-control',
                            )}
                            onClick={infoClassChange}
                        >
                            {info}
                        </Button>
                        <Button
                            className={classnames(
                                'components-icon-button',
                                'components-toolbar-control',
                            )}
                            onClick={successClassChange}
                        >
                            {success}
                        </Button>
                        <Button
                            className={classnames(
                                'components-icon-button',
                                'components-toolbar-control',
                            )}
                            onClick={warningClassChange}
                        >
                            {warning}
                        </Button>
                    </Toolbar>

                </BlockControls>
            ),

            <div key={'editable'} className={props.className}>

                <RichText
                    tagName="div"
                    placeholder={__('Add Your Content Here')}
                    className={props.attributes.ub_selected_notify}
                    onChange={onChangeNotifyInfo}
                    value={props.attributes.ub_notify_info}
                    isSelected={isSelected && editable === 'notify_info'}
                    onFocus={onSetActiveEditable('notify_info')}
                    keepPlaceholderOnFocus={true}
                />

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
                <div className={props.attributes.ub_selected_notify}>
                    <p className="ub_notify_text">{props.attributes.ub_notify_info}</p>
                </div>
            </div>
        );
    },
});
