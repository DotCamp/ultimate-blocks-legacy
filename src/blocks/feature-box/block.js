/**
 * BLOCK: feature-box
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';
import remove_icon from './icons/remove_icon';

//  Import CSS.
import './style.scss';
import './editor.scss';
import icons from "../testimonial/icons";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
    InspectorControls,
    AlignmentToolbar,
    ColorPalette,
    BlockControls,
    RichText,
    MediaUpload
} = wp.editor;

const {
    PanelBody,
    Toolbar,
    RangeControl,
    Dashicon,
    SelectControl,
    Button,
    withAPIData
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
registerBlockType('ub/feature-box', {

    title: __('Feature Box'),
    icon: icon,
    category: 'ultimateblocks',
    keywords: [
        __('Feature Box'),
        __('Column'),
        __('Ultimate Blocks'),
    ],
    attributes: {
        column: {
            type: 'select',
            default: '2'
        },
        columnOneTitle: {
            type: 'array',
            source: 'children',
            selector: '.ub_feature_one_title',
            default: 'Title One'
        },
        columnTwoTitle: {
            type: 'array',
            source: 'children',
            selector: '.ub_feature_two_title',
            default: 'Title Two'
        },
        columnThreeTitle: {
            type: 'array',
            source: 'children',
            selector: '.ub_feature_three_title',
            default: 'Title Three'
        },
        columnOneBody: {
            type: 'array',
            source: 'children',
            selector: '.ub_feature_one_body',
            default: 'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
        },
        columnTwoBody: {
            type: 'array',
            source: 'children',
            selector: '.ub_feature_two_body',
            default: 'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
        },
        columnThreeBody: {
            type: 'array',
            source: 'children',
            selector: '.ub_feature_three_body',
            default: 'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
        },
        imgOneURL: {
            type: 'string',
            source: 'attribute',
            attribute: 'src',
            selector: '.ub_feature_one_img',
        },
        imgOneID: {
            type: 'number',
        },
        imgOneAlt: {
            type: 'string',
            source: 'attribute',
            attribute: 'alt',
            selector: '.ub_feature_one_img',
        },
        imgTwoURL: {
            type: 'string',
            source: 'attribute',
            attribute: 'src',
            selector: '.ub_feature_two_img',
        },
        imgTwoID: {
            type: 'number',
        },
        imgTwoAlt: {
            type: 'string',
            source: 'attribute',
            attribute: 'alt',
            selector: '.ub_feature_two_img',
        },
        imgThreeURL: {
            type: 'string',
            source: 'attribute',
            attribute: 'src',
            selector: '.ub_feature_three_img',
        },
        imgThreeID: {
            type: 'number',
        },
        imgThreeAlt: {
            type: 'string',
            source: 'attribute',
            attribute: 'alt',
            selector: '.ub_feature_three_img',
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
    edit: withState({ editable: 'content' })(function (props) {
        const {
            isSelected,
            editable,
            setState
        } = props;

        const {
            column,
            columnOneTitle,
            columnTwoTitle,
            columnThreeTitle,
            columnOneBody,
            columnTwoBody,
            columnThreeBody,
            imgOneURL,
            imgOneID,
            imgOneAlt,
            imgTwoURL,
            imgTwoID,
            imgTwoAlt,
            imgThreeURL,
            imgThreeID,
            imgThreeAlt,
        } = props.attributes;

        const columns = [
            { value: '1', label: __('One Column') },
            { value: '2', label: __('Two Column') },
            { value: '3', label: __('Three Column') },
        ];

        const onSetActiveEditable = (newEditable) => () => {
            setState({ editable: newEditable })
        };

        const onSelectImageOne = img => {
            props.setAttributes({
                imgOneID: img.id,
                imgOneURL: img.url,
                imgOneAlt: img.alt,
            });
        };

        const onSelectImageTwo = img => {
            props.setAttributes({
                imgTwoID: img.id,
                imgTwoURL: img.url,
                imgTwoAlt: img.alt,
            });
        };

        const onSelectImageThree = img => {
            props.setAttributes({
                imgThreeID: img.id,
                imgThreeURL: img.url,
                imgThreeAlt: img.alt,
            });
        };

        const onRemoveImageOne = () => {
            props.setAttributes({
                imgOneID: null,
                imgOneURL: null,
                imgOneAlt: null,
            });
        };

        const onRemoveImageTwo = () => {
            props.setAttributes({
                imgTwoID: null,
                imgTwoURL: null,
                imgTwoAlt: null,
            });
        };

        const onRemoveImageThree = () => {
            props.setAttributes({
                imgThreeID: null,
                imgThreeURL: null,
                imgThreeAlt: null,
            });
        };

        return [

            isSelected && (
                <BlockControls key="controls" />
            ),

            isSelected && (
                <InspectorControls key={'inspector'}>
                    <SelectControl
                        label={__('Column Number')}
                        value={column}
                        options={columns.map(({ value, label }) => ({
                            value: value,
                            label: label,
                        }))}
                        onChange={(value) => {
                            props.setAttributes({ column: value })
                        }}
                    />
                </InspectorControls>
            ),

            <div key={'editable'} className={props.className}>
                <div className={`ub_feature_box column_${column}`}>
                    <div class="ub_feature_1">
                        {!props.attributes.imgOneID ? (

                            <div className="ub_feature_upload_button">
                                <MediaUpload
                                    onSelect={onSelectImageOne}
                                    type="image"
                                    value={imgOneID}
                                    render={({ open }) => (
                                        <Button
                                            className="components-button button button-medium"
                                            onClick={open}>
                                            Upload Image
                                            </Button>
                                    )}
                                />
                            </div>
                        ) : (
                                <React.Fragment>
                                    {props.focus ? (
                                        <Button
                                            className="remove-image"
                                            onClick={onRemoveImageOne}
                                        >
                                            {remove_icon}
                                        </Button>
                                    ) : null}
                                    <img
                                        className="ub_feature_one_img"
                                        src={imgOneURL}
                                        alt={imgOneAlt}
                                    />
                                </React.Fragment>
                            )}
                        <RichText
                            tagName="p"
                            className="ub_feature_one_title"
                            value={columnOneTitle}
                            onChange={(value) => props.setAttributes({ columnOneTitle: value })}
                            isSelected={isSelected && editable === 'title_one'}
                            onFocus={onSetActiveEditable('title_one')}
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="p"
                            className="ub_feature_one_body"
                            value={columnOneBody}
                            onChange={(value) => props.setAttributes({ columnOneBody: value })}
                            isSelected={isSelected && editable === 'body_one'}
                            onFocus={onSetActiveEditable('body_one')}
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div class="ub_feature_2">
                        {!props.attributes.imgTwoID ? (
                            <div className="ub_feature_upload_button">
                                <MediaUpload
                                    onSelect={onSelectImageTwo}
                                    type="image"
                                    value={imgTwoID}
                                    render={({ open }) => (
                                        <Button
                                            className="components-button button button-medium"
                                            onClick={open}>
                                            Upload Image
                                            </Button>
                                    )}
                                />
                            </div>
                        ) : (
                                <React.Fragment>
                                    {props.focus ? (
                                        <Button
                                            className="remove-image"
                                            onClick={onRemoveImageTwo}
                                        >
                                            {remove_icon}
                                        </Button>
                                    ) : null}
                                    <img
                                        className="ub_feature_two_img"
                                        src={imgTwoURL}
                                        alt={imgTwoAlt}
                                    />
                                </React.Fragment>
                            )}
                        <RichText
                            tagName="p"
                            className="ub_feature_two_title"
                            value={columnTwoTitle}
                            onChange={(value) => props.setAttributes({ columnTwoTitle: value })}
                            isSelected={isSelected && editable === 'title_two'}
                            onFocus={onSetActiveEditable('title_two')}
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="p"
                            className="ub_feature_two_body"
                            value={columnTwoBody}
                            onChange={(value) => props.setAttributes({ columnTwoBody: value })}
                            isSelected={isSelected && editable === 'body_two'}
                            onFocus={onSetActiveEditable('body_two')}
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div class="ub_feature_3">
                        {!props.attributes.imgThreeID ? (
                            <div className="ub_feature_upload_button">
                                <MediaUpload
                                    onSelect={onSelectImageThree}
                                    type="image"
                                    value={imgThreeID}
                                    render={({ open }) => (
                                        <Button
                                            className="components-button button button-medium"
                                            onClick={open}>
                                            Upload Image
                                            </Button>
                                    )}
                                />
                            </div>
                        ) : (
                                <React.Fragment>
                                    {props.focus ? (
                                        <Button
                                            className="remove-image"
                                            onClick={onRemoveImageThree}
                                        >
                                            {remove_icon}
                                        </Button>
                                    ) : null}
                                    <img
                                        className="ub_feature_three_img"
                                        src={imgThreeURL}
                                        alt={imgThreeAlt}
                                    />
                                </React.Fragment>
                            )}
                        <RichText
                            tagName="p"
                            className="ub_feature_three_title"
                            value={columnThreeTitle}
                            onChange={(value) => props.setAttributes({ columnThreeTitle: value })}
                            isSelected={isSelected && editable === 'title_three'}
                            onFocus={onSetActiveEditable('title_three')}
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="p"
                            className="ub_feature_three_body"
                            value={columnThreeBody}
                            onChange={(value) => props.setAttributes({ columnThreeBody: value })}
                            isSelected={isSelected && editable === 'body_three'}
                            onFocus={onSetActiveEditable('body_three')}
                            keepPlaceholderOnFocus={true}
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
    save: function (props) {
        const {
            column,
            columnOneTitle,
            columnTwoTitle,
            columnThreeTitle,
            columnOneBody,
            columnTwoBody,
            columnThreeBody,
            imgOneURL,
            imgOneID,
            imgOneAlt,
            imgTwoURL,
            imgTwoID,
            imgTwoAlt,
            imgThreeURL,
            imgThreeID,
            imgThreeAlt,
        } = props.attributes;

        return (
            <div className={props.className}>
                <div className={`ub_feature_box column_${column}`}>
                    <div class="ub_feature_1">
                        <img
                            className="ub_feature_one_img"
                            src={imgOneURL}
                            alt={imgOneAlt}
                        />
                        <p className="ub_feature_one_title">{columnOneTitle}</p>
                        <p className="ub_feature_one_body">{columnOneBody}</p>
                    </div>
                    <div class="ub_feature_2">
                        <img
                            className="ub_feature_two_img"
                            src={imgTwoURL}
                            alt={imgTwoAlt}
                        />
                        <p className="ub_feature_two_title">{columnTwoTitle}</p>
                        <p className="ub_feature_two_body">{columnTwoBody}</p>
                    </div>
                    <div class="ub_feature_3">
                        <img
                            className="ub_feature_three_img"
                            src={imgThreeURL}
                            alt={imgThreeAlt}
                        />
                        <p className="ub_feature_three_title">{columnThreeTitle}</p>
                        <p className="ub_feature_three_body">{columnThreeBody}</p>
                    </div>
                </div>
            </div>
        );
    },
});
