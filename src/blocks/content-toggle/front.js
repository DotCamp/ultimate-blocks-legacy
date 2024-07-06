const convertToPixels = (amount, unit) =>
	unit === "%" ? (amount / 100) * window.innerWidth : amount;

const togglePanel = (target) => {
	let topPadding = 0,
		topPaddingUnit = "",
		bottomPadding = 0,
		bottomPaddingUnit = "";

	const indicator = target.querySelector(
		".wp-block-ub-content-toggle-accordion-state-indicator",
	);
	const panelContent = target.nextElementSibling;
	const toggleContainer = target.parentElement.parentElement;

	if (panelContent.classList.contains("ub-hide")) {
		const { paddingTop, paddingBottom } = getComputedStyle(panelContent);
		const topPaddingMatch = /[^\d.]/g.exec(paddingTop);
		const bottomPaddingMatch = /[^\d.]/g.exec(paddingBottom);

		topPadding = parseFloat(paddingTop.slice(0, topPaddingMatch.index));
		topPaddingUnit = paddingTop.slice(topPaddingMatch.index);
		bottomPadding = parseFloat(
			paddingBottom.slice(0, bottomPaddingMatch.index),
		);
		bottomPaddingUnit = paddingBottom.slice(bottomPaddingMatch.index);

		panelContent.classList.remove("ub-hide");
		panelContent.classList.add("ub-hiding");

		if (
			"showonlyone" in toggleContainer.dataset &&
			toggleContainer.dataset.showonlyone
		) {
			Array.from(toggleContainer.children)
				.map((p) => p.children[0])
				.filter((p) => p !== target)
				.forEach((siblingToggle) => {
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
				});
		}
	} else {
		panelContent.style.height = getComputedStyle(panelContent).height;
	}

	panelContent.classList.add("ub-toggle-transition");
	if (indicator) indicator.classList.toggle("open");

	setTimeout(() => {
		if (panelContent.classList.contains("ub-hiding")) {
			const convertedTop = convertToPixels(topPadding, topPaddingUnit);
			const convertedBottom = convertToPixels(bottomPadding, bottomPaddingUnit);

			panelContent.style.height = `${panelContent.scrollHeight + convertedTop + convertedBottom}px`;
			panelContent.style.paddingTop = `${convertedTop}px`;
			panelContent.style.paddingBottom = `${convertedBottom}px`;

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
	if (e.key === "ArrowUp" && i > 0) {
		e.preventDefault();
		toggleHeads[i - 1].focus();
	} else if (e.key === "ArrowDown" && i < toggleHeads.length - 1) {
		e.preventDefault();
		toggleHeads[i + 1].focus();
	} else if ([" ", "Enter"].includes(e.key)) {
		e.preventDefault();
		togglePanel(e.currentTarget);
	} else if (e.key === "Home" && i > 0) {
		e.preventDefault();
		toggleHeads[0].focus();
	} else if (e.key === "End" && i < toggleHeads.length - 1) {
		e.preventDefault();
		toggleHeads[toggleHeads.length - 1].focus();
	}
};

const attachTogglePanelEvents = () => {
	document
		.querySelectorAll(".wp-block-ub-content-toggle")
		.forEach((toggleContainer) => {
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
			});

			if (!toggleContainer.hasAttribute("data-preventcollapse")) {
				let parentIsHidden = false,
					parentClassIsHidden = false;
				let targetElement = toggleContainer;

				while (
					!(parentIsHidden || parentClassIsHidden) &&
					targetElement.parentElement.tagName !== "BODY"
				) {
					targetElement = targetElement.parentElement;
					if (targetElement.style.display === "none") parentIsHidden = true;
					if (getComputedStyle(targetElement).display === "none")
						parentClassIsHidden = true;
				}

				if (parentClassIsHidden || parentIsHidden) {
					toggleContainer.parentElement.style.setProperty(
						"display",
						"block",
						"important",
					);
				}

				Array.from(toggleContainer.children)
					.map((p) => p.children[0])
					.filter(
						(toggle) =>
							toggle &&
							toggle.classList.contains(
								"wp-block-ub-content-toggle-accordion-title-wrap",
							),
					)
					.forEach((instance) => {
						const panelContent = instance.nextElementSibling;
						const panelId = instance.parentElement.getAttribute("id");
						const hash = location.hash.substring(1);
						if (panelId && panelId === hash) togglePanel(instance);

						instance.removeEventListener("click", togglePanel);
						instance.addEventListener("click", (e) => {
							e.stopImmediatePropagation();
							togglePanel(instance);
						});
					});

				if (parentIsHidden) {
					toggleContainer.parentElement.style.display = "none";
				}

				if (parentClassIsHidden) {
					toggleContainer.parentElement.style.display = "";
				}
			}
		});
};

document.addEventListener("DOMContentLoaded", () => {
	attachTogglePanelEvents();

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "childList") {
				attachTogglePanelEvents();
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	document
		.querySelectorAll(".wp-block-ub-content-toggle")
		.forEach((toggleContainer) => {
			if (
				window.innerWidth < 700 &&
				JSON.parse(toggleContainer.dataset.mobilecollapse)
			) {
				Array.from(toggleContainer.children).forEach((child) => {
					const panel = child.children[0].nextElementSibling;
					if (!panel.classList.contains("ub-hide")) {
						togglePanel(child.children[0]);
					}
				});
			}
		});
});
