/* eslint-disable */

function ub_getSiblings(element, criteria) {
	const children = [...element.parentNode.children].filter(
		child => child !== element
	);
	return criteria ? children.filter(criteria) : children;
}

function ub_getNodeindex(elm) {
	return [...elm.parentNode.children].indexOf(elm);
}

Array.from(
	document.getElementsByClassName('wp-block-ub-tabbed-content-tab-title-wrap')
).forEach(instance => {
	instance.addEventListener('click', function() {
		const parent = instance.closest('.wp-block-ub-tabbed-content-holder');

		const activeStyle = parent
			.querySelector('.wp-block-ub-tabbed-content-tab-title-wrap.active')
			.getAttribute('style');
		const defaultStyle = parent
			.querySelector(
				'.wp-block-ub-tabbed-content-tab-title-wrap:not(.active)'
			)
			.getAttribute('style');

		ub_getSiblings(instance, elem =>
			elem.classList.contains('wp-block-ub-tabbed-content-tab-title-wrap')
		).forEach(sibling => {
			sibling.classList.remove('active');
			sibling.setAttribute('style', defaultStyle);
		});

		instance.classList.add('active');
		instance.setAttribute('style', activeStyle);

		const activeTab = parent.querySelector(
			`.wp-block-ub-tabbed-content-tab-content-wrap:nth-of-type(${ub_getNodeindex(
				this
			) + 1})`
		);

		ub_getSiblings(activeTab, elem =>
			elem.classList.contains(
				'wp-block-ub-tabbed-content-tab-content-wrap'
			)
		).forEach(inactiveTab => {
			inactiveTab.classList.remove('active');
			inactiveTab.classList.add('ub-hide');
		});

		activeTab.classList.add('active');
		activeTab.classList.remove('ub-hide');
	});
});
