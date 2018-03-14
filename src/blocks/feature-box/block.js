/**
 * BLOCK: feature-box
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
    registerBlockType,
    InspectorControls,
    AlignmentToolbar,
    ColorPalette,
    BlockControls,
    RichText
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
    PanelBody,
    Toolbar,
    RangeControl,
    Dashicon,
    SelectControl
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
registerBlockType( 'ub/feature-box', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Feature Box' ), // Block title.
	icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Feature Box' ),
		__( 'Column' ),
		__( 'Feature Image' ),
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
	    const {
	        column,
            columnOneTitle,
            columnTwoTitle,
            columnThreeTitle,
            columnOneBody,
            columnTwoBody,
            columnThreeBody,
        } = props.attributes;

        const columns = [
            { value: '1', label: __( 'One Column' ) },
            { value: '2', label: __( 'Two Column' ) },
            { value: '3', label: __( 'Three Column' ) },
        ];
		// Creates a <p class='wp-block-cgb-block-sample-block'></p>.
		return [


            !! props.focus && (

                <BlockControls key="controls"/>,

                <InspectorControls key={ 'inspector' }>

                    <SelectControl
                        label={ __( 'Column Number' ) }
                        value={ column }
                        options={ columns.map( ({ value, label }) => ( {
                            value: value,
                            label: label,
                        } ) ) }
                        onChange={ ( value ) => { props.setAttributes( { column: value } ) } }
                    />

                </InspectorControls>
            ),

			<div className={ props.className }>
                <div className={`ub_feature_box column_${column}`}>
                    <div class="ub_feature_1">
                        <img src="http://materialdesignblog.com/wp-content/uploads/2015/11/1200x628.png" alt=""/>
                        <RichText
                            tagName="p"
                            className="ub_feature_one_title"
                            value={ columnOneTitle }
                            onChange={ ( value ) => props.setAttributes( { columnOneTitle: value } ) }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="p"
                            className="ub_feature_one_body"
                            value={ columnOneBody }
                            onChange={ ( value ) => props.setAttributes( { columnOneBody: value } ) }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div class="ub_feature_2">
                        <img src="http://materialdesignblog.com/wp-content/uploads/2015/11/1200x628.png" alt=""/>
                        <RichText
                            tagName="p"
                            className="ub_feature_two_title"
                            value={ columnTwoTitle }
                            onChange={ ( value ) => props.setAttributes( { columnTwoTitle: value } ) }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="p"
                            className="ub_feature_two_body"
                            value={ columnTwoBody }
                            onChange={ ( value ) => props.setAttributes( { columnTwoBody: value } ) }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
                    <div class="ub_feature_3">
                        <img src="http://materialdesignblog.com/wp-content/uploads/2015/11/1200x628.png" alt=""/>
                        <RichText
                            tagName="p"
                            className="ub_feature_three_title"
                            value={ columnThreeTitle }
                            onChange={ ( value ) => props.setAttributes( { columnThreeTitle: value } ) }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                        <RichText
                            tagName="p"
                            className="ub_feature_three_body"
                            value={ columnThreeBody }
                            onChange={ ( value ) => props.setAttributes( { columnThreeBody: value } ) }
                            focus={ props.focus }
                            keepPlaceholderOnFocus={true}
                        />
                    </div>
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
        const {
            column,
            columnOneTitle,
            columnTwoTitle,
            columnThreeTitle,
            columnOneBody,
            columnTwoBody,
            columnThreeBody,
        } = props.attributes;

		return (
			<div className={ props.className }>
                <div className={`ub_feature_box column_${column}`}>
                    <div class="ub_feature_1">
                        <img src="http://materialdesignblog.com/wp-content/uploads/2015/11/1200x628.png" alt=""/>
                        <p className="ub_feature_one_title">{ columnOneTitle }</p>
                        <p className="ub_feature_one_body">{ columnOneBody }</p>
                    </div>
                    <div class="ub_feature_2">
                        <img src="http://materialdesignblog.com/wp-content/uploads/2015/11/1200x628.png" alt=""/>
                        <p className="ub_feature_two_title">{ columnTwoTitle }</p>
                        <p className="ub_feature_two_body">{ columnTwoBody }</p>
                    </div>
                    <div class="ub_feature_3">
                        <img src="http://materialdesignblog.com/wp-content/uploads/2015/11/1200x628.png" alt=""/>
                        <p className="ub_feature_three_title">{ columnThreeTitle }</p>
                        <p className="ub_feature_three_body">{ columnThreeBody }</p>
                    </div>
                </div>
			</div>
		);
	},
} );
