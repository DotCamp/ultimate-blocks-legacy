Array.from(
	document.getElementsByClassName(
		'wp-block-ub-content-toggle-accordion-title-wrap'
	)
).forEach(instance => {
	const indicator = instance.querySelector(
		'.wp-block-ub-content-toggle-accordion-state-indicator'
	);

	const panelContent = instance.nextSibling;

	let heightIsChecked = false;
	let panelHeight = 0;

	if (!heightIsChecked) {
		const initialHide = panelContent.style.height === '0px';
		if (initialHide) {
			panelContent.style.height = '';
			panelContent.style.paddingTop = '';
			panelContent.style.paddingBottom = '';
		}
		panelHeight = panelContent.offsetHeight;

		if (initialHide) {
			panelContent.style.height = '0px';
			panelContent.style.paddingTop = '0';
			panelContent.style.paddingBottom = '0';
			panelContent.style.marginTop = '0';
			panelContent.style.marginBottom = '0';
		} else {
			panelContent.style.height = `${panelHeight}px`;
		}

		heightIsChecked = true;
	}

	instance.addEventListener('click', function() {
		panelContent.style.transition = 'all 0.5s ease-in-out';
		indicator.classList.toggle('open');
		panelContent.style.height = `${
			indicator.classList.contains('open') ? panelHeight : 0
		}px`;

		const newVal = indicator.classList.contains('open') ? '' : '0';
		panelContent.style.paddingTop = newVal;
		panelContent.style.paddingBottom = newVal;
		panelContent.style.marginTop = newVal;
		panelContent.style.marginBottom = newVal;
	});
});
