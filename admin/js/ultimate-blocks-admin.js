/* eslint-disable */

(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	var blocks = [
		{
			label: 'Button (Improved)',
			name: 'ub/button-block',
			active: true,
		},
		{
			label: 'Call To Action',
			name: 'ub/call-to-action',
			active: true,
		},
		{
			label: 'Call To Tweet',
			name: 'ub/click-to-tweet',
			active: true,
		},
		{
			label: 'Content Toggle',
			name: 'ub/content-toggle',
			active: true,
		},
		{
			label: 'Divider',
			name: 'ub/divider',
			active: true,
		},
		{
			label: 'Feature Box',
			name: 'ub/feature-box',
			active: true,
		},
		{
			label: 'Notification Box',
			name: 'ub/notification-box',
			active: true,
		},
		{
			label: 'Number Box',
			name: 'ub/number-box',
			active: true,
		},
		{
			label: 'Number Box',
			name: 'ub/number-box',
			active: true,
		},
		{
			label: 'Social Share',
			name: 'ub/social-share',
			active: true
		},
		{
			label: 'Spacer',
			name: 'ub/spacer',
			active: true
		},
		{
			label: 'Testimonial',
			name: 'ub/testimonial-block',
			active: true
		}
	];


	$(function() {
		var isBlocksListEmpty = $('.ultimate-blocks__collection__item').length === 0

		if(isBlocksListEmpty) {
			insertBlocks();
		}

		$(document).on('change', 'input[name="block_status"]', function(){

			toggleBlockStatus(
				$(this),
				$(this).prop('checked'),
				$(this).closest('.ultimate-blocks__collection__item').data('id')
			)

		});


		function insertBlocks() {
			var blocksHtml = '';

			$.each(blocks, function(index, block){
				//item start
				blocksHtml += '<div class="ultimate-blocks__collection__item" data-id="' + block.name + '">';

				//item header start
				blocksHtml += '<div class="ultimate-blocks__collection__item__header" data-id="' + block.name + '">';

				// title
				blocksHtml += '<h3 class="ultimate-blocks__collection__item__title">' + block.label + '</h3>';
				// switch
				blocksHtml += '<label class="switch">';
				blocksHtml += '<input type="checkbox" name="block_status">';
				blocksHtml += '<span class="slider"></span>';
				blocksHtml += '</label>';

				// item header end
				blocksHtml += '</div>';

				//item end
				blocksHtml += '</div>';
			});

			$('.ultimate-blocks__collection').html(blocksHtml);
		}

		function toggleBlockStatus(selector, enable, id) {
			console.log(enable, id);
			var data = {
				enable: enable,
				block_name: id,
				action: 'toggle_block_status',
				_ajax_nonce: $('input[name="ultimate_blocks_nonce"]').val()
			};
			console.log(data);

			$.ajax({
				url: $('input[name="ultimate_blocks_ajax_url"]').val(),
				type: 'POST',
				data: data,
				'Content-Type': 'application/json',
				success: function(data, status, xhr) {
					console.log(data);
				},
				error: function(xhr, status, error) {
					console.log(error);
				}
			});
		}

	});

})( jQuery );
