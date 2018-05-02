/**
 * BLOCK: tabbed-content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
	registerBlockType,
	RichText,
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
} = wp.components;
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     ub/tabbed-content.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ub/tabbed-content', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Tabber' ), // Block title.
	icon: 'schedule', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Tabber' ),
		__( 'Tabs' ),
		__( 'Ultimate Blocks' ),
	],
	attributes: {
		activeControl: {
			type: 'string',
		},
		tabsContent: {
			source: 'query',
			selector: '.wp-block-ub-tabbed-content-tab-content',
			query: {
				content: {
					type: 'array',
					source: 'children',
					selector: '.wp-block-ub-tabbed-content-tab-content',
				},
			},
		},
	},

	edit: function( { className, setAttributes, attributes, isSelected } ) {
		if ( ! attributes.tabsContent ) {
			attributes.tabsContent = [];
		}

		const showControls = ( type, index ) => {
			setAttributes( { activeControl: type + '-' + index } );
		};

		const onChangeTabContent = ( content, i ) => {
			attributes.tabsContent[ i ].content = content;
		};

		const addTab = ( i ) => {
			attributes.tabsContent[ i ] = { content: '<p>Tab Content </p>' };
			setAttributes( { tabsContent: attributes.accordions } );
		};

		if ( attributes.tabsContent.length === 0 ) {
			addTab( 0 );
		}

		return <div className={ className }>
			<div className={ className + '-holder' }>
				<div className={ className + '-tabs' }>
					<div className={ className + '-tab' }>Tab 1</div>
					<div className={ className + '-tab' }>Tab 2</div>
					<div className={ className + '-tab' }>Tab 3</div>
				</div>
				<div className={ className + '-tabs-content' }>
					{
						attributes.tabsContent.map( ( tabContent, i ) => {
							return <div className={ className + '-tab-content' } key={ i }>
								<RichText
									tagName="div"
									className="wp-block-ub-content-toggle-accordion-content"
									value={ tabContent.content }
									formattingControls={ [ 'bold', 'italic', 'strikethrough', 'link' ] }
									isSelected={ attributes.activeControl === 'content-' + i && isSelected }
									onClick={ () => showControls( 'content', i ) }
									onChange={ ( content ) => onChangeTabContent( content, i ) }
								/>
							</div>;
						} )
					}
				</div>
			</div>
		</div>;
	},

	save: function() {
		return <div>
			Tabbed
		</div>;
	},
} );
