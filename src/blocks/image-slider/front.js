document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		if (Flickity) {
			Array.prototype.slice
				.call(document.getElementsByClassName("ub_image_slider"))
				.forEach((instance) => {
					if (instance.querySelector("[data-flickity]")) {
						Flickity.data(instance.querySelector("[data-flickity]")).resize();
					}
				});
		} else {
			window.dispatchEvent(new Event("resize"));
		}
	}, 5000);
});
