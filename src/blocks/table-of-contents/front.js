(function($) {
	$(document).ready(function() {
		const toggleButton = '.ub_table-of-contents-toggle-link';

		$(toggleButton).click(function() {
			const block = $(this).closest('.ub_table-of-contents');

			block.find('.ub_table-of-contents-container').slideToggle();
			if ($(this).html() === block.data('hidetext')) {
				$(this).html(block.data('showtext'));
			} else {
				$(this).html(block.data('hidetext'));
			}
			return false; //needed to prevent scrolling
		});
	});
})(jQuery);
