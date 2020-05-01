Array.prototype.slice
	.call(document.getElementsByClassName("wp-block-ub-content-toggle"))
	.forEach((toggleContainer) => {
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
				.forEach((instance) => {
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

					instance.addEventListener("click", function (e) {
						e.stopImmediatePropagation();
						if (panelContent.classList.contains("ub-hide")) {
							panelContent.classList.remove("ub-hide");
							panelContent.classList.add("ub-hiding");
							if (
								"showonlyone" in toggleContainer.dataset &&
								toggleContainer.dataset.showonlyone
							) {
								const siblingToggles = Array.prototype.slice
									.call(toggleContainer.children)
									.map((p) => p.children[0])
									.filter((p) => p !== instance);

								siblingToggles.forEach((siblingToggle) => {
									const siblingContent = siblingToggle.nextElementSibling;
									const siblingIndicator = siblingToggle.querySelector(
										".wp-block-ub-content-toggle-accordion-state-indicator"
									);
									if (!siblingContent.contains("ub-hide")) {
										if (siblingIndicator)
											siblingIndicator.classList.remove("open");
										siblingContent.classList.add("ub-toggle-transition");
										const siblingHeight = siblingContent.offsetHeight;
										siblingContent.style.height = `${siblingHeight}px`; //calculate panelheight first
										setTimeout(() => {
											siblingContent.classList.add("ub-hiding");
											siblingContent.style.height = "";
										}, 20);
									}
								});
							}
						} else {
							if (panelHeight !== panelContent.offsetHeight) {
								panelHeight = panelContent.offsetHeight;
							}
							panelContent.style.height = `${panelHeight}px`;
						}
						panelContent.classList.add("ub-toggle-transition");
						if (indicator) indicator.classList.toggle("open");
						setTimeout(() => {
							//delay is needed for the animation to run properly
							if (panelContent.classList.contains("ub-hiding")) {
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

						flickityInstances.forEach((instance) => {
							let slider = Flickity.data(
								instance.querySelector("[data-flickity]")
							);
							slider.resize();
						});

						Array.prototype.slice
							.call(panelContent.querySelectorAll(".wp-block-embed iframe"))
							.forEach((embeddedContent) => {
								embeddedContent.style.removeProperty("width");
								embeddedContent.style.removeProperty("height");
							});
					});

					panelContent.addEventListener("transitionend", function () {
						panelContent.classList.remove("ub-toggle-transition");
						if (panelContent.classList.contains("ub-hiding")) {
							panelContent.classList.remove("ub-hiding");
							panelContent.classList.add("ub-hide");
						} else {
							panelContent.style.height = "";
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
