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
			if (defaultStyle) {
				sibling.setAttribute('style', defaultStyle);
			}
		});

		instance.classList.add('active');
		if (activeStyle) instance.setAttribute('style', activeStyle);

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

Array.from(
	document.getElementsByClassName(
		'wp-block-ub-tabbed-content-scroll-button-container'
	)
).forEach(scrollButtonContainer => {
	const tabBar = scrollButtonContainer.previousElementSibling;
	const leftScroll = scrollButtonContainer.querySelector(
		'.wp-block-ub-tabbed-content-scroll-button-left'
	);
	const rightScroll = scrollButtonContainer.querySelector(
		'.wp-block-ub-tabbed-content-scroll-button-right'
	);
	let scrollInterval;
	let scrollCountdown;

	const moveLeft = _ => (tabBar.scrollLeft -= 10);
	const moveRight = _ => (tabBar.scrollLeft += 10);

	const checkWidth = _ => {
		if (tabBar.scrollWidth > tabBar.clientWidth) {
			scrollButtonContainer.classList.remove('ub-hide');
		} else {
			scrollButtonContainer.classList.add('ub-hide');
		}
	};

	const resetTimers = _ => {
		clearTimeout(scrollCountdown);
		clearTimeout(scrollInterval);
	};

	window.addEventListener('resize', checkWidth);

	leftScroll.addEventListener('mousedown', _ => {
		moveLeft();
		scrollCountdown = setTimeout(_ => {
			scrollInterval = setInterval(moveLeft, 50);
		}, 500);
	});
	leftScroll.addEventListener('mouseup', resetTimers);

	rightScroll.addEventListener('mousedown', _ => {
		moveRight();
		scrollCountdown = setTimeout(_ => {
			scrollInterval = setInterval(moveRight, 50);
		}, 500);
	});
	rightScroll.addEventListener('mouseup', resetTimers);

	checkWidth();
});
