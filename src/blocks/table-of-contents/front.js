if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		let el = this;

		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

document.addEventListener("DOMContentLoaded", function() {
	let instances = [];
	if (document.getElementById("ub_table-of-contents-toggle-link")) {
		instances.push(document.getElementById("ub_table-of-contents-toggle-link"));
	} else {
		instances = Array.prototype.slice.call(
			document.getElementsByClassName("ub_table-of-contents-toggle-link")
		);
	}
	instances.forEach(instance => {
		let tocHeight;

		const block = instance.closest(".ub_table-of-contents");
		const tocContainer = block.querySelector(".ub_table-of-contents-container");

		const containerStyle = tocContainer.style;

		const tocMain = tocContainer.parentNode;
		const mainStyle = tocMain.style;

		const showButton = block.getAttribute("data-showtext") || "show";
		const hideButton = block.getAttribute("data-hidetext") || "hide";

		const initialHide =
			tocContainer.classList.contains("ub-hide") ||
			containerStyle.height === "0px" ||
			getComputedStyle(tocContainer).display === "none";
		if (initialHide) {
			tocContainer.classList.remove("ub-hide");
			containerStyle.display = "";
			containerStyle.height = "";
			tocMain.classList.remove("ub_table-of-contents-collapsed");
		}

		if (initialHide) {
			tocContainer.classList.add("ub-hide");
			tocMain.classList.add("ub_table-of-contents-collapsed");
		}

		tocContainer.removeAttribute("style");

		instance.addEventListener("click", function(event) {
			event.preventDefault();
			const curWidth = tocMain.offsetWidth;
			if (tocMain.classList.contains("ub_table-of-contents-collapsed")) {
				//begin showing

				tocContainer.classList.remove("ub-hide");
				if (tocHeight !== getComputedStyle(tocContainer).height) {
					tocHeight = getComputedStyle(tocContainer).height;
				}

				tocContainer.classList.add("ub-hiding");

				mainStyle.width = `${curWidth}px`;

				setTimeout(() => {
					tocMain.classList.remove("ub_table-of-contents-collapsed");
					containerStyle.height = tocHeight;
					containerStyle.width = "100%";
					tocContainer.classList.remove("ub-hiding");
					mainStyle.width = "100%";
				}, 50);
			} else {
				//begin hiding
				mainStyle.width = `${tocMain.offsetWidth}px`;
				containerStyle.width = `${tocContainer.offsetWidth}px`;
				containerStyle.height = `${tocContainer.offsetHeight}px`;
				setTimeout(() => {
					mainStyle.minWidth = "fit-content";
					mainStyle.width = "0px";
					tocContainer.classList.add("ub-hiding");
					containerStyle.height = "0";
					containerStyle.width = "0";
				}, 50);
			}

			instance.innerHTML = tocContainer.classList.contains("ub-hiding")
				? hideButton
				: showButton;
		});

		tocContainer.addEventListener("transitionend", function() {
			if (tocContainer.offsetHeight === 0) {
				//hiding is done
				tocContainer.classList.remove("ub-hiding");
				tocContainer.classList.add("ub-hide");
				if (containerStyle.display === "block") {
					containerStyle.display = "";
				}
				tocMain.classList.add("ub_table-of-contents-collapsed");
				mainStyle.minWidth = "";
			}
			containerStyle.width = "";
			containerStyle.height = "";
			mainStyle.width = "";
		});
	});
});
