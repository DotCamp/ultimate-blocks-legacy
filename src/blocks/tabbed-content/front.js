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
		if (sibling.tabIndex === 0) {
			sibling.setAttribute("tabindex", -1);
		}

		sibling.classList.remove("active");
		sibling.setAttribute("aria-selected", false);
		if (defaultStyle) {
			sibling.setAttribute("style", defaultStyle);
		}
	});

	tab.setAttribute("aria-selected", true);
	tab.classList.add("active");

	parent.dataset.activeTabs = JSON.stringify([
		parseInt(tab.id.match(/-\d+$/g)[0].slice(1)),
	]);

	tab.setAttribute("tabindex", 0);

	const { width: tabContainerWidth } =
		tab.parentElement.getBoundingClientRect();
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

				Array.prototype.slice
					.call(document.getElementsByClassName("ub_image_slider"))
					.forEach((slider) => {
						const swiper = new Swiper(
							`#${slider.id}`,
							JSON.parse(slider.dataset.swiperData)
						);
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

function ub_checkPrevTab(event) {
	event.preventDefault();
	if (event.target.previousElementSibling) {
		event.target.setAttribute("tabindex", -1);
		event.target.previousElementSibling.focus();
	} else {
		ub_focusOnLastTab(event);
	}
}

function ub_checkNextTab(event) {
	event.preventDefault();
	if (event.target.nextElementSibling) {
		event.target.setAttribute("tabindex", -1);
		event.target.nextElementSibling.focus();
	} else {
		ub_focusOnFirstTab(event);
	}
}

function ub_focusOnFirstTab(event) {
	event.preventDefault();
	event.target.setAttribute("tabindex", -1);
	event.target.parentElement.children[0].focus();
}

function ub_focusOnLastTab(event) {
	event.preventDefault();
	event.target.setAttribute("tabindex", -1);
	const tabs = event.target.parentElement.children;
	tabs[tabs.length - 1].focus();
}

function ub_commonKeyPress(event) {
	if (event.key === "Home") {
		ub_focusOnFirstTab(event);
	} else if (event.key === "End") {
		ub_focusOnLastTab(event);
	}
}

function ub_upDownPress(event) {
	if (event.key === "ArrowUp") {
		ub_checkPrevTab(event);
	} else if (event.key === "ArrowDown") {
		ub_checkNextTab(event);
	} else {
		ub_commonKeyPress(event);
	}
}

function ub_leftRightPress(event) {
	if (event.key === "ArrowLeft") {
		ub_checkPrevTab(event);
	} else if (event.key === "ArrowRight") {
		ub_checkNextTab(event);
	} else {
		ub_commonKeyPress(event);
	}
}

Array.prototype.slice
	.call(
		document.getElementsByClassName("wp-block-ub-tabbed-content-tab-title-wrap")
	)
	.forEach((instance) => {
		instance.addEventListener("focus", function () {
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
		instance.addEventListener("focus", function () {
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

function ub_getTabbedContentDisplayModes(block) {
	let dm = [];
	const classNamePrefix = "wp-block-ub-tabbed-content";

	if (block.classList.contains(`${classNamePrefix}-vertical-holder-mobile`)) {
		dm.push("verticaltab");
	} else if (
		block.classList.contains(`${classNamePrefix}-horizontal-holder-mobile`)
	) {
		dm.push("horizontaltab");
	} else {
		dm.push("accordion");
	}

	if (block.classList.contains(`${classNamePrefix}-vertical-holder-tablet`)) {
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
}

(function () {
	const displayModes = Array.prototype.slice
		.call(document.getElementsByClassName("wp-block-ub-tabbed-content"))
		.map((block) => ub_getTabbedContentDisplayModes(block));

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
						const tabBar = instance.children[0].children[0];

						switch (displayModes[i][transitionFrom - 1]) {
							case "accordion":
								const activeTabs = JSON.parse(instance.dataset.activeTabs);
								if (activeTabs) {
									Array.prototype.slice
										.call(tabBar.children)
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
											if (
												Math.floor(j / 2) === activeTabs[activeTabs.length - 1]
											) {
												child.classList.add("active");
												child.classList.remove("ub-hide");
											} else {
												child.classList.remove("active");
												if (j % 2 === 1) {
													child.classList.add("ub-hide");
												}
											}
										});
								}

								delete instance.dataset.activeTabs;

								Array.prototype.slice
									.call(instance.children[1])
									.forEach((child, j) => {
										if (j % 2 === 1) {
											child.setAttribute("role", "tabpanel");
											child.setAttribute(
												"aria-labelledby",
												child.id.replace("panel", "tab")
											);
										}
									});
								break;
							case "verticaltab":
								Array.prototype.slice.call(tabBar.children).forEach((tab) => {
									tab.removeEventListener("keydown", ub_upDownPress);
								});
								break;
							case "horizontaltab":
							default:
								Array.prototype.slice.call(tabBar.children).forEach((tab) => {
									tab.removeEventListener("keydown", ub_leftRightPress);
								});
								break;
						}

						switch (displayModes[i][transitionTo - 1]) {
							case "accordion":
								Array.prototype.slice
									.call(tabBar.children)
									.forEach((child, j) => {
										if (child.classList.contains("active")) {
											instance.dataset.activeTabs = JSON.stringify([j]);
										}
									});
								Array.prototype.slice
									.call(instance.children[1])
									.forEach((child, j) => {
										if (j % 2 === 1) {
											child.setAttribute("role", "region");
											child.removeAttribute("aria-labelledby");
										} else {
											child.setAttribute(
												"aria-expanded",
												!child.nextElementSibling.classList.contains("ub-hide")
											);
											if (!child.hasAttribute("aria-controls")) {
												child.setAttribute(
													"aria-controls",
													child.nextElementSibling.id
												);
											}
										}
									});
								tabBar.removeAttribute("aria-orientation");
								break;
							case "verticaltab":
								Array.prototype.slice.call(tabBar.children).forEach((tab) => {
									tab.addEventListener("keydown", ub_upDownPress);
								});
								tabBar.setAttribute("aria-orientation", "vertical");
								break;
							case "horizontaltab":
							default:
								const newActiveTab = Array.prototype.slice
									.call(tabBar.children)
									.findIndex((tab) => tab.classList.contains("active"));
								ub_switchFocusToTab(newActiveTab, tabBar);
								Array.prototype.slice.call(tabBar.children).forEach((tab) => {
									tab.addEventListener("keydown", ub_leftRightPress);
								});
								tabBar.setAttribute("aria-orientation", "horizontal");
								break;
						}
					}
				});
			transitionTo = 0;
			transitionFrom = 0;
		}
	}

	//Keep addListener for these three. addEventListener won't work with safari versions older than 14.

	window.matchMedia("(max-width: 699px)").addEventListener("change", (mql) => {
		if (mql.matches) {
			transitionTo = 1;
		} else {
			transitionFrom = 1;
		}
		processTransition();
	});

	window
		.matchMedia("(min-width: 700px) and (max-width: 899px)")
		.addEventListener("change", (mql) => {
			if (mql.matches) {
				transitionTo = 2;
			} else {
				transitionFrom = 2;
			}
			processTransition();
		});

	window.matchMedia("(min-width: 900px)").addEventListener("change", (mql) => {
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

			const tabIndex = Array.prototype.slice
				.call(targetElement.parentElement.children)
				.filter((e) =>
					e.classList.contains(`${classNamePrefix}-tab-content-wrap`)
				)
				.findIndex(
					(e) => e.dataset.tabAnchor === window.location.hash.slice(1)
				);

			const tabContentRoot = targetElement.parentElement.parentElement;

			let ancestorTabBlocks = [];
			let ancestorTabIndexes = [];

			const findTabContentRoot = (currentBlock) => {
				const parentTabbedContent = currentBlock.closest(
					".wp-block-ub-tabbed-content-tabs-content"
				);

				if (parentTabbedContent) {
					ancestorTabIndexes.push(
						Array.prototype.slice
							.call(parentTabbedContent.children)
							.filter((t) =>
								t.classList.contains(
									"wp-block-ub-tabbed-content-tab-content-wrap"
								)
							)
							.indexOf(
								currentBlock.closest(
									".wp-block-ub-tabbed-content-tab-content-wrap"
								)
							)
					);

					ancestorTabBlocks.push(parentTabbedContent.parentElement);

					return findTabContentRoot(parentTabbedContent.parentElement);
				} else {
					return currentBlock;
				}
			};

			findTabContentRoot(targetElement);

			ancestorTabBlocks.unshift(targetElement.parentElement.parentElement);
			ancestorTabIndexes.unshift(tabIndex);

			const displayModes = ancestorTabBlocks.map((a) =>
				ub_getTabbedContentDisplayModes(a)
			);

			let displayMode = -1;
			if (window.innerWidth < 700) {
				displayMode = 0;
			} else if (window.innerWidth < 900) {
				displayMode = 1;
			} else {
				displayMode = 2;
			}

			ancestorTabBlocks.forEach((a, i) => {
				const targetElement = a.children[1].children[ancestorTabIndexes[i]];
				const tabContents = Array.prototype.slice
					.call(targetElement.parentElement.children)
					.filter((e) =>
						e.classList.contains(`${classNamePrefix}-tab-content-wrap`)
					);

				if (displayModes[i][displayMode] === "accordion") {
					tabContents.forEach((tabContent, j) => {
						if (j === ancestorTabIndexes[i]) {
							tabContent.classList.add("active");
							tabContent.classList.remove("ub-hide");
							tabContent.previousElementSibling.classList.add("active");
						} else {
							tabContent.classList.remove("active");
							tabContent.classList.add("ub-hide");
							tabContent.previousElementSibling.classList.remove("active");
						}
					});
					targetElement.parentElement.parentElement.dataset.activeTabs =
						JSON.stringify([ancestorTabIndexes[i]]);
				} else {
					const tabBar =
						targetElement.parentElement.previousElementSibling.children[0];

					Array.prototype.slice.call(tabBar.children).forEach((tab, j) => {
						const probableAccordionToggle =
							tabContents[ancestorTabIndexes[i]].previousElementSibling;
						tab.setAttribute("aria-selected", j === ancestorTabIndexes[i]);
						if (j === ancestorTabIndexes[i]) {
							tab.classList.add("active");
							tabContents[j].classList.add("active");
							tabContents[j].classList.remove("ub-hide");

							if (
								probableAccordionToggle &&
								probableAccordionToggle.classList.contains(
									`${classNamePrefix}-accordion-toggle`
								)
							) {
								probableAccordionToggle.classList.add("active");
							}

							Array.prototype.slice
								.call(tabContents[j].querySelectorAll("iframe"))
								.forEach((embed) => {
									embed.style.removeProperty("width");
									embed.style.removeProperty("height");
								});
						} else {
							tab.classList.remove("active");
							tabContents[j].classList.remove("active");
							tabContents[j].classList.add("ub-hide");
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
						ub_switchFocusToTab(ancestorTabIndexes[i], tabBar);
					}
				}
			});

			const targetAccordion = targetElement.previousElementSibling;

			const scrollBoundingRect = (
				displayModes[0][displayMode] === "accordion"
					? targetAccordion
					: tabContentRoot
			).getBoundingClientRect();

			setTimeout(() => {
				window.scrollBy(
					0,
					(scrollBoundingRect.y || scrollBoundingRect.top) -
						Math.max.apply(Math, stickyHeaderHeights)
				);
			}, 50);
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	Array.prototype.slice
		.call(document.getElementsByClassName("wp-block-ub-tabbed-content"))
		.forEach((instance) => ub_initializeTabBlock(instance));
	Array.prototype.slice
		.call(
			document.getElementsByClassName("wp-block-ub-tabbed-content-underline")
		)
		.forEach((instance) => ub_initializeTabBlock(instance));
	Array.prototype.slice
		.call(document.getElementsByClassName("wp-block-ub-tabbed-content-pills"))
		.forEach((instance) => ub_initializeTabBlock(instance));
	ub_hashTabSwitch();
});

function ub_initializeTabBlock(instance) {
	const tabBar = instance.children[0].children[0];
	if (window.getComputedStyle(tabBar).display !== "none") {
		const { scrollWidth, clientWidth } = tabBar;
		Array.prototype.slice.call(tabBar.children).forEach((tab) => {
			if (tab.classList.contains("active")) {
				tab.setAttribute("tabindex", 0);
				if (scrollWidth > clientWidth) {
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
			}
		});
	}

	const displayModes = ub_getTabbedContentDisplayModes(instance);

	let currentDisplay = -1;
	if (window.innerWidth < 700) {
		currentDisplay = 0;
	} else if (window.innerWidth < 900) {
		currentDisplay = 1;
	} else {
		currentDisplay = 2;
	}

	if (displayModes[currentDisplay] === "accordion") {
		const tabContents = instance.children[1];
		Array.prototype.slice.call(tabContents.children).forEach((child, i) => {
			if (i % 2 === 1) {
				child.setAttribute("role", "region");
				child.removeAttribute("aria-labelledby");
			} else {
				child.setAttribute(
					"aria-expanded",
					!child.nextElementSibling.classList.contains("ub-hide")
				);
				child.setAttribute("aria-controls", child.nextElementSibling.id);
				if (child.nextElementSibling.classList.contains("active")) {
					child.classList.add("active");
				}
			}
		});
	} else {
		const tabBar = instance.children[0].children[0];
		Array.prototype.slice.call(tabBar.children).forEach((tab) => {
			tab.addEventListener(
				"keydown",
				displayModes[currentDisplay] === "verticaltab"
					? ub_upDownPress
					: ub_leftRightPress
			);
		});
		tabBar.setAttribute(
			"aria-orientation",
			displayModes[currentDisplay].slice(0, -3)
		);
	}
}

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
						Array.prototype.slice
							.call(document.getElementsByClassName("ub_image_slider"))
							.forEach((slider) => {
								const swiper = new Swiper(
									`#${slider.id}`,
									JSON.parse(slider.dataset.swiperData)
								);
							});
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
