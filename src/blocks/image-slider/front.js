Array.prototype.slice
	.call(document.getElementsByClassName("ub_image_slider"))
	.forEach((instance) => {
		const swiper = new Swiper(
			`#${instance.id}`,
			JSON.parse(instance.dataset.swiperData)
		);

		instance
			.getElementsByClassName("swiper-button-next")[0]
			.addEventListener("keydown", (e) => {
				if (e.key === " ") {
					e.preventDefault();
				}
			});

		instance
			.getElementsByClassName("swiper-button-prev")[0]
			.addEventListener("keydown", (e) => {
				if (e.key === " ") {
					e.preventDefault();
				}
			});

		Array.prototype.slice
			.call(instance.getElementsByClassName("swiper-pagination-bullet"))
			.forEach((bullet) => {
				bullet.addEventListener("keydown", (e) => {
					if (e.key === " ") {
						e.preventDefault();
					}
				});
			});
	});
