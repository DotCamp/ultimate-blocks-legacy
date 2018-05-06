/* eslint-disable */

( function( $ ) {
	$( document ).ready( function() {
		var titleWrap = '.wp-block-ub-tabbed-content-tab-title-wrap';
		var contentWrap = '.wp-block-ub-tabbed-content-tab-content-wrap';
		var activeStyle = $(titleWrap + '.active').attr('style');
		var defaultStyle = $(titleWrap + ':not(.active)').attr('style');

		$( document )
			.on( 'click', titleWrap, function() {

				$(this).siblings(titleWrap).removeClass('active').attr('style', defaultStyle);
				$(this).addClass('active').attr('style', activeStyle);

				$(contentWrap).removeClass('active').addClass('ub-hide');
				$(contentWrap +':nth-of-type(' + ($(this).index() + 1) + ')')
					.addClass('active')
					.removeClass('ub-hide');
			} );
	} );
}( jQuery ) );
