const convertToPixels = (amount, unit) =>
	unit === "%" ? (amount / 100) * window.innerWidth : amount;

const togglePanel = (target) => {
	let topPadding = 0,
		bottomPadding = 0;

	const indicator = target.querySelector(
		".wp-block-ub-content-toggle-accordion-state-indicator",
	);
	const panelContent = target.nextElementSibling;
	const toggleContainer = target.closest(".wp-block-ub-content-toggle");

	if (panelContent.classList.contains("ub-hide")) {
		const computedStyles = getComputedStyle(panelContent);
		const topPaddingUnit = computedStyles.paddingTop.match(/[^\d.]+/)[0];
		const bottomPaddingUnit = computedStyles.paddingBottom.match(/[^\d.]+/)[0];

		topPadding = convertToPixels(
			parseFloat(computedStyles.paddingTop),
			topPaddingUnit,
		);
		bottomPadding = convertToPixels(
			parseFloat(computedStyles.paddingBottom),
			bottomPaddingUnit,
		);

		panelContent.classList.remove("ub-hide");
		panelContent.classList.add("ub-hiding");

		if (toggleContainer.dataset.showonlyone === "true") {
			[...toggleContainer.children].forEach((child) => {
				const siblingToggle = child.querySelector(
					".wp-block-ub-content-toggle-accordion-title-wrap",
				);
				if (siblingToggle !== target) {
					const siblingContent = siblingToggle.nextElementSibling;
					const siblingIndicator = siblingToggle.querySelector(
						".wp-block-ub-content-toggle-accordion-state-indicator",
					);

					if (!siblingContent.classList.contains("ub-hide")) {
						if (siblingIndicator) siblingIndicator.classList.remove("open");
						siblingContent.classList.add("ub-toggle-transition");
						siblingContent.style.height = `${siblingContent.scrollHeight}px`;

						setTimeout(() => {
							siblingContent.classList.add("ub-hiding");
							siblingContent.style.height = "";
						}, 20);
					}
				}
			});
		}
	} else {
		panelContent.style.height = getComputedStyle(panelContent).height;
	}

	panelContent.classList.add("ub-toggle-transition");
	if (indicator) indicator.classList.toggle("open");

	setTimeout(() => {
		if (panelContent.classList.contains("ub-hiding")) {
			panelContent.style.height = `${panelContent.scrollHeight + topPadding + bottomPadding}px`;
			panelContent.style.paddingTop = `${topPadding}px`;
			panelContent.style.paddingBottom = `${bottomPadding}px`;

			document.querySelectorAll(".ub_image_slider").forEach((slider) => {
				new Swiper(`#${slider.id}`, JSON.parse(slider.dataset.swiperData));
			});

			setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
		} else {
			panelContent.classList.add("ub-hiding");
			panelContent.style.height = "";
		}
	}, 20);

	panelContent.addEventListener("transitionend", () => {
		panelContent.classList.remove("ub-toggle-transition");
		panelContent.setAttribute("aria-expanded", panelContent.offsetHeight !== 0);

		if (panelContent.offsetHeight === 0) {
			panelContent.classList.add("ub-hide");
		} else {
			panelContent.removeAttribute("style");
		}

		panelContent.classList.remove("ub-hiding");
	});

	panelContent
		.querySelectorAll(".wp-block-embed iframe")
		.forEach((embeddedContent) => {
			embeddedContent.style.removeProperty("width");
			embeddedContent.style.removeProperty("height");
		});
};

const handleKeyDown = (e, i, toggleHeads) => {
	const { key } = e;
	if (key === "ArrowUp" && i > 0) {
		e.preventDefault();
		toggleHeads[i - 1].focus();
	} else if (key === "ArrowDown" && i < toggleHeads.length - 1) {
		e.preventDefault();
		toggleHeads[i + 1].focus();
	} else if ([" ", "Enter"].includes(key)) {
		e.preventDefault();
		togglePanel(e.currentTarget);
	} else if (key === "Home" && i > 0) {
		e.preventDefault();
		toggleHeads[0].focus();
	} else if (key === "End" && i < toggleHeads.length - 1) {
		e.preventDefault();
		toggleHeads[toggleHeads.length - 1].focus();
	}
};

const attachTogglePanelEvents = (toggleContainer) => {
	const toggleHeads = Array.from(toggleContainer.children)
		.map((toggle) => toggle.children[0])
		.filter(
			(toggle) =>
				toggle &&
				toggle.classList.contains(
					"wp-block-ub-content-toggle-accordion-title-wrap",
				),
		);

	toggleHeads.forEach((toggleHead, i) => {
		toggleHead.removeEventListener("keydown", handleKeyDown);
		toggleHead.addEventListener("keydown", (e) =>
			handleKeyDown(e, i, toggleHeads),
		);

		toggleHead.removeEventListener("click", togglePanel);
		toggleHead.addEventListener("click", (e) => {
			e.stopImmediatePropagation();
			togglePanel(toggleHead);
		});
	});
};

const initTogglePanels = () => {
	document
		.querySelectorAll(".wp-block-ub-content-toggle")
		.forEach((toggleContainer) => {
			if (
				window.innerWidth < 700 &&
				JSON.parse(toggleContainer.dataset.mobilecollapse)
			) {
				[...toggleContainer.children].forEach((child) => {
					const panel = child.children[0].nextElementSibling;
					if (!panel.classList.contains("ub-hide")) {
						togglePanel(child.children[0]);
					}
				});
			}
			attachTogglePanelEvents(toggleContainer);
		});
};

document.addEventListener("DOMContentLoaded", () => {
	initTogglePanels();

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "childList") {
				const addedNodes = [...mutation.addedNodes];
				addedNodes.forEach((node) => {
					if (node.classList?.contains("wp-block-ub-content-toggle")) {
						attachTogglePanelEvents(node);
					}
				});
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
});
