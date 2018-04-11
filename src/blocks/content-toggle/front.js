( function( $ ) {
	$( document ).ready( function() {
		const titleWrap = '.wp-block-ub-content-toggle-accordion-title-wrap';
		const indicator = '.wp-block-ub-content-toggle-accordion-state-indicator';
		const contentWrap = '.wp-block-ub-content-toggle-accordion-content-wrap';
		$( document )
			.on( 'click', indicator, function() {
				$( this ).toggleClass( 'open' );
				const contentWrapEl = $( this ).closest( titleWrap ).siblings( contentWrap );
				if ( $( this ).hasClass( 'open' ) ) {
					contentWrapEl.slideDown();
				} else {
					contentWrapEl.slideUp();
				}
			} );
	} );
}( jQuery ) );
