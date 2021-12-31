function convertToPixels(amount, unit) {
	return unit === "%" ? (amount / 100) * window.innerWidth : amount;
}

function togglePanel(target) {
	let topPadding = 0;
	let topPaddingUnit = "";
	let bottomPadding = 0;
	let bottomPaddingUnit = "";

	const indicator = target.querySelector(
		".wp-block-ub-content-toggle-accordion-state-indicator"
	);

	const panelContent = target.nextElementSibling;

	const toggleContainer = target.parentElement.parentElement;

	if (panelContent.classList.contains("ub-hide")) {
		const panelStyle = getComputedStyle(panelContent);

		let topUnitMatch = /[^\d.]/g.exec(panelStyle.paddingTop);
		let bottomUnitMatch = /[^\d.]/g.exec(panelStyle.paddingBottom);

		topPadding = Number(panelStyle.paddingTop.slice(0, topUnitMatch.index));

		topPaddingUnit = panelStyle.paddingTop.slice(topUnitMatch.index);

		bottomPadding = Number(
			panelStyle.paddingBottom.slice(0, bottomUnitMatch.index)
		);

		bottomPaddingUnit = panelStyle.paddingBottom.slice(bottomUnitMatch.index);
		panelContent.classList.remove("ub-hide");

		panelContent.classList.add("ub-hiding");
		if (
			"showonlyone" in toggleContainer.dataset &&
			toggleContainer.dataset.showonlyone
		) {
			const siblingToggles = Array.prototype.slice
				.call(toggleContainer.children)
				.map((p) => p.children[0])
				.filter((p) => p !== target);

			siblingToggles.forEach((siblingToggle) => {
				const siblingContent = siblingToggle.nextElementSibling;
				const siblingIndicator = siblingToggle.querySelector(
					".wp-block-ub-content-toggle-accordion-state-indicator"
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
		//delay is needed for the animation to run properly
		if (panelContent.classList.contains("ub-hiding")) {
			let convertedTop = convertToPixels(topPadding, topPaddingUnit);

			let convertedBottom = convertToPixels(bottomPadding, bottomPaddingUnit);

			Object.assign(panelContent.style, {
				height: `${
					panelContent.scrollHeight +
					convertedTop +
					convertedBottom -
					(topPaddingUnit === "%" || bottomPaddingUnit === "%"
						? panelContent.parentElement.scrollHeight
						: 0)
				}px`,
				paddingTop: `${convertedTop}px`,
				paddingBottom: `${convertedBottom}px`,
			});
			Array.prototype.slice
				.call(document.getElementsByClassName("ub_image_slider"))
				.forEach((slider) => {
					const swiper = new Swiper(
						`#${slider.id}`,
						JSON.parse(slider.dataset.swiperData)
					);
				});
		} else {
			panelContent.classList.add("ub-hiding");
			panelContent.style.height = "";
		}
	}, 20);

	Array.prototype.slice
		.call(panelContent.querySelectorAll(".wp-block-embed iframe"))
		.forEach((embeddedContent) => {
			embeddedContent.style.removeProperty("width");
			embeddedContent.style.removeProperty("height");
		});
}

Array.prototype.slice
	.call(document.getElementsByClassName("wp-block-ub-content-toggle"))
	.forEach((toggleContainer) => {
		const toggleHeads = Array.prototype.slice
			.call(toggleContainer.children)
			.map((toggle) => toggle.children[0])
			.filter(
				(toggle) =>
					toggle &&
					toggle.classList.contains(
						"wp-block-ub-content-toggle-accordion-title-wrap"
					)
			);

		toggleHeads.forEach((toggleHead, i) => {
			toggleHead.addEventListener("keydown", (e) => {
				if (e.key === "ArrowUp" && i > 0) {
					e.preventDefault();
					toggleHeads[i - 1].focus();
				}
				if (e.key === "ArrowDown" && i < toggleHeads.length - 1) {
					e.preventDefault();
					toggleHeads[i + 1].focus();
				}
				if ([" ", "Enter"].indexOf(e.key) > -1) {
					e.preventDefault();
					togglePanel(toggleHead);
				}

				if (e.key === "Home" && i > 0) {
					e.preventDefault();
					toggleHeads[0].focus();
				}
				if (e.key === "End" && i < toggleHeads.length - 1) {
					e.preventDefault();
					toggleHeads[toggleHeads.length - 1].focus();
				}
			});
		});

		if (!toggleContainer.hasAttribute("data-preventcollapse")) {
			let parentIsHidden = false;
			let parentClassIsHidden = false;

			let targetElement = toggleContainer;

			while (
				!(parentIsHidden || parentClassIsHidden) &&
				targetElement.parentElement.tagName !== "BODY"
			) {
				targetElement = targetElement.parentElement;
				if (targetElement.style.display === "none") {
					parentIsHidden = true;
				}

				if (getComputedStyle(targetElement).display === "none") {
					parentClassIsHidden = true;
				}
			}

			if (parentClassIsHidden || parentIsHidden) {
				toggleContainer.parentElement.style.setProperty(
					"display",
					"block", //make the parent block display to give way for height measurements
					"important" //just in case blocks from other plugins use !important
				);
			}

			Array.prototype.slice
				.call(toggleContainer.children)
				.map((p) => p.children[0])
				.filter(
					(toggle) =>
						toggle &&
						toggle.classList.contains(
							"wp-block-ub-content-toggle-accordion-title-wrap"
						)
				)
				.forEach((instance) => {
					const panelContent = instance.nextElementSibling;

					instance.addEventListener("click", function (e) {
						e.stopImmediatePropagation();
						togglePanel(instance);
					});

					panelContent.addEventListener("transitionend", function () {
						panelContent.classList.remove("ub-toggle-transition");
						panelContent.previousElementSibling.setAttribute(
							"aria-expanded",
							panelContent.offsetHeight !== 0
						);

						if (panelContent.offsetHeight === 0) {
							panelContent.classList.add("ub-hide");
						} else {
							Object.assign(panelContent.style, {
								height: "",
								paddingTop: "",
								paddingBottom: "",
							});
						}
						panelContent.classList.remove("ub-hiding");
					});

					panelContent.removeAttribute("style");
				});

			//hide the parent element again;
			if (parentIsHidden) {
				toggleContainer.parentElement.style.display = "none";
			}

			if (parentClassIsHidden) {
				toggleContainer.parentElement.style.display = "";
			}
		}
	});

document.addEventListener("DOMContentLoaded", () => {
	Array.prototype.slice
		.call(document.getElementsByClassName("wp-block-ub-content-toggle"))
		.forEach((toggleContainer) => {
			if (
				window.innerWidth < 700 &&
				JSON.parse(toggleContainer.dataset.mobilecollapse)
			) {
				Array.prototype.slice
					.call(toggleContainer.children)
					.forEach((child) => {
						const panel = child.children[0].nextElementSibling;

						if (!panel.classList.contains("ub-hide")) {
							togglePanel(child.children[0]);
						}
					});
			}
		});
});
