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

function ub_getNodeindex(elem) {
	return Array.prototype.slice.call(elem.parentNode.children).indexOf(elem);
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
		width: tabContainerWidth,
	} = tab.parentElement.getBoundingClientRect();
	const tabContainerLocation =
		tab.parentElement.getBoundingClientRect().x ||
		tab.parentElement.getBoundingClientRect().left;

	const { width: tabWidth } = tab.getBoundingClientRect();
	const tabLocation =
		tab.getBoundingClientRect().x || tab.getBoundingClientRect().left;

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
		.filter((child) =>
			child.classList.contains("wp-block-ub-tabbed-content-tab-content-wrap")
		)
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

	Array.prototype.slice
		.call(tabContentContainer.children)
		.filter((child) =>
			child.classList.contains("wp-block-ub-tabbed-content-accordion-toggle")
		)
		.forEach((accordionToggle) => {
			if (ub_getNodeindex(accordionToggle) / 2 === ub_getNodeindex(tab)) {
				accordionToggle.classList.add("active");
			} else {
				accordionToggle.classList.remove("active");
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
		let tabBarLocation =
			tabBar.getBoundingClientRect().x || tabBar.getBoundingClientRect().left;

		tabBar.addEventListener("mousedown", function (e) {
			tabBarIsBeingDragged = true;
			oldScrollPosition = tabBar.scrollLeft;
			oldMousePosition = e.clientX - tabBarLocation;
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
				let newMousePosition = e.clientX - tabBarLocation;
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

function ub_switchFocusToTab(index, tabBar) {
	const { width: tabContainerWidth } = tabBar.getBoundingClientRect();
	const tabContainerLocation =
		tabBar.getBoundingClientRect().x || tabBar.getBoundingClientRect().left;

	const { width: tabWidth } = tabBar.children[index].getBoundingClientRect();
	const tabLocation =
		tabBar.children[index].getBoundingClientRect().x ||
		tabBar.children[index].getBoundingClientRect().left;

	if (tabContainerLocation > tabLocation) {
		tabBar.scrollLeft -= tabContainerLocation - tabLocation;
	}
	if (tabLocation + tabWidth > tabContainerLocation + tabContainerWidth) {
		let scrollLeftChange = tabLocation - tabContainerLocation;
		if (tabWidth <= tabContainerWidth) {
			scrollLeftChange += tabWidth - tabContainerWidth;
		}
		tabBar.scrollLeft += scrollLeftChange;
	}
}

(function () {
	const displayModes = Array.prototype.slice
		.call(document.getElementsByClassName("wp-block-ub-tabbed-content"))
		.map((block) => {
			let dm = [];
			const classNamePrefix = "wp-block-ub-tabbed-content";

			if (
				block.classList.contains(`${classNamePrefix}-vertical-holder-mobile`)
			) {
				dm.push("verticaltab");
			} else if (
				block.classList.contains(`${classNamePrefix}-horizontal-holder-mobile`)
			) {
				dm.push("horizontaltab");
			} else {
				dm.push("accordion");
			}

			if (
				block.classList.contains(`${classNamePrefix}-vertical-holder-tablet`)
			) {
				dm.push("verticaltab");
			} else if (
				block.classList.contains(`${classNamePrefix}-horizontal-holder-tablet`)
			) {
				dm.push("horizontaltab");
			} else {
				dm.push("accordion");
			}

			dm.push(
				block.classList.contains("vertical-holder")
					? "verticaltab"
					: "horizontaltab"
			);

			return dm;
		});

	let transitionTo = 0;
	let transitionFrom = 0;

	function processTransition() {
		if (transitionTo && transitionFrom) {
			Array.prototype.slice
				.call(document.getElementsByClassName("wp-block-ub-tabbed-content"))
				.forEach((instance, i) => {
					if (
						displayModes[i][transitionFrom - 1] !==
						displayModes[i][transitionTo - 1]
					) {
						if (displayModes[i][transitionFrom - 1] === "accordion") {
							const activeTabs = JSON.parse(instance.dataset.activeTabs);
							Array.prototype.slice
								.call(instance.children[0].children[0].children)
								.forEach((child, j) => {
									if (j === activeTabs[activeTabs.length - 1]) {
										child.classList.add("active");
									} else {
										child.classList.remove("active");
									}
								});
							Array.prototype.slice
								.call(instance.children[1].children)
								.forEach((child, j) => {
									if (Math.floor(j / 2) === activeTabs[activeTabs.length - 1]) {
										child.classList.add("active");
										child.classList.remove("ub-hide");
									} else {
										child.classList.remove("active");
										if (j % 2 === 1) {
											child.classList.add("ub-hide");
										}
									}
								});
							delete instance.dataset.activeTabs;
						} else if (displayModes[i][transitionTo - 1] === "accordion") {
							Array.prototype.slice
								.call(instance.children[0].children[0].children)
								.forEach((child, j) => {
									if (child.classList.contains("active")) {
										instance.dataset.activeTabs = JSON.stringify([j]);
									}
								});
						}

						if (displayModes[i][transitionTo - 1] === "horizontaltab") {
							const tabBar = instance.children[0].children[0];
							const newActiveTab = Array.prototype.slice
								.call(instance.children[0].children[0].children)
								.findIndex((tab) => tab.classList.contains("active"));
							ub_switchFocusToTab(newActiveTab, tabBar);
						}
					}
				});
			transitionTo = 0;
			transitionFrom = 0;
		}
	}

	window.matchMedia("(max-width: 699px)").addListener((mql) => {
		if (mql.matches) {
			transitionTo = 1;
		} else {
			transitionFrom = 1;
		}
		processTransition();
	});

	window
		.matchMedia("(min-width: 700px) and (max-width: 899px)")
		.addListener((mql) => {
			if (mql.matches) {
				transitionTo = 2;
			} else {
				transitionFrom = 2;
			}
			processTransition();
		});

	window.matchMedia("(min-width: 900px)").addListener((mql) => {
		if (mql.matches) {
			transitionTo = 3;
		} else {
			transitionFrom = 3;
		}
		processTransition();
	});
})();

function ub_hashTabSwitch() {
	const targetElement = document.querySelector(
		`[data-tab-anchor='${window.location.hash.slice(1)}']`
	);

	const classNamePrefix = "wp-block-ub-tabbed-content";

	if (targetElement) {
		if (
			targetElement.classList.contains(`${classNamePrefix}-tab-content-wrap`)
		) {
			let probableHeaders;

			try {
				probableHeaders = document.elementsFromPoint(window.innerWidth / 2, 0);
			} catch (e) {
				probableHeaders = document.msElementsFromPoint(
					window.innerWidth / 2,
					0
				);
			}

			const stickyHeaders = Array.prototype.slice
				.call(probableHeaders)
				.filter((e) =>
					["fixed", "sticky"].includes(window.getComputedStyle(e).position)
				);

			const stickyHeaderHeights = stickyHeaders.map((h) => h.offsetHeight);

			const tabContents = Array.prototype.slice
				.call(targetElement.parentElement.children)
				.filter((e) =>
					e.classList.contains(`${classNamePrefix}-tab-content-wrap`)
				);

			const tabIndex = tabContents.findIndex(
				(e) => e.dataset.tabAnchor === window.location.hash.slice(1)
			);

			const tabContentRoot = targetElement.parentElement.parentElement;

			if (
				targetElement.previousElementSibling.classList.contains(
					`${classNamePrefix}-accordion-toggle`
				) &&
				targetElement.previousElementSibling.offsetWidth > 0
			) {
				tabContents.forEach((tabContent) => {
					tabContent.classList.remove("active");
					tabContent.classList.add("ub-hide");
					tabContent.previousElementSibling.classList.remove("active");
				});

				const targetAccordion = targetElement.previousElementSibling;
				const deficit =
					targetAccordion.getBoundingClientRect().y ||
					targetAccordion.getBoundingClientRect().top;

				setTimeout(() => {
					targetElement.classList.add("active");
					targetElement.classList.remove("ub-hide");
					targetAccordion.classList.add("active");
					window.scrollBy(
						0,
						deficit - Math.max.apply(Math, stickyHeaderHeights)
					);
					tabContentRoot.dataset.activeTabs = JSON.stringify([tabIndex]);
					Array.prototype.slice
						.call(targetElement.querySelectorAll("iframe"))
						.forEach((embed) => {
							embed.style.removeProperty("width");
							embed.style.removeProperty("height");
						});
				}, 50); //timeout needed for ensure accurate calculations
			} else {
				const deficit =
					tabContentRoot.getBoundingClientRect().y ||
					tabContentRoot.getBoundingClientRect().top;

				window.scrollBy(0, deficit - Math.max.apply(Math, stickyHeaderHeights));

				const tabBar =
					targetElement.parentElement.previousElementSibling.children[0];

				Array.prototype.slice.call(tabBar.children).forEach((tab, i) => {
					const probableAccordionToggle = tabContents[i].previousElementSibling;
					if (i === tabIndex) {
						tab.classList.add("active");
						tabContents[i].classList.add("active");
						tabContents[i].classList.remove("ub-hide");

						if (
							probableAccordionToggle &&
							probableAccordionToggle.classList.contains(
								`${classNamePrefix}-accordion-toggle`
							)
						) {
							probableAccordionToggle.classList.add("active");
						}

						Array.prototype.slice
							.call(tabContents[i].querySelectorAll("iframe"))
							.forEach((embed) => {
								embed.style.removeProperty("width");
								embed.style.removeProperty("height");
							});
					} else {
						tab.classList.remove("active");
						tabContents[i].classList.remove("active");
						tabContents[i].classList.add("ub-hide");
						if (
							probableAccordionToggle &&
							probableAccordionToggle.classList.contains(
								`${classNamePrefix}-accordion-toggle`
							)
						) {
							probableAccordionToggle.classList.remove("active");
						}
					}
				});

				if (
					targetElement.parentElement.previousElementSibling.offsetWidth ===
					targetElement.parentElement.offsetWidth
				) {
					ub_switchFocusToTab(tabIndex, tabBar);
				}
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	Array.prototype.slice
		.call(document.getElementsByClassName("wp-block-ub-tabbed-content"))
		.forEach((instance) => {
			const tabBar = instance.children[0].children[0];
			if (window.getComputedStyle(tabBar).display !== "none") {
				const { scrollWidth, clientWidth } = tabBar;
				if (scrollWidth > clientWidth) {
					Array.prototype.slice.call(tabBar.children).forEach((tab) => {
						if (tab.classList.contains("active")) {
							const tabLocation =
								(tab.getBoundingClientRect().x ||
									tab.getBoundingClientRect().left) +
								tab.getBoundingClientRect().width -
								(instance.getBoundingClientRect().x ||
									instance.getBoundingClientRect().left);
							if (tabLocation > clientWidth) {
								tabBar.scrollLeft = tabLocation - clientWidth;
							}
						}
					});
				}
			}
		});
	ub_hashTabSwitch();
});

window.onhashchange = ub_hashTabSwitch;

Array.prototype.slice
	.call(
		document.getElementsByClassName("wp-block-ub-tabbed-content-tabs-content")
	)
	.forEach((container) => {
		Array.prototype.slice
			.call(container.children)
			.filter((child) =>
				child.classList.contains("wp-block-ub-tabbed-content-accordion-toggle")
			)
			.forEach((accordionToggle, i) => {
				accordionToggle.addEventListener("click", () => {
					const root = container.parentElement;

					if (accordionToggle.classList.contains("active")) {
						const activeTabs = JSON.parse(root.dataset.activeTabs);

						if (activeTabs.length > 1) {
							root.dataset.activeTabs = JSON.stringify(
								activeTabs.filter((c) => c !== i)
							);
						} else {
							root.dataset.noActiveTabs = true;
						}
					} else {
						if (root.dataset.noActiveTabs) {
							delete root.dataset.noActiveTabs;
							root.dataset.activeTabs = JSON.stringify([i]);
						} else {
							root.dataset.activeTabs = JSON.stringify(
								JSON.parse(root.dataset.activeTabs).concat(i)
							);
						}
					}
					accordionToggle.classList.toggle("active");
					accordionToggle.nextElementSibling.classList.toggle("active");
					accordionToggle.nextElementSibling.classList.toggle("ub-hide");
				});
			});
	});

Array.prototype.slice
	.call(
		document.getElementsByClassName("wp-block-ub-tabbed-content-tab-holder")
	)
	.forEach((tabBar) => {
		let tabBarIsBeingDragged = false;
		let oldScrollPosition = -1;
		let oldMousePosition = -1;

		const tabBarLocation =
			tabBar.getBoundingClientRect().x || tabBar.getBoundingClientRect().left;

		tabBar.addEventListener("mousedown", function (e) {
			tabBarIsBeingDragged = true;
			oldScrollPosition = tabBar.scrollLeft;
			oldMousePosition = e.clientX - tabBarLocation;
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
				let newMousePosition = e.clientX - tabBarLocation;
				tabBar.scrollLeft =
					oldScrollPosition - newMousePosition + oldMousePosition;
			}
		});
	});
