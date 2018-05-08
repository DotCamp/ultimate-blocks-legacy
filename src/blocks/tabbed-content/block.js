/**
 * BLOCK: tabbed-content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove,
} from 'react-sortable-hoc';
import Inspector from './components/inspector';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
	registerBlockType,
	RichText,
} = wp.blocks; // Import registerBlockType() from wp.blocks

const {
} = wp.components;

// let SortableItem = null;
// let SortableList = null;

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
		id: {
			type: 'number',
			default: -1,
		},
		activeControl: {
			type: 'string',
		},
		activeTab: {
			type: 'number',
			default: 0,
		},
		timestamp: {
			type: 'number',
			default: 0,
		},
		theme: {
			type: 'string',
			default: '#ffa07a',
		},
		tabsContent: {
			source: 'query',
			selector: '.wp-block-ub-tabbed-content-tab-content-wrap',
			query: {
				content: {
					type: 'array',
					source: 'children',
					selector: '.wp-block-ub-tabbed-content-tab-content',
				},
			},
		},
		tabsTitle: {
			source: 'query',
			selector: '.wp-block-ub-tabbed-content-tab-title-wrap',
			query: {
				content: {
					type: 'array',
					source: 'children',
					selector: '.wp-block-ub-tabbed-content-tab-title',
				},
			},
		},
	},

	edit: function( props ) {
		window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

		let block = null;

		for ( const bl of window.ubTabbedContentBlocks ) {
			if ( bl.id === props.attributes.id ) {
				block = bl;
				break;
			}
		}

		if ( ! block ) {
			block = {
				id: window.ubTabbedContentBlocks.length,
				SortableItem: null,
				SortableList: null,
			};
			window.ubTabbedContentBlocks.push( block );
			props.setAttributes( { id: block.id } );
		}

		const { className, setAttributes, attributes, isSelected } = props;

		if ( ! attributes.tabsContent ) {
			attributes.tabsContent = [];
		}

		if ( ! attributes.tabsTitle ) {
			attributes.tabsTitle = [];
		}

		const updateTimeStamp = () => {
			setAttributes( { timestamp: ( new Date() ).getTime() } );
		};

		const showControls = ( type, index ) => {
			setAttributes( { activeControl: type + '-' + index } );
			setAttributes( { activeTab: index } );
		};

		const onChangeTabContent = ( content, i ) => {
			attributes.tabsContent[ i ].content = content;

			updateTimeStamp();
		};

		const onChangeTabTitle = ( content, i ) => {
			attributes.tabsTitle[ i ].content = content;

			updateTimeStamp();
		};

		const addTab = ( i ) => {
			attributes.tabsTitle[ i ] = { content: 'Tab Title' };
			setAttributes( { tabsTitle: attributes.tabsTitle } );

			attributes.tabsContent[ i ] = { content: 'Enter the Tab Content here.' };
			setAttributes( { tabsContent: attributes.tabsContent } );

			setAttributes( { activeTab: i } );

			showControls( 'tab-title', i );

			updateTimeStamp();
		};

		const removeTab = ( i ) => {
			const tabsTitleClone = attributes.tabsTitle.slice( 0 );
			tabsTitleClone.splice( i, 1 );
			setAttributes( { tabsTitle: tabsTitleClone } );

			const tabsContentClone = attributes.tabsContent.slice( 0 );
			tabsContentClone.splice( i, 1 );
			setAttributes( { tabsContent: tabsContentClone } );

			setAttributes( { activeTab: 0 } );
			showControls( 'tab-title', 0 );

			updateTimeStamp();
		};

		const onThemeChange = ( value ) => setAttributes( { theme: value } );

		if ( attributes.tabsContent.length === 0 ) {
			addTab( 0 );
		}

		const onSortEnd = ( { oldIndex, newIndex } ) => {
			const titleItems = attributes.tabsTitle.slice( 0 );

			setAttributes( { tabsTitle: arrayMove( titleItems, oldIndex, newIndex ) } );

			const contentItems = attributes.tabsContent.slice( 0 );

			setAttributes( { tabsContent: arrayMove( contentItems, oldIndex, newIndex ) } );

			setAttributes( { activeTab: newIndex } );

			showControls( 'tab-title', newIndex );
		};

		const DragHandle = SortableHandle( () => <span className="dashicons dashicons-move drag-handle"></span> );

		if ( ! block.SortableItem ) {
			block.SortableItem = SortableElement( ( { value, i, propz, onChangeTitle, onRemoveTitle, toggleTitle } ) => {
				return (
					<div
						className={ propz.className + '-tab-title-wrap SortableItem' + ( propz.attributes.activeTab === i ? ' active' : '' ) }
						style={ { backgroundColor: propz.attributes.activeTab === i ? propz.attributes.theme : 'initial' } }>
						<RichText
							tagName="div"
							className={ propz.className + '-tab-title ' }
							value={ value.content }
							formattingControls={ [ 'bold', 'italic' ] }
							isSelected={ propz.attributes.activeControl === 'tab-title-' + i && propz.isSelected }
							onClick={ () => toggleTitle( 'tab-title', i ) }
							onChange={ ( content ) => onChangeTitle( content, i ) }
						/>
						<div class="tab-actions">
							<DragHandle />
							<span className={ 'dashicons dashicons-minus remove-tab-icon' + ( propz.attributes.tabsTitle.length === 1 ? ' ub-hide' : '' ) } onClick={ () => onRemoveTitle(i) }></span>
						</div>
					</div>
				);
			});
		}

		if ( ! block.SortableList ) {
			block.SortableList = SortableContainer( ( { items, propz, onChangeTitle, onRemoveTitle, toggleTitle, onAddTab } ) => {
				return (
					<div className={ className + '-tabs-title SortableList' }>
						{ items.map( ( value, index ) => {
							return <block.SortableItem propz={ propz } key={ `item-${ index }` } i={ index } index={ index } value={ value } onChangeTitle={ onChangeTitle } onRemoveTitle={ onRemoveTitle } toggleTitle={ toggleTitle } />;
						} ) }
						<div className={ className + '-tab-title-wrap' } key={ propz.attributes.tabsTitle.length } onClick={ () => onAddTab( propz.attributes.tabsTitle.length ) } >
							<span className="dashicons dashicons-plus-alt"></span>
						</div>
					</div>
				);
			} );
		}

		return [
			isSelected && (
				<Inspector { ...{ attributes, onThemeChange } } key="inspector" />
			),
			<div className={ className } key="tabber">
				<div className={ className + '-holder' }>
					{
						<block.SortableList axis="x" propz={ props } items={ attributes.tabsTitle } onSortEnd={ onSortEnd } useDragHandle={ true } onChangeTitle={ onChangeTabTitle } onRemoveTitle={ removeTab } toggleTitle={ showControls } onAddTab={ addTab } />
					}
					<div className={ className + '-tabs-content' }>
						{
							attributes.tabsContent.map( ( tabContent, i ) => {
								return <div className={ className + '-tab-content-wrap' + ( attributes.activeTab === i ? ' active' : ' ub-hide' ) } key={ i }>
									<RichText
										tagName="div"
										className={ className + '-tab-content' }
										value={ tabContent.content }
										formattingControls={ [ 'bold', 'italic', 'strikethrough', 'link' ] }
										isSelected={ attributes.activeControl === 'tab-content-' + i && isSelected }
										onClick={ () => showControls( 'tab-content', i ) }
										onChange={ ( content ) => onChangeTabContent( content, i ) }
									/>
								</div>;
							} )
						}
					</div>
				</div>
			</div>,
		];
	},

	save: function( props ) {
		const className = 'wp-block-ub-tabbed-content';

		const { activeTab, theme } = props.attributes;

		return <div data-id={ props.attributes.id }>
			<div className={ className + '-holder' }>
				<div className={ className + '-tabs-title' }>
					{
						props.attributes.tabsTitle.map( ( value, i ) => {
							return <div
								className={ className + '-tab-title-wrap' + ( activeTab === i ? ' active' : '' ) }
								style={ { backgroundColor: activeTab === i ? theme : 'initial', borderColor: activeTab === i ? theme : 'lightgrey' } }
								key={ i }>
								<div className={ className + '-tab-title' }>
									{ value.content }
								</div>
							</div>;
						} )
					}
				</div>
				<div className={ className + '-tabs-content' }>
					{
						props.attributes.tabsContent.map( ( value, i ) => {
							return <div className={ className + '-tab-content-wrap' + ( activeTab === i ? ' active' : ' ub-hide' ) } key={ i }>
								<div className={ className + '-tab-content' }>
									{ value.content }
								</div>
							</div>;
						} )
					}
				</div>
			</div>
		</div>;
	},
} );
