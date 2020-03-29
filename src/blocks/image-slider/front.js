document.addEventListener("DOMContentLoaded", function() {
	Array.prototype.slice
		.call(document.getElementsByClassName("ub_image_slider"))
		.forEach(instance => {
			if (instance.querySelector("[data-flickity]")) {
				Flickity.data(instance.querySelector("[data-flickity]")).resize();
			}
		});
});
