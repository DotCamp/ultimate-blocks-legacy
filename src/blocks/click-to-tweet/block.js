/**
 * BLOCK: Click-to-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';
import TextareaAutosize from 'react-autosize-textarea';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	RichText,
	AlignmentToolbar,
	ColorPalette,
	InspectorControls
} = wp.editor;

const {
	PanelBody,
	Toolbar,
	TextControl,
	RangeControl,
	Dashicon
} = wp.components;

const { Component } = wp.element;

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
registerBlockType('ub/click-to-tweet', {

	title: __('Click to Tweet'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [
		__('Click to tweet'),
		__('Twitter'),
		__('Ultimate Blocks'),
	],
	attributes: {
		ubTweet: {
			source: 'meta',
			meta: 'ub_ctt_tweet'
		},
		ubVia: {
			source: 'meta',
			meta: 'ub_ctt_via'
		},
		tweetFontSize: {
			type: 'number',
			default: 20
		},
		tweetColor: {
			type: 'string',
			default: '#444444'
		},
		borderColor: {
			type: 'string',
			default: '#CCCCCC'
		}
	},

	useOnce: true,

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function (props) {

		const {
			ubTweet,
			ubVia,
			tweetFontSize,
			tweetColor,
			borderColor
		} = props.attributes;

		// Creates a <p class='wp-block-cgb-block-sample-block'></p>.
		return [
			!!props.focus && (
				<InspectorControls key="inspectors">
					<TextControl
						label={__('Twitter Username')}
						placeholder='@'
						value={ubVia}
						onChange={(value) => props.setAttributes({ ubVia: value })}
					/>
					<RangeControl
						label={__('Font Size')}
						value={tweetFontSize}
						onChange={(value) => props.setAttributes({ tweetFontSize: value })}
						min={10}
						max={200}
						beforeIcon="editor-textcolor"
						allowReset
					/>
					<p>{__('Tweet Color')}</p>
					<ColorPalette
						value={tweetColor}
						onChange={(colorValue) => props.setAttributes({ tweetColor: colorValue })}
						allowReset
					/>
					<p>{__('Border Color')}</p>
					<ColorPalette
						value={borderColor}
						onChange={(colorValue) => props.setAttributes({ borderColor: colorValue })}
						allowReset
					/>
				</InspectorControls>
			),
			<div className={props.className}>
				<div
					className="ub_click_to_tweet"
					style={{
						borderColor: borderColor
					}}
				>
					<TextareaAutosize
						style={{
							fontSize: tweetFontSize + 'px',
							color: tweetColor,
							border: 'none'
						}}
						placeholder={__('Add Tweetable Content Here')}
						className="ub_tweet"
						value={ubTweet}
						onChange={(event) => { props.setAttributes({ ubTweet: event.target.value }) }}
						focus={props.focus}
						keepPlaceholderOnFocus={true}
					/>
					<div className="ub_click_tweet">
						<span
							style={{
								display: 'inline-flex'
							}}
						>
							<i></i>Click to Tweet
                        </span>
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
	save: function (props) {
		return (
			null
		);
	},
});
