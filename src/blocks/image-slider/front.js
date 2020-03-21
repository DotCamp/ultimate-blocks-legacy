document.addEventListener("DOMContentLoaded", function() {
	Array.prototype.slice
		.call(document.getElementsByClassName("ub_image_slider"))
		.forEach(instance => {
			Flickity.data(instance.querySelector("[data-flickity]")).resize();
		});
});
