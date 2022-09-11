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

Array.prototype.slice
	.call(document.getElementsByClassName("ub-expand-toggle-button"))
	.forEach((instance) => {
		if (instance.getAttribute("aria-controls") === "") {
			const blockID = instance.parentElement.parentElement.id.slice(10);

			instance.setAttribute("aria-controls", `ub-expand-full-${blockID}`);
			if (instance.parentElement.classList.contains("ub-expand-full")) {
				instance.parentElement.setAttribute("id", `ub-expand-full-${blockID}`);
			}
		}

		const togglePanel = (e) => {
			const blockRoot = instance.closest(".ub-expand");
			blockRoot
				.querySelector(".ub-expand-partial .ub-expand-toggle-button")
				.classList.toggle("ub-hide");

			const expandingPart = Array.prototype.slice
				.call(blockRoot.children)
				.filter((child) => child.classList.contains("ub-expand-full"))[0];

			expandingPart.classList.toggle("ub-hide");

			if (expandingPart.classList.contains("ub-hide")) {
				const expandRoot = e.target.parentElement.parentElement;

				const rootPosition = expandRoot.getBoundingClientRect().top;

				const expandScrollData = expandRoot.dataset;

				if (rootPosition < 0) {
					if ("scrollType" in expandScrollData) {
						const { scrollType } = expandScrollData;
						const offset =
							scrollType === "fixedamount" ? expandScrollData.scrollAmount : 0;
						const target =
							scrollType === "namedelement"
								? expandScrollData.scrollTarget
								: "";
						switch (scrollType) {
							case "auto":
								let probableHeaders;

								try {
									probableHeaders = document.elementsFromPoint(
										window.innerWidth / 2,
										0
									);
								} catch (e) {
									probableHeaders = document.msElementsFromPoint(
										window.innerWidth / 2,
										0
									);
								}

								const stickyHeaders = Array.prototype.slice
									.call(probableHeaders)
									.filter((e) =>
										["fixed", "sticky"].includes(
											window.getComputedStyle(e).position
										)
									);

								const stickyHeaderHeights = stickyHeaders.map(
									(h) => h.offsetHeight
								);

								window.scrollBy(
									0,
									rootPosition -
										(stickyHeaders.length
											? Math.max.apply(Math, stickyHeaderHeights)
											: 0)
								);
								break;
							case "fixedamount":
								window.scrollBy(0, rootPosition - offset);
								break;
							case "namedelement":
								window.scrollBy(
									0,
									rootPosition -
										(document.querySelector(target)
											? document.querySelector(target).offsetHeight
											: 0)
								);
								break;
							default:
								window.scrollBy(0, rootPosition);
						}
					} else {
						window.scrollBy(0, expandRoot.getBoundingClientRect().rootPosition);
					}
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

				setTimeout(function () {
					window.dispatchEvent(new Event("resize"));
				}, 100);
			}

			Array.prototype.slice
				.call(expandingPart.querySelectorAll(".wp-block-embed iframe"))
				.forEach((embeddedContent) => {
					embeddedContent.style.removeProperty("width");
					embeddedContent.style.removeProperty("height");
				});
		};

		instance.addEventListener("click", togglePanel);

		instance.addEventListener("keydown", (e) => {
			if ([" ", "Enter"].indexOf(e.key) > -1) {
				e.preventDefault();
				togglePanel();
				Array.prototype.slice
					.call(instance.parentElement.parentElement.children)
					.filter((a) => a !== instance.parentElement)[0]
					.querySelector(
						`[aria-controls="${instance.getAttribute("aria-controls")}"]`
					)
					.focus();
			}
		});
	});
