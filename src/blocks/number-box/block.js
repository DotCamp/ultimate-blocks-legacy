/**
 * BLOCK: sample-block
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
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
    PanelBody,
    Toolbar,
    RangeControl,
    Dashicon
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
registerBlockType( 'ub/number-box', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Number Box' ), // Block title.
	icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Number box' ),
		__( 'Feature' ),
		__( 'Number' ),
	],

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {
		// Creates a <p class='wp-block-cgb-block-sample-block'></p>.
		return (
			<div className={ props.className }>
                <div class="ub_number_box column_3">
                    <div class="ub_number_1">
                        <div class="ub_number_box_number">
                            1
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                    <div class="ub_number_2">
                        <div class="ub_number_box_number">
                            2
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                    <div class="ub_number_3">
                        <div class="ub_number_box_number">
                            3
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                </div>
                <div class="ub_number_box column_2">
                    <div class="ub_number_1">
                        <div class="ub_number_box_number">
                            1
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                    <div class="ub_number_2">
                        <div class="ub_number_box_number">
                            2
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                </div>
                <div class="ub_number_box column_1">
                    <div class="ub_number_1">
                        <div class="ub_number_box_number">
                            1
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
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
                <div class="ub_number_box column_3">
                    <div class="ub_number_1">
                        <div class="ub_number_box_number">
                            1
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                    <div class="ub_number_2">
                        <div class="ub_number_box_number">
                            2
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                    <div class="ub_number_3">
                        <div class="ub_number_box_number">
                            3
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                </div>
                <div class="ub_number_box column_2">
                    <div class="ub_number_1">
                        <div class="ub_number_box_number">
                            1
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                    <div class="ub_number_2">
                        <div class="ub_number_box_number">
                            2
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                </div>
                <div class="ub_number_box column_1">
                    <div class="ub_number_1">
                        <div class="ub_number_box_number">
                            1
                        </div>
                        Lorem ipsum dolor sit amet, consec tetur adipiscing elit. Curabitur ut rhon cus turpis.
                    </div>
                </div>
			</div>
		);
	},
} );
