/* eslint-disable */

(function($) {
	$(document).ready(function() {
		$(document)
			.on('mouseover', '.ub-button-block-main', function() {
				$(this).css({
					color: $(this).data('hovertextcolor'),
					'background-color': $(this).data('buttonIsTransparent')
						? 'transparent'
						: $(this).data('hovercolor')
				});
			})
			.on('mouseleave', '.ub-button-block-main', function() {
				$(this).css({
					color: $(this).data('defaulttextcolor'),
					'background-color': $(this).data('buttonIsTransparent')
						? 'transparent'
						: $(this).data('defaultcolor')
				});
			});
	});
})(jQuery);
