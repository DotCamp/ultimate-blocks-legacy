(function($) {
	$(document).ready(function() {
		$('.ub-content-filter-tag').click(function() {
			const blockProper = $(this).closest('.wp-block-ub-content-filter'); //prettier-ignore
			$(this).data('tagisselected', !$(this).data('tagisselected'));

			const categoryIndex = $(this).data('categorynumber');
			const filterIndex = $(this).data('filternumber');

			if ($(this).data('tagisselected')) {
				$(this)
					.css('background-color', $(this).data('activecolor'))
					.css('color', $(this).data('activetextcolor'));
				if (
					!$(this).parent().data('canusemultiple') //prettier-ignore
				) {
					$(this)
						.siblings('.ub-content-filter-tag')
						.data('tagisselected', false)
						.css('background-color', $(this).data('normalcolor'))
						.css('color', $(this).data('normaltextcolor'));
				}
			} else {
				$(this)
					.css('background-color', $(this).data('normalcolor'))
					.css('color', $(this).data('normaltextcolor'));
			}

			let newSelection = blockProper.data('currentselection');
			if (Array.isArray(newSelection[categoryIndex])) {
				newSelection[categoryIndex][filterIndex] = $(this).data(
					'tagisselected'
				);
			} else {
				newSelection[categoryIndex] = $(this).data('tagisselected')
					? filterIndex
					: -1;
			}
			blockProper.data('currentselection', newSelection);

			$(`#${blockProper.prop('id')}`)
				.find('.ub-content-filter-panel')
				.each(function() {
					const panelData = $(this).data('selectedfilters');
					const mainData = blockProper.data('currentselection');

					let isVisible = true;

					panelData.forEach((category, i) => {
						if (Array.isArray(category)) {
							if (
								mainData[i].filter(f => f).length > 0 &&
								category.filter(
									(f, j) => f && f === mainData[i][j]
								).length === 0
							) {
								isVisible = false;
							}
						} else {
							if (
								mainData[i] !== category &&
								mainData[i] !== -1
							) {
								isVisible = false;
							}
						}
					});

					$(this).css('display', isVisible ? 'block' : 'none');
				});
		});

		$('.ub-content-filter-reset').click(function() {
			const blockProper = $(this).closest('.wp-block-ub-content-filter');

			let blockSelection = blockProper.data('currentselection');

			blockSelection = blockSelection.map(c =>
				Array.isArray(c) ? Array(c.length).fill(false) : -1
			);

			blockProper.data('currentselection', blockSelection);

			$(`#${blockProper.prop('id')}`)
				.find('.ub-content-filter-panel')
				.each(function() {
					$(this).css('display', 'block');
				});

			$(`#${blockProper.prop('id')}`)
				.find('.ub-content-filter-tag')
				.each(function() {
					$(this)
						.data('tagisselected', false)
						.css('background-color', $(this).data('normalcolor'))
						.css('color', $(this).data('normaltextcolor'));
				});
		});
	});
})(jQuery);
