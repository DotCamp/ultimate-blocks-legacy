Array.prototype.slice
	.call(document.getElementsByClassName("ub_image_slider"))
	.forEach((instance) => {
		const swiper = new Swiper(
			`#${instance.id}`,
			JSON.parse(instance.dataset.swiperData)
		);
	});
