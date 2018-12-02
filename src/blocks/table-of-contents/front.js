(function($) {
	$(document).ready(function() {
		const toggleButton = '.ub_table-of-contents-toggle-link';
		const toggleContent = '.ub_table-of-contents-container';
		$(toggleButton).click(function() {
			$(toggleContent).toggle();
			$(toggleButton).html(
				$(toggleContent).css('display') === 'none' ? 'show' : 'hide'
			);
		});
	});
})(jQuery);
