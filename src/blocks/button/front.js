/* eslint-disable */

(function($) {
	$(document).ready(function() {
		$(document)
			.on('mouseover', '.ub-button-block-main', function() {
				$(this).css({
					color: $(this).data('buttonistransparent')
						? $(this).data('hovercolor')
						: $(this).data('hovertextcolor'),
					'background-color': $(this).data('buttonistransparent')
						? 'transparent'
						: $(this).data('hovercolor'),
					border: $(this).data('buttonistransparent')
						? `3px solid ${$(this).data('hovercolor')}`
						: 'none'
				});
			})
			.on('mouseleave', '.ub-button-block-main', function() {
				$(this).css({
					color: $(this).data('buttonistransparent')
						? $(this).data('defaultcolor')
						: $(this).data('defaulttextcolor'),
					'background-color': $(this).data('buttonistransparent')
						? 'transparent'
						: $(this).data('defaultcolor'),

					border: $(this).data('buttonistransparent')
						? `3px solid ${$(this).data('defaultcolor')}`
						: 'none'
				});
			});
	});
})(jQuery);
