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
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ub/content-toggle', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Content Toggle' ), // Block title.
	icon: icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Content' ),
		__( 'Toggle Collapse' ),
		__( 'Accordion' ),
	],

	attributes: {
		accordions: {
			source: 'query',
			selector: '.wp-block-ub-content-toggle-accordion',
			query: {
				title: { type: 'array', source: 'children', selector: '.wp-block-ub-content-toggle-accordion-title' },
				content: { type: 'array', source: 'children', selector: '.wp-block-ub-content-toggle-accordion-content' },
			},
		},
		accordionsState: {
			type: 'string',
			default: '[]',
		},
		watcher: {
			type: 'boolean',
			default: false,
		},
		activeControl: {
			type: 'string',
			default: '',
		},
	},

	edit: function( { attributes, setAttributes, className } ) {
		if ( ! attributes.accordions ) {
			attributes.accordions = [];
		}

		const sample = { title: 'The Title', content: 'The Content' };
		const accordionsState = JSON.parse( attributes.accordionsState );
		const showControls = ( type, index ) => {
			setAttributes( { activeControl: type + '-' + index } );
		};

		const addAccord = ( i ) => {
			if ( i <= 0 ) {
				attributes.accordions.unshift( sample );
				setAttributes( { accordions: attributes.accordions } );

				accordionsState.unshift( true );
				setAttributes( { accordionsState: JSON.stringify( accordionsState ) } );
			} else if ( i >= attributes.accordions.length ) {
				attributes.accordions.push( sample );
				setAttributes( { accordions: attributes.accordions } );

				accordionsState.push( true );
				setAttributes( { accordionsState: JSON.stringify( accordionsState ) } );
			} else {
				attributes.accordions.splice( i, 0, sample );
				setAttributes( { accordions: attributes.accordions } );

				accordionsState.splice( i, 0, true );
				setAttributes( { accordionsState: JSON.stringify( accordionsState ) } );
			}
			updateWatcher();
		};

		const deleteAccord = ( i ) => {
			attributes.accordions.slice( i, 1 );
			setAttributes( { accordions: attributes.accordions } );

			updateWatcher();
		};

		const toggleAccordionState = ( i ) => {
			accordionsState[ i ] = ! accordionsState[ i ];
			setAttributes( { accordionsState: JSON.stringify( accordionsState ) } );

			updateWatcher();
		};

		const updateWatcher = () => {
			setAttributes( { watcher: ! attributes.watcher } );
		};

		if ( attributes.accordions.length === 0 ) {
			addAccord( 0 );
		}
		console.log( accordionsState );

		return (
			<div className={ className }>
				{
					attributes.accordions.map( ( accordion, i ) => {
						return <div className="wp-block-ub-content-toggle-accordion" key={ i }>
							<div className="wp-block-ub-content-toggle-accordion-title-wrap">
								<RichText
									tagName="h2"
									className="wp-block-ub-content-toggle-accordion-title"
									value={ accordion.title }
									formattingControls={ [ 'bold', 'italic' ] }
									isSelected={ attributes.activeControl === 'title-' + i }
									onClick={ () => showControls( 'title', i ) }
									onChange={ ( title ) => {
										const accordions = attributes.accordions;
										accordions[ i ].title = title;
										setAttributes( { accordions: accordions } );

										updateWatcher();
									} }
								/>
								<span onClick={ () => { toggleAccordionState( i ) } } className={ 'wp-block-ub-content-toggle-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ' + ( accordionsState[ i ] ? 'open' : '' ) }></span>
							</div>
							{ accordionsState[ i ] &&
							<div className="wp-block-ub-content-toggle-accordion-content-wrap">
								<RichText
									tagName="div"
									className="wp-block-ub-content-toggle-accordion-content"
									value={ accordion.content }
									formattingControls={ [ 'bold', 'italic', 'strikethrough', 'link' ] }
									isSelected={ attributes.activeControl === 'content-' + i }
									onClick={ () => showControls( 'content', i ) }
									onChange={ ( content ) => {
										const accordions = attributes.accordions;
										accordions[ i ].content = content;
										setAttributes( { accordions: accordions } );

										updateWatcher();
									} }
								/>
							</div> }
							<div className="wp-block-ub-content-toggle-accordion-controls-top">
								<span onClick={ () => addAccord( i ) } className="dashicons dashicons-plus-alt"></span>
								<span onClick={ () => deleteAccord( i ) } class="dashicons dashicons-dismiss"></span>
							</div>
							<div className="wp-block-ub-content-toggle-accordion-controls-bottom">
								<span onClick={ () => addAccord( i + 1 ) } className="dashicons dashicons-plus-alt"></span>
								<span onClick={ () => deleteAccord( i ) } class="dashicons dashicons-dismiss"></span>
							</div>
						</div>;
					} )
				}
			</div>
		);
	},

	save: function( props ) {
		const accordions = props.attributes.accordions;
		return (
			<div className={ props.className }>
				{
					accordions.map( ( accordion, i ) => {
						return <div className="wp-block-ub-content-toggle-accordion" key={ i }>
							<h2 className="wp-block-ub-content-toggle-accordion-title">{ accordion.title }</h2>
							<div className="wp-block-ub-content-toggle-accordion-content">{ accordion.content }</div>
						</div>;
					} )
				}
			</div>
		);
	},
} );
