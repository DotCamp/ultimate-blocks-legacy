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

function ub_hashHeaderScroll(scrollType = "auto", target = "", offset = 0) {
	if (window.location.hash) {
		const targetHeading = document.getElementById(
			window.location.hash.slice(1)
		);

		let probableHeaders;

		try {
			probableHeaders = document.elementsFromPoint(window.innerWidth / 2, 0);
		} catch (e) {
			probableHeaders = document.msElementsFromPoint(window.innerWidth / 2, 0);
		}

		const stickyHeaders = Array.prototype.slice
			.call(probableHeaders)
			.filter((e) =>
				["fixed", "sticky"].includes(window.getComputedStyle(e).position)
			);

		const stickyHeaderHeights = stickyHeaders.map((h) => h.offsetHeight);

		const deficit =
			targetHeading.getBoundingClientRect().y ||
			targetHeading.getBoundingClientRect().top;

		switch (scrollType) {
			default:
				window.scrollBy(0, deficit);
				break;
			case "off":
				window.scrollBy(0, deficit);
				break;
			case "auto":
				window.scrollBy(
					0,
					deficit -
						(stickyHeaders.length
							? Math.max.apply(Math, stickyHeaderHeights)
							: 0)
				);
				break;
			case "fixedamount":
				window.scrollBy(0, deficit - offset);
				break;
			case "namedelement":
				window.scrollBy(
					0,
					deficit - document.querySelector(target)
						? document.querySelector(target).offsetHeight
						: 0
				);
				break;
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	let instances = [];
	if (document.getElementById("ub_table-of-contents-toggle-link")) {
		instances.push(document.getElementById("ub_table-of-contents-toggle-link"));
	} else {
		instances = Array.prototype.slice.call(
			document.getElementsByClassName("ub_table-of-contents-toggle-link")
		);
	}
	instances.forEach((instance) => {
		const block = instance.closest(".ub_table-of-contents");

		const tocContainer = block.querySelector(".ub_table-of-contents-container");
		const containerStyle = tocContainer.style;

		const tocExtraContainer = block.querySelector(
			".ub_table-of-contents-extra-container"
		);
		const extraContainerStyle = tocExtraContainer.style;

		const tocMain = tocExtraContainer.parentNode;
		const mainStyle = block.style;

		const showButton = block.getAttribute("data-showtext") || "show";
		const hideButton = block.getAttribute("data-hidetext") || "hide";

		tocContainer.removeAttribute("style");

		let padding = 60;

		function mobileEvent(mql) {
			if (mql.matches) {
				if (!tocMain.classList.contains("ub_table-of-contents-collapsed")) {
					tocMain.classList.add("ub_table-of-contents-collapsed");
					instance.innerHTML = showButton;
					tocContainer.classList.add("ub-hide");
				}
			} else {
				if (JSON.parse(tocMain.dataset.initiallyshow)) {
					tocMain.classList.remove("ub_table-of-contents-collapsed");
					instance.innerHTML = hideButton;
					tocContainer.classList.remove("ub-hide");
				}
			}
		}

		let mobileQuery = window.matchMedia("(max-width: 800px)");

		if (JSON.parse(block.getAttribute("data-initiallyhideonmobile"))) {
			mobileQuery.addListener(mobileEvent);
		}

		instance.addEventListener("click", function (event) {
			event.preventDefault();
			const curWidth = block.offsetWidth;

			if (block.classList.contains("ub_table-of-contents-collapsed")) {
				//begin showing
				tocExtraContainer.classList.remove("ub-hide");
				tocContainer.classList.remove("ub-hide");
				const targetHeight = tocExtraContainer.offsetHeight + padding / 2; //doesn't include padding
				tocContainer.classList.add("ub-hiding");
				tocExtraContainer.classList.add("ub-hiding");
				mainStyle.width = `${curWidth}px`; //also take into account number of columns

				setTimeout(() => {
					mainStyle.width = "auto";
					block.classList.remove("ub_table-of-contents-collapsed");
					const fullWidth = getComputedStyle(block).width.slice(0, -2);
					mainStyle.width = `${curWidth}px`;

					setTimeout(() => {
						Object.assign(containerStyle, {
							height: `${targetHeight}px`,
							width: "100px",
						});
						Object.assign(extraContainerStyle, {
							height: `${targetHeight}px`,
							width: "100px",
						});
						tocContainer.classList.remove("ub-hiding");
						tocExtraContainer.classList.remove("ub-hiding");

						mainStyle.width = `${fullWidth}px`;

						setTimeout(() => {
							tocContainer.style.width = `${fullWidth - padding}px`;
							tocExtraContainer.style.width = `${fullWidth - padding}px`;
						}, 50);
					}, 50);
				}, 50);
			} else {
				//begin hiding
				mainStyle.width = `${block.offsetWidth}px`;
				Object.assign(containerStyle, {
					height: `${tocContainer.offsetHeight}px`,
					width: `${tocContainer.offsetWidth}px`,
				});
				Object.assign(extraContainerStyle, {
					height: `${tocExtraContainer.offsetHeight}px`,
					width: `${tocExtraContainer.offsetWidth}px`,
				});

				setTimeout(() => {
					tocContainer.classList.add("ub-hiding");
					Object.assign(containerStyle, {
						height: "0",
						width: "0",
					});
					Object.assign(extraContainerStyle, {
						height: "0",
						width: "0",
					});
					block.classList.add("ub_table-of-contents-collapsed");

					padding =
						parseInt(
							getComputedStyle(tocExtraContainer).paddingLeft.slice(0, -2)
						) +
						parseInt(
							getComputedStyle(tocExtraContainer).paddingRight.slice(0, -2)
						);

					//measure width of toc title + toggle button, then use it as width of block

					mainStyle.width = `${
						5 +
						padding +
						instance.closest(".ub_table-of-contents-header-container")
							.scrollWidth
					}px`;
				}, 50);
			}

			instance.innerHTML = tocContainer.classList.contains("ub-hiding")
				? hideButton
				: showButton;

			mobileQuery.removeListener(mobileEvent);
		});

		tocContainer.addEventListener("transitionend", function () {
			if (tocContainer.offsetHeight === 0) {
				//hiding is done
				tocContainer.classList.remove("ub-hiding");
				tocContainer.classList.add("ub-hide");
				tocExtraContainer.classList.remove("ub-hiding");
				tocExtraContainer.classList.add("ub-hide");
				if (containerStyle.display === "block") {
					containerStyle.display = "";
				}
				if (extraContainerStyle.display === "block") {
					extraContainerStyle.display = "";
				}
				mainStyle.minWidth = "";
			}
			Object.assign(containerStyle, {
				height: "",
				width: "",
			});
			Object.assign(extraContainerStyle, {
				height: "",
				width: "",
			});
			mainStyle.width = "";
		});
	});
	if (window.location.hash) {
		const sourceToC = document.querySelector(".ub_table-of-contents");
		if (sourceToC) {
			const type = sourceToC.dataset.scrolltype;
			const offset =
				type === "fixedamount" ? sourceToC.dataset.scrollamount : 0;
			const target =
				type === "namedelement" ? sourceToC.dataset.scrolltarget : "";
			setTimeout(() => ub_hashHeaderScroll(type, target, offset), 50);
		}
	}
});

window.onhashchange = function () {
	const sourceToC = document.querySelector(".ub_table-of-contents");

	if (sourceToC) {
		const type = sourceToC.dataset.scrolltype;
		const offset = type === "fixedamount" ? sourceToC.dataset.scrollamount : 0;
		const target =
			type === "namedelement" ? sourceToC.dataset.scrolltarget : "";
		ub_hashHeaderScroll(type, target, offset);
	}
};

Array.prototype.slice
	.call(document.querySelectorAll(".ub_table-of-contents-container li > a"))
	.forEach((link) => {
		link.addEventListener("click", (e) => {
			const hashlessLink = link.href.replace(link.hash, "");
			const targetPageNumber = /[?&]page=\d+/g.exec(hashlessLink);
			const currentPageNumber = /[?&]page=\d+/g.exec(window.location.search);
			if (
				window.location.href.includes(hashlessLink) &&
				(currentPageNumber === null ||
					(targetPageNumber && currentPageNumber[0] === targetPageNumber[0]))
			) {
				const tocData = link.closest(".ub_table-of-contents").dataset;
				const type = tocData.scrolltype;
				const offset = type === "fixedamount" ? tocData.scrollamount : 0;
				const target = type === "namedelement" ? tocData.scrolltarget : "";
				e.preventDefault();
				history.pushState(null, "", link.hash);
				ub_hashHeaderScroll(type, target, offset);
			}
		});
	});
