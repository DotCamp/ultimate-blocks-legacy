Array.prototype.slice
	.call(document.getElementsByClassName("wp-block-ub-content-toggle"))
	.forEach(toggleContainer => {
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
				.call(
					toggleContainer.getElementsByClassName(
						"wp-block-ub-content-toggle-accordion-title-wrap"
					)
				)
				.forEach(instance => {
					const indicator = instance.querySelector(
						".wp-block-ub-content-toggle-accordion-state-indicator"
					);

					const panelContent = instance.nextElementSibling;

					let panelHeight = 0;

					const initialHide =
						panelContent.style.height === "0px" ||
						panelContent.classList.contains("ub-hide") ||
						getComputedStyle(panelContent).display === "none";
					if (initialHide) {
						//temporarily show panel contents to enable taking panel height measurements
						panelContent.classList.remove("ub-hide");
						panelContent.style.height = "";
						panelContent.style.paddingTop = "";
						panelContent.style.paddingBottom = "";
						panelContent.style.display = "";
					}
					panelHeight = panelContent.offsetHeight;

					panelContent.removeAttribute("style");

					if (initialHide) {
						setTimeout(() => panelContent.classList.add("ub-hide"), 10);
					}

					instance.addEventListener("click", function(e) {
						e.stopImmediatePropagation();
						if (indicator.classList.contains("open")) {
							if (panelHeight !== panelContent.offsetHeight) {
								panelHeight = panelContent.offsetHeight;
							}
							panelContent.style.height = `${panelHeight}px`;
						} else {
							panelContent.classList.remove("ub-hide");
							panelContent.classList.add("ub-hiding");
						}
						panelContent.classList.add("ub-toggle-transition");
						indicator.classList.toggle("open");
						setTimeout(() => {
							//delay is needed for the animation to run properly
							if (indicator.classList.contains("open")) {
								panelContent.classList.remove("ub-hiding");
								panelContent.style.height = `${panelHeight}px`;
							} else {
								panelContent.classList.add("ub-hiding");
								panelContent.style.height = "";
							}
						}, 20);

						let flickityInstances = Array.prototype.slice.call(
							panelContent.querySelectorAll(".ub_image_slider")
						);

						flickityInstances.forEach(instance => {
							let slider = Flickity.data(
								instance.querySelector("[data-flickity]")
							);
							slider.resize();
						});
					});

					panelContent.addEventListener("transitionend", function() {
						panelContent.classList.remove("ub-toggle-transition");
						if (indicator.classList.contains("open")) {
							panelContent.style.height = "";
						} else {
							panelContent.classList.remove("ub-hiding");
							panelContent.classList.add("ub-hide");
						}
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
