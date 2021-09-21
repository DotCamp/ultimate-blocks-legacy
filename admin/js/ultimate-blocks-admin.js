/* eslint-disable */

(function($) {
	"use strict";

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
			label: "Advanced Heading",
			name: "ub/advanced-heading",
			active: true
		},
		{
			label: "Advanced Video",
			name: "ub/advanced-video",
			active: true
		},
		{
			label: "Button (Improved)",
			name: "ub/button-block",
			active: true
		},
		{
			label: "Call To Action",
			name: "ub/call-to-action",
			active: true
		},
		{
			label: "Click To Tweet",
			name: "ub/click-to-tweet",
			active: true
		},
		{
			label: "Content Toggle",
			name: "ub/content-toggle",
			active: true
		},
		{
			label: "Countdown",
			name: "ub/countdown",
			active: true
		},
		{
			label: "Divider",
			name: "ub/divider",
			active: true
		},
		{
			label: "Expand",
			name: "ub/expand",
			active: true
		},
		{
			label: "How To",
			name: "ub/how-to",
			active: true
		},
		{
			label: "Image Slider",
			name: "ub/image-slider",
			active: true
		},
		{
			label: "Post Grid",
			name: "ub/post-grid",
			active: true
		},
		{
			label: "Progress Bar",
			name: "ub/progress-bar",
			active: true
		},
		{
			label: "Review",
			name: "ub/review",
			active: true
		},
		{
			label: "Social Share",
			name: "ub/social-share",
			active: true
		},
		{
			label: "Star Rating",
			name: "ub/star-rating",
			active: true
		},
		{
			label: "Styled Box",
			name: "ub/styled-box",
			active: true
		},
		{
			label: "Styled List",
			name: "ub/styled-list",
			active: true
		},
		{
			label: "Tabbed Content",
			name: "ub/tabbed-content",
			active: true
		},
		{
			label: "Table of Contents",
			name: "ub/table-of-contents",
			active: true
		},
		{
			label: "Testimonial",
			name: "ub/testimonial-block",
			active: true
		}
	];

	$(function() {
		var isBlocksListEmpty = $(".ub__collection__item").length === 0;

		if (isBlocksListEmpty) {
			insertBlocks();
		}

		$(document).on("change", 'input[name="block_status"]', function() {
			toggleBlockStatus(
				$(this),
				$(this).prop("checked"),
				$(this)
					.closest(".ub__collection__item")
					.data("id")
			);
		});

		$(document).on("click", ".filter-action", function() {
			$(".filter-action").removeClass("active");
			$(this).addClass("active");

			var filter_status = $(this).data("filter-status");

			if (filter_status === "all") {
				$(".ub__collection__item").removeClass("ub-hide");
			} else if (filter_status == "enabled") {
				$(".ub__collection__item").addClass("ub-hide");
				$(".ub__collection__item.active").removeClass("ub-hide");
			} else if (filter_status == "disabled") {
				$(".ub__collection__item").removeClass("ub-hide");
				$(".ub__collection__item.active").addClass("ub-hide");
			}
		});

		function insertBlocks() {
			var blocksHtml = "";

			$.each(blocks, function(index, block) {
				//item start
				blocksHtml +=
					'<div class="ub__collection__item" data-id="' + block.name + '">';

				//item header start
				blocksHtml +=
					'<div class="ub__collection__item__header" data-id="' +
					block.name +
					'">';

				// title
				blocksHtml +=
					'<h3 class="ub__collection__item__title">' + block.label + "</h3>";
				// switch
				blocksHtml += '<label class="switch">';
				blocksHtml += '<input type="checkbox" name="block_status">';
				blocksHtml += '<span class="slider"></span>';
				blocksHtml += "</label>";

				// item header end
				blocksHtml += "</div>";

				//item end
				blocksHtml += "</div>";
			});

			$(".ub__collection").html(blocksHtml);
		}

		function toggleBlockStatus(selector, enable, id) {
			var data = {
				enable: enable,
				block_name: id,
				action: "toggle_block_status",
				_ajax_nonce: $('input[name="ultimate_blocks_nonce"]').val()
			};

			$.ajax({
				url: $('input[name="ultimate_blocks_ajax_url"]').val(),
				type: "POST",
				data: data,
				"Content-Type": "application/json",
				success: function(data, status, xhr) {
					selector.closest(".ub__collection__item").toggleClass("active");
				},
				error: function(xhr, status, error) {
					console.log(error);
				}
			});
		}
	});
})(jQuery);
