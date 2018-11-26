/**
 * BLOCK: divider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { InspectorControls, AlignmentToolbar, ColorPalette } = wp.editor;

const { PanelBody, Toolbar, RangeControl, Dashicon } = wp.components;
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
registerBlockType('ub/divider', {
	title: __('Divider'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Divider'), __('Separator'), __('Ultimate Blocks')],
	attributes: {
		borderSize: {
			type: 'number',
			default: 2
		},
		borderStyle: {
			type: 'string',
			default: 'solid'
		},
		borderColor: {
			type: 'string',
			default: '#ccc'
		},
		borderHeight: {
			type: 'number',
			default: 20
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
	edit: function(props) {
		const {
			borderSize,
			borderStyle,
			borderColor,
			borderHeight
		} = props.attributes;

		// Creates a <p class='wp-block-cgb-block-divider'></p>.
		return [
			props.isSelected && (
				<InspectorControls key="inspectors">
					<RangeControl
						label={__('Thickness')}
						value={borderSize}
						onChange={value =>
							props.setAttributes({ borderSize: value })
						}
						min={1}
						max={20}
						beforeIcon="minus"
						allowReset
					/>

					<RangeControl
						label={__('Height')}
						value={borderHeight}
						onChange={value =>
							props.setAttributes({ borderHeight: value })
						}
						min={10}
						max={200}
						beforeIcon="minus"
						allowReset
					/>

					<p>Color</p>
					<ColorPalette
						value={borderColor}
						onChange={colorValue =>
							props.setAttributes({ borderColor: colorValue })
						}
						allowReset
					/>
				</InspectorControls>
			),

			<div className={props.className}>
				<div
					className="ub_divider"
					style={{
						borderTop:
							borderSize +
							'px ' +
							borderStyle +
							' ' +
							borderColor,
						marginTop: borderHeight + 'px',
						marginBottom: borderHeight + 'px'
					}}
				/>
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
	save: function(props) {
		const {
			borderSize,
			borderStyle,
			borderColor,
			borderHeight
		} = props.attributes;

		return (
			<div className={props.className}>
				<div
					className="ub_divider"
					style={{
						borderTop:
							borderSize +
							'px ' +
							borderStyle +
							' ' +
							borderColor,
						marginTop: borderHeight + 'px',
						marginBottom: borderHeight + 'px'
					}}
				/>
			</div>
		);
	}
});
