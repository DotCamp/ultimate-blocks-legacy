class UltimateBlocksCounter {
	constructor(wrapper) {
		this.container = wrapper;
		this.counterNumber = this.container.querySelector(".ub_counter-number");
		this.startCount = parseInt(this.container.dataset.start_num, 10);
		this.stopCounter = parseInt(this.container.dataset.end_num, 10);
		this.animationDuration = parseInt(
			this.container.dataset.animation_duration,
			10,
		);
		this.frameDuration = 1000 / 60;
		this.totalFrames = Math.round(
			(this.animationDuration * 1000) / this.frameDuration,
		);
		this.easeOutQuad = (t) => t * (2 - t);
		this.initialize();
	}
	initialize() {
		this.updateCounter();
	}
	updateCounter() {
		let frame = 0;
		const countTo = this.stopCounter - this.startCount;

		let interval = setInterval(() => {
			frame++;

			const progress = this.easeOutQuad(frame / this.totalFrames);
			const currentCount = Math.round(countTo * progress) + this.startCount;

			if (parseInt(this.counterNumber.innerHTML, 10) !== currentCount) {
				this.counterNumber.innerHTML = currentCount;
			}

			if (frame === this.totalFrames) {
				clearInterval(interval);
			}
		}, this.frameDuration);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelectorAll(".ub_counter");
	container.forEach((wrapper) => new UltimateBlocksCounter(wrapper));
});
