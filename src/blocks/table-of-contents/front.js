(function($) {
	$(document).ready(function() {
		const toggleButton = '#ub_table-of-contents-toggle-link';
		const toggleContent = '.ub_table-of-contents-container';
		$(toggleButton).click(function() {
			$(toggleContent).slideToggle();
			if ($(toggleButton).html() === 'hide') {
				$(toggleButton).html('show');
			} else {
				console.log($(toggleButton).html());
				$(toggleButton).html('hide');
			}
			return false; //needed to prevent scrolling
		});
	});
})(jQuery);
