function ub_getSiblings(element, criteria) {
	const children = [...element.parentNode.children].filter(
		child => child !== element
	);
	return criteria ? children.filter(criteria) : children;
}

Array.from(document.getElementsByClassName('ub-content-filter-tag')).forEach(
	instance => {
		instance.addEventListener('click', function() {
			const blockProper = this.closest('.wp-block-ub-content-filter');
			this.setAttribute(
				'data-tagisselected',
				JSON.stringify(
					!JSON.parse(this.getAttribute('data-tagisselected'))
				)
			);
			this.classList.toggle('ub-selected');
			const categoryIndex = JSON.parse(
				this.getAttribute('data-categorynumber')
			);
			const filterIndex = JSON.parse(
				this.getAttribute('data-filternumber')
			);

			if (JSON.parse(this.getAttribute('data-tagisselected'))) {
				if (
					!JSON.parse(
						this.parentElement.getAttribute('data-canusemultiple')
					)
				) {
					ub_getSiblings(this, elem =>
						elem.classList.contains('ub-content-filter-tag')
					).forEach(sibling => {
						sibling.setAttribute('data-tagisselected', 'false');
						sibling.classList.remove('ub-selected');
					});
				}
			} else {
				this.classList.remove('ub-selected');
			}
			let newSelection = JSON.parse(
				blockProper.getAttribute('data-currentselection')
			);
			if (Array.isArray(newSelection[categoryIndex])) {
				newSelection[categoryIndex][filterIndex] = JSON.parse(
					this.getAttribute('data-tagisselected')
				);
			} else {
				newSelection[categoryIndex] = JSON.parse(
					this.getAttribute('data-tagisselected')
				)
					? filterIndex
					: -1;
			}
			blockProper.setAttribute(
				'data-currentselection',
				JSON.stringify(newSelection)
			);

			Array.from(
				blockProper.getElementsByClassName('ub-content-filter-panel')
			).forEach(instance => {
				const panelData = JSON.parse(
					instance.getAttribute('data-selectedfilters')
				);
				const mainData = JSON.parse(
					blockProper.getAttribute('data-currentselection')
				);

				let isVisible = true;

				panelData.forEach((category, i) => {
					if (Array.isArray(category)) {
						if (
							mainData[i].filter(f => f).length > 0 &&
							category.filter((f, j) => f && f === mainData[i][j])
								.length === 0
						) {
							isVisible = false;
						}
					} else {
						if (mainData[i] !== category && mainData[i] !== -1) {
							isVisible = false;
						}
					}
				});

				if (isVisible) {
					instance.classList.remove('ub-hide');
				} else {
					instance.classList.add('ub-hide');
				}
			});
		});
	}
);

/*Array.from(document.getElementsByClassName('ub-content-filter-reset')).forEach(
	instance => {
		instance.addEventListener('click', function() {
			const blockProper = this.closest('.wp-block-ub-content-filter');

			let blockSelection = JSON.parse(
				blockProper.getAttribute('data-currentselection')
			);

			blockSelection = blockSelection.map(c =>
				Array.isArray(c) ? Array(c.length).fill(false) : -1
			);

			blockProper.setAttribute(
				'data-currentselection',
				JSON.stringify(blockSelection)
			);

			Array.from(
				blockProper.getElementsByClassName('ub-content-filter-panel')
			).forEach(instance => {
				instance.style.display = 'block';
			});

			Array.from(
				blockProper.getElementsByClassName('ub-content-filter-tag')
			).forEach(instance => {
				instance.setAttribute('data-tagisselected', 'false');
				instance.style.backgroundColor = instance.getAttribute(
					'data-normalcolor'
				);
				instance.style.color = instance.getAttribute(
					'data-normaltextcolor'
				);
			});
		});
	}
);*/
