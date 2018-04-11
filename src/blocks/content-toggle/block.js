/**
 * BLOCK: Content Toggle
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';

//  Import CSS.
import './style.scss';
import './editor.scss';
import Accordion from './components/accordion';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

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
		timestamp: {
			type: 'number',
			default: 0,
		},
		activeControl: {
			type: 'string',
			default: '',
		},
	},

	edit: function( { attributes, setAttributes, className, isSelected } ) {
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
		};

		const deleteAccord = ( i ) => {
			accordionsState.splice( i, 1 );
			setAttributes( { accordionsState: JSON.stringify( accordionsState ) } );

			const accordionsClone = attributes.accordions.slice( 0 );
			accordionsClone.splice( i, 1 );
			setAttributes( { accordions: accordionsClone } );
		};

		const toggleAccordionState = ( i ) => {
			accordionsState[ i ] = ! accordionsState[ i ];
			setAttributes( { accordionsState: JSON.stringify( accordionsState ) } );
		};

		const updateTimeStamp = () => {
			setAttributes( { timestamp: ( new Date() ).getTime() } );
		};

		const onChangeTitle = ( title, i ) => {
			attributes.accordions[ i ].title = title;
			updateTimeStamp();
		};

		const onChangeContent = ( content, i ) => {
			attributes.accordions[ i ].content = content;
			updateTimeStamp();
		};

		if ( attributes.accordions.length === 0 ) {
			addAccord( 0 );
		}

		return (
			<div className={ className }>
				{
					attributes.accordions.map( ( accordion, i ) => {
						return <Accordion { ...{ isSelected, accordion, i, attributes, accordionsState, onChangeContent, onChangeTitle, showControls, deleteAccord, addAccord, toggleAccordionState } } key={ i } />;
					} )
				}
			</div>
		);
	},

	save: function( props ) {
		const accordions = props.attributes.accordions;
		const accordionsState = JSON.parse( props.attributes.accordionsState );

		return (
			<div>
				{
					accordions.map( ( accordion, i ) => {
						return <div className="wp-block-ub-content-toggle-accordion" key={ i }>
							<div className="wp-block-ub-content-toggle-accordion-title-wrap">
								<span className="wp-block-ub-content-toggle-accordion-title">{ accordion.title }</span>
								<span className={ 'wp-block-ub-content-toggle-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ' + ( accordionsState[ i ] ? 'open' : '' ) }></span>
							</div>
							<div style={ { display: ( accordionsState[ i ] ? 'block' : 'none' ) } } className="wp-block-ub-content-toggle-accordion-content-wrap">
								<div className="wp-block-ub-content-toggle-accordion-content">{ accordion.content }</div>
							</div>
						</div>;
					} )
				}
			</div>
		);
	},
} );
