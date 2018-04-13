/**
 * Ultimate Accordion
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { RichText } = wp.blocks;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Accordion extends Component {
	render() {
		const { isSelected, accordion, i, attributes, accordionsState, onChangeContent, onChangeTitle, showControls, deleteAccord, addAccord, toggleAccordionState } = this.props;

		return <div className="wp-block-ub-content-toggle-accordion" style={ { borderColor: attributes.theme } } key={ i }>
			<div className="wp-block-ub-content-toggle-accordion-title-wrap" style={ { backgroundColor: attributes.theme } }>
				<RichText
					tagName="span"
					className="wp-block-ub-content-toggle-accordion-title"
					value={ accordion.title }
					formattingControls={ [ 'italic' ] }
					isSelected={ attributes.activeControl === 'title-' + i && isSelected  }
					onClick={ () => showControls( 'title', i ) }
					onChange={ ( title ) => onChangeTitle( title, i ) }
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
					isSelected={ attributes.activeControl === 'content-' + i && isSelected }
					onClick={ () => showControls( 'content', i ) }
					onChange={ ( content ) => onChangeContent( content, i ) }
				/>
			</div> }
			<div className="wp-block-ub-content-toggle-accordion-controls-top">
				<span title={ __( 'Insert New Toggle Above' ) } onClick={ () => addAccord( i ) } className="dashicons dashicons-plus-alt"></span>
			</div>
			<div className="wp-block-ub-content-toggle-accordion-controls-bottom">
				<span title={ __( 'Insert New Toggle Below' ) } onClick={ () => addAccord( i + 1 ) } className="dashicons dashicons-plus-alt"></span>
				<span title={ __( 'Delete This Toggle' ) } onClick={ () => deleteAccord( i ) } class="dashicons dashicons-dismiss"></span>
			</div>
		</div>;
	}
}
