/* eslint-disable */

if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		let el = this;

		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

function ub_getSiblings(element, criteria) {
	const children = Array.prototype.slice
		.call(element.parentNode.children)
		.filter((child) => child !== element);
	return criteria ? children.filter(criteria) : children;
}

function ub_getNodeindex(elm) {
	return Array.prototype.slice.call(elm.parentNode.children).indexOf(elm);
}

function ub_handleTabEvent(tab) {
	const parent = tab.closest(".wp-block-ub-tabbed-content-holder");

	const isVertical = parent.classList.contains("vertical-holder");

	const activeStyle = parent
		.querySelector(
			`.wp-block-ub-tabbed-content-tab-title-${
				isVertical ? "vertical-" : ""
			}wrap.active`
		)
		.getAttribute("style");
	const defaultStyle = parent
		.querySelector(
			`.wp-block-ub-tabbed-content-tab-title-${
				isVertical ? "vertical-" : ""
			}wrap:not(.active)`
		)
		.getAttribute("style");

	ub_getSiblings(tab, (elem) =>
		elem.classList.contains(
			`wp-block-ub-tabbed-content-tab-title-${
				isVertical ? "vertical-" : ""
			}wrap`
		)
	).forEach((sibling) => {
		sibling.classList.remove("active");
		if (defaultStyle) {
			sibling.setAttribute("style", defaultStyle);
		}
	});

	tab.classList.add("active");

	const {
		x: tabContainerLocation,
		width: tabContainerWidth,
	} = tab.parentElement.getBoundingClientRect();
	const { x: tabLocation, width: tabWidth } = tab.getBoundingClientRect();

	if (tabContainerLocation > tabLocation) {
		tab.parentElement.scrollLeft -= tabContainerLocation - tabLocation;
	}
	if (tabLocation + tabWidth > tabContainerLocation + tabContainerWidth) {
		let scrollLeftChange = tabLocation - tabContainerLocation;
		if (tabWidth <= tabContainerWidth) {
			scrollLeftChange += tabWidth - tabContainerWidth;
		}
		tab.parentElement.scrollLeft += scrollLeftChange;
	}

	if (activeStyle) tab.setAttribute("style", activeStyle);

	const tabContentContainer = Array.prototype.slice
		.call(parent.children)
		.filter((elem) =>
			elem.classList.contains("wp-block-ub-tabbed-content-tabs-content")
		)[0];

	Array.prototype.slice
		.call(tabContentContainer.children)
		.forEach((tabContent, i) => {
			if (ub_getNodeindex(tab) === i) {
				tabContent.classList.add("active");
				tabContent.classList.remove("ub-hide");
				let flickityInstances = Array.prototype.slice.call(
					tabContent.querySelectorAll(".ub_image_slider")
				);

				flickityInstances.forEach((instance) => {
					let slider = Flickity.data(instance.querySelector("[data-flickity]"));
					slider.resize();
				});

				Array.prototype.slice
					.call(tabContent.querySelectorAll(".wp-block-embed iframe"))
					.forEach((embeddedContent) => {
						embeddedContent.style.removeProperty("width");
						embeddedContent.style.removeProperty("height");
					});
			} else {
				tabContent.classList.remove("active");
				tabContent.classList.add("ub-hide");
			}
		});
}

Array.prototype.slice
	.call(
		document.getElementsByClassName("wp-block-ub-tabbed-content-tab-title-wrap")
	)
	.forEach((instance) => {
		instance.addEventListener("click", function () {
			ub_handleTabEvent(instance);
		});

		const tabBar = instance.parentElement;
		let tabBarIsBeingDragged = false;
		let oldScrollPosition = -1;
		let oldMousePosition = -1;

		tabBar.addEventListener("mousedown", function (e) {
			tabBarIsBeingDragged = true;
			oldScrollPosition = tabBar.scrollLeft;
			oldMousePosition = e.clientX - tabBar.getBoundingClientRect().x;
		});
		document.addEventListener("mouseup", function () {
			if (tabBarIsBeingDragged) {
				tabBarIsBeingDragged = false;
				oldScrollPosition = -1;
				oldMousePosition = -1;
			}
		});
		document.addEventListener("mousemove", function (e) {
			if (tabBarIsBeingDragged) {
				e.preventDefault();
				let newMousePosition = e.clientX - tabBar.getBoundingClientRect().x;
				tabBar.scrollLeft =
					oldScrollPosition - newMousePosition + oldMousePosition;
			}
		});
	});

Array.prototype.slice
	.call(
		document.getElementsByClassName(
			"wp-block-ub-tabbed-content-tab-title-vertical-wrap"
		)
	)
	.forEach((instance) => {
		instance.addEventListener("click", function () {
			ub_handleTabEvent(instance);
		});
	});

Array.prototype.slice
	.call(document.getElementsByClassName("wp-block-ub-tabbed-content-holder"))
	.forEach((tabBar) => {
		let tabBarIsBeingDragged = false;
		let oldScrollPosition = -1;
		let oldMousePosition = -1;

		tabBar.addEventListener("mousedown", function (e) {
			tabBarIsBeingDragged = true;
			oldScrollPosition = tabBar.scrollLeft;
			oldMousePosition = e.clientX - tabBar.getBoundingClientRect().x;
		});
		document.addEventListener("mouseup", function () {
			if (tabBarIsBeingDragged) {
				tabBarIsBeingDragged = false;
				oldScrollPosition = -1;
				oldMousePosition = -1;
			}
		});
		document.addEventListener("mousemove", function (e) {
			if (tabBarIsBeingDragged) {
				e.preventDefault();
				let newMousePosition = e.clientX - tabBar.getBoundingClientRect().x;
				tabBar.scrollLeft =
					oldScrollPosition - newMousePosition + oldMousePosition;
			}
		});
	});
